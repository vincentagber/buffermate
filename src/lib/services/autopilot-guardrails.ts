import { 
  AutopilotRule, 
  AutopilotRun, 
  AutopilotGuardrails, 
  SocialChannel 
} from '../types';
import { workspaceService } from './rbac';

export interface GuardrailEvaluationContext {
  workspaceId: string;
  rule: AutopilotRule;
  channel?: SocialChannel;
  proposedContent?: string;
  now?: Date;
  workspaceTimezone?: string;
}

export interface GuardrailEvaluationResult {
  allowed: boolean;
  blockedReason?: string;
  code?: 'KILL_SWITCH_ACTIVE' | 'QUIET_HOURS' | 'RATE_LIMIT_EXCEEDED' | 'DAILY_CAP_EXCEEDED' | 'RESTRICTED_KEYWORD' | 'DUPLICATE_CONTENT';
  details?: Record<string, any>;
}

class AutopilotGuardrailService {
  private static instance: AutopilotGuardrailService;
  private rules: Map<string, AutopilotRule> = new Map();
  private runs: AutopilotRun[] = [];
  private killSwitches: Map<string, boolean> = new Map(); // workspaceId -> isKilled
  private recentContentHashes: Map<string, Array<{ hash: string; timestamp: number }>> = new Map(); // workspaceId -> content hashes
  private hourlyActionTimestamps: Map<string, number[]> = new Map(); // workspaceId:channel -> timestamps

  private constructor() {
    this.seedDefaultRules();
  }

  public static getInstance(): AutopilotGuardrailService {
    if (!AutopilotGuardrailService.instance) {
      AutopilotGuardrailService.instance = new AutopilotGuardrailService();
    }
    return AutopilotGuardrailService.instance;
  }

  private seedDefaultRules() {
    const defaultRule: AutopilotRule = {
      id: 'rule_welcome_dm_01',
      workspace_id: 'ws_northstar_main',
      name: 'Smart Lead Auto-Responder',
      enabled: true,
      trigger_type: 'dm_received',
      conditions: { contains_intent: 'pricing_or_demo' },
      action: { type: 'send_dm', template: 'Hey! Thanks for connecting. Here is our direct VIP link to book a strategy call: https://buffermate.ai/vip' },
      guardrails: {
        rate_limit_per_hour: 10,
        quiet_hours_start: '22:00',
        quiet_hours_end: '07:00',
        restricted_keywords: [
          'guarantee', 
          'crypto giveaway', 
          'wire transfer', 
          'free money', 
          '100% risk free',
          'double your investment'
        ],
        max_daily_actions: 50,
      },
      dry_run: false,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.rules.set(defaultRule.id, defaultRule);
  }

  // --- 1. KILL SWITCH MANAGEMENT ---

  public isKillSwitchActive(workspaceId: string): boolean {
    return this.killSwitches.get(workspaceId) || false;
  }

  public triggerKillSwitch(
    workspaceId: string, 
    actorId: string, 
    reason: string = 'Emergency kill switch triggered by user'
  ): { success: boolean; killed: boolean } {
    this.killSwitches.set(workspaceId, true);

    workspaceService.recordAuditLog(
      workspaceId,
      actorId,
      'autopilot:kill_switch_triggered',
      'workspace_autopilot',
      workspaceId,
      { reason, timestamp: new Date().toISOString() }
    );

    return { success: true, killed: true };
  }

  public resumeAutopilot(
    workspaceId: string, 
    actorId: string
  ): { success: boolean; killed: boolean } {
    this.killSwitches.set(workspaceId, false);

    workspaceService.recordAuditLog(
      workspaceId,
      actorId,
      'autopilot:resumed',
      'workspace_autopilot',
      workspaceId,
      { timestamp: new Date().toISOString() }
    );

    return { success: true, killed: false };
  }

  // --- 2. GUARDRAIL CHECKS ---

  public evaluateGuardrails(ctx: GuardrailEvaluationContext): GuardrailEvaluationResult {
    const { workspaceId, rule, proposedContent, now = new Date() } = ctx;

    // Check 1: Emergency Kill Switch
    if (this.isKillSwitchActive(workspaceId)) {
      return {
        allowed: false,
        code: 'KILL_SWITCH_ACTIVE',
        blockedReason: 'Emergency kill switch is currently active for this workspace. All automated actions are paused.',
      };
    }

    // Check 2: Disabled rule check
    if (!rule.enabled) {
      return {
        allowed: false,
        blockedReason: `Rule '${rule.name}' is currently disabled.`,
      };
    }

    const guardrails = rule.guardrails;

    // Check 3: Quiet Hours Check (local time)
    if (guardrails.quiet_hours_start && guardrails.quiet_hours_end) {
      const isQuietTime = this.isInQuietHours(now, guardrails.quiet_hours_start, guardrails.quiet_hours_end);
      if (isQuietTime) {
        return {
          allowed: false,
          code: 'QUIET_HOURS',
          blockedReason: `Action blocked by Quiet Hours policy (${guardrails.quiet_hours_start} to ${guardrails.quiet_hours_end}).`,
          details: { quietHoursStart: guardrails.quiet_hours_start, quietHoursEnd: guardrails.quiet_hours_end },
        };
      }
    }

    // Check 4: Restricted Keywords
    if (proposedContent && guardrails.restricted_keywords && guardrails.restricted_keywords.length > 0) {
      const lowerContent = proposedContent.toLowerCase();
      for (const keyword of guardrails.restricted_keywords) {
        if (lowerContent.includes(keyword.toLowerCase())) {
          return {
            allowed: false,
            code: 'RESTRICTED_KEYWORD',
            blockedReason: `Action contains restricted keyword: '${keyword}'. Escalated for human review.`,
            details: { detectedKeyword: keyword },
          };
        }
      }
    }

    // Check 5: Hourly Rate Limits
    const rateLimitKey = `${workspaceId}:${ctx.channel || 'all'}`;
    const pastHourTimestamps = (this.hourlyActionTimestamps.get(rateLimitKey) || []).filter(
      (ts) => now.getTime() - ts < 3600 * 1000
    );

    if (pastHourTimestamps.length >= guardrails.rate_limit_per_hour) {
      return {
        allowed: false,
        code: 'RATE_LIMIT_EXCEEDED',
        blockedReason: `Hourly rate limit exceeded (${pastHourTimestamps.length}/${guardrails.rate_limit_per_hour} actions).`,
        details: { actionsInPastHour: pastHourTimestamps.length, limit: guardrails.rate_limit_per_hour },
      };
    }

    // Check 6: Duplicate Content Prevention (last 48 hours)
    if (proposedContent) {
      const contentHash = this.computeContentHash(proposedContent);
      const recentHashes = (this.recentContentHashes.get(workspaceId) || []).filter(
        (h) => now.getTime() - h.timestamp < 48 * 3600 * 1000
      );

      if (recentHashes.some((h) => h.hash === contentHash)) {
        return {
          allowed: false,
          code: 'DUPLICATE_CONTENT',
          blockedReason: 'Identical content was already posted or dispatched within the last 48 hours.',
          details: { contentHash },
        };
      }
    }

    return { allowed: true };
  }

  // --- 3. RULE EXECUTION & DRY-RUN ENGINE ---

  public async executeRule(
    ruleId: string, 
    triggerPayload: any, 
    overrideDryRun?: boolean,
    actorId?: string
  ): Promise<AutopilotRun> {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Autopilot rule '${ruleId}' not found`);
    }

    const isDryRun = overrideDryRun !== undefined ? overrideDryRun : rule.dry_run;
    const proposedContent = triggerPayload?.content || rule.action?.template || '';
    const now = new Date();

    const guardrailCheck = this.evaluateGuardrails({
      workspaceId: rule.workspace_id,
      rule,
      proposedContent,
      channel: triggerPayload?.channel,
      now,
    });

    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // If blocked by guardrail
    if (!guardrailCheck.allowed) {
      const blockedRun: AutopilotRun = {
        id: runId,
        workspace_id: rule.workspace_id,
        rule_id: rule.id,
        trigger_ref: triggerPayload?.trigger_ref || 'event_trigger',
        status: 'blocked_guardrail',
        decision: {
          allowed: false,
          code: guardrailCheck.code,
          reason: guardrailCheck.blockedReason,
          details: guardrailCheck.details,
        },
        action_result: { executed: false, reason: guardrailCheck.blockedReason },
        is_dry_run: isDryRun,
        started_at: now.toISOString(),
        finished_at: new Date().toISOString(),
      };

      this.runs.unshift(blockedRun);
      workspaceService.recordAuditLog(
        rule.workspace_id,
        actorId,
        'autopilot:rule_blocked',
        'autopilot_run',
        blockedRun.id,
        { ruleName: rule.name, reason: guardrailCheck.blockedReason }
      );
      return blockedRun;
    }

    // If Dry-Run: Simulate without any side-effects
    if (isDryRun) {
      const dryRun: AutopilotRun = {
        id: runId,
        workspace_id: rule.workspace_id,
        rule_id: rule.id,
        trigger_ref: triggerPayload?.trigger_ref || 'simulated_trigger',
        status: 'dry_run_success',
        decision: {
          allowed: true,
          simulation: true,
          evaluatedGuardrails: 'All guardrails passed (dry-run simulation mode)',
        },
        action_result: {
          executed: false,
          simulatedPayload: {
            actionType: rule.action?.type,
            renderedMessage: proposedContent,
            targetChannel: triggerPayload?.channel || 'all',
          },
          message: 'Simulation completed. No live messages or posts were created.',
        },
        is_dry_run: true,
        started_at: now.toISOString(),
        finished_at: new Date().toISOString(),
      };

      this.runs.unshift(dryRun);
      return dryRun;
    }

    // Live Execution: Record action and content hash
    this.recordActionExecution(rule.workspace_id, triggerPayload?.channel, proposedContent, now);

    const liveRun: AutopilotRun = {
      id: runId,
      workspace_id: rule.workspace_id,
      rule_id: rule.id,
      trigger_ref: triggerPayload?.trigger_ref || 'live_trigger',
      status: 'completed',
      decision: { allowed: true, evaluatedGuardrails: 'All guardrails passed' },
      action_result: {
        executed: true,
        actionType: rule.action?.type,
        dispatchedAt: new Date().toISOString(),
      },
      is_dry_run: false,
      started_at: now.toISOString(),
      finished_at: new Date().toISOString(),
    };

    this.runs.unshift(liveRun);

    workspaceService.recordAuditLog(
      rule.workspace_id,
      actorId,
      'autopilot:rule_executed',
      'autopilot_run',
      liveRun.id,
      { ruleName: rule.name, actionType: rule.action?.type }
    );

    return liveRun;
  }

  private recordActionExecution(workspaceId: string, channel: string | undefined, content: string, now: Date) {
    const rateLimitKey = `${workspaceId}:${channel || 'all'}`;
    const list = this.hourlyActionTimestamps.get(rateLimitKey) || [];
    list.push(now.getTime());
    this.hourlyActionTimestamps.set(rateLimitKey, list);

    if (content) {
      const hashes = this.recentContentHashes.get(workspaceId) || [];
      hashes.push({ hash: this.computeContentHash(content), timestamp: now.getTime() });
      this.recentContentHashes.set(workspaceId, hashes);
    }
  }

  private isInQuietHours(now: Date, startStr: string, endStr: string): boolean {
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startH * 60 + (startM || 0);
    const endMinutes = endH * 60 + (endM || 0);

    // Crosses midnight (e.g. 22:00 to 07:00)
    if (startMinutes > endMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  private computeContentHash(content: string): string {
    const clean = content.toLowerCase().replace(/\s+/g, ' ').trim();
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = ((hash << 5) - hash + clean.charCodeAt(i)) | 0;
    }
    return `h_${Math.abs(hash)}`;
  }

  public getRule(ruleId: string): AutopilotRule | undefined {
    return this.rules.get(ruleId);
  }

  public listRules(workspaceId: string): AutopilotRule[] {
    return Array.from(this.rules.values()).filter((r) => r.workspace_id === workspaceId);
  }

  public getRecentRuns(workspaceId: string, limit: number = 50): AutopilotRun[] {
    return this.runs.filter((r) => r.workspace_id === workspaceId).slice(0, limit);
  }

  public getTelemetry(workspaceId: string) {
    const runs = this.getRecentRuns(workspaceId, 200);
    const now = Date.now();
    const todayRuns = runs.filter((r) => now - new Date(r.started_at).getTime() < 24 * 3600 * 1000);

    return {
      enabled: !this.isKillSwitchActive(workspaceId),
      killed: this.isKillSwitchActive(workspaceId),
      actionsToday: todayRuns.filter((r) => r.status === 'completed').length,
      escalated: todayRuns.filter((r) => r.decision?.code === 'RESTRICTED_KEYWORD').length,
      blocked: todayRuns.filter((r) => r.status === 'blocked_guardrail').length,
      rolledBack: 0,
      lastRunAt: runs[0]?.started_at,
    };
  }
}

export const autopilotGuardrailService = AutopilotGuardrailService.getInstance();
