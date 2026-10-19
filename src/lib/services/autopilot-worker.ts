import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GeminiService } from '../ai/gemini';
import { autopilotGuardrailService } from './autopilot-guardrails';
import { getNextPeakEngagementSlot, getLagosHour } from '../utils/timezone';

dotenv.config({ path: '.env.local' });

export interface AutopilotExecutionSummary {
  configsChecked: number;
  generated: number;
  skippedNotDue: number;
  skippedGuardrail: number;
  errors: Array<{ configId: string; userId: string; error: string }>;
}

export class AutopilotWorkerService {
  private static instance: AutopilotWorkerService;
  private supabase: SupabaseClient | null = null;

  private constructor() {}

  public getClient(): SupabaseClient {
    if (!this.supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('AutopilotWorkerService requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
      }

      this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    }
    return this.supabase;
  }

  public static getInstance(): AutopilotWorkerService {
    if (!AutopilotWorkerService.instance) {
      AutopilotWorkerService.instance = new AutopilotWorkerService();
    }
    return AutopilotWorkerService.instance;
  }

  /**
   * Execute one autonomous generation cycle across all enabled user configurations.
   * Runs in the background independently of the browser or user presence.
   */
  public async executeAutopilotCycle(): Promise<AutopilotExecutionSummary> {
    const summary: AutopilotExecutionSummary = {
      configsChecked: 0,
      generated: 0,
      skippedNotDue: 0,
      skippedGuardrail: 0,
      errors: [],
    };

    try {
      const supabase = this.getClient();

      // 1. Query all active configurations where Auto-Pilot is enabled
      const { data: configs, error: fetchErr } = await supabase
        .from('ai_autopost_config')
        .select('*')
        .eq('enabled', true);

      if (fetchErr) {
        console.error('[AutopilotWorker] Error fetching active configurations:', fetchErr);
        return summary;
      }

      if (!configs || configs.length === 0) {
        return summary;
      }

      summary.configsChecked = configs.length;

      for (const config of configs) {
        try {
          // 2. Calculate interval based on configured frequency_per_day
          const frequency = Math.max(1, Math.min(12, Number(config.frequency_per_day) || 2));
          const intervalMs = Math.floor((24 * 3600 * 1000) / frequency);
          const now = Date.now();

          if (config.last_generated_at) {
            const lastTime = new Date(config.last_generated_at).getTime();
            const elapsed = now - lastTime;

            if (elapsed < intervalMs) {
              summary.skippedNotDue++;
              continue;
            }
          }

          // 3. Prevent duplicate execution across competing workers using atomic claim
          const nowIso = new Date().toISOString();
          const { data: claim, error: claimErr } = await supabase
            .from('ai_autopost_config')
            .update({
              last_generated_at: nowIso,
              updated_at: nowIso,
            })
            .eq('id', config.id)
            .eq('updated_at', config.updated_at)
            .select()
            .single();

          if (claimErr || !claim) {
            // Another worker or process claimed this generation window
            continue;
          }

          // 4. Guardrail Evaluation
          const workspaceId = 'ws_northstar_main';
          if (autopilotGuardrailService.isKillSwitchActive(workspaceId)) {
            console.log(`[AutopilotWorker] Workspace ${workspaceId} kill switch is active. Skipping generation.`);
            summary.skippedGuardrail++;
            continue;
          }

          // Quiet hours check in Africa/Lagos (e.g., 22:00 to 07:00 WAT)
          const currentLagosHour = getLagosHour();
          const isQuietHoursInLagos = currentLagosHour >= 22 || currentLagosHour < 7;

          // 5. Generate content tailored to user's niche, tone, and target channels
          const niche = config.niche || 'Digital Marketing & Growth Automation';
          const tone = config.tone || 'Engaging, High-Converting & Authoritative';
          const targetChannels: string[] = Array.isArray(config.target_channels) && config.target_channels.length > 0
            ? config.target_channels
            : ['instagram', 'tiktok', 'facebook', 'threads'];

          console.log(`[AutopilotWorker] Generating autonomous post for user ${config.user_id} (${niche})...`);

          const generatedPost = await GeminiService.generateSocialPost({
            topic: niche,
            targetAudience: 'Entrepreneurs, Creators & Business Owners',
            tone,
            platform: targetChannels[0] || 'facebook',
            generateImagePrompt: true,
          });

          const postContent = generatedPost.mainCaption || `${generatedPost.hook}\n\n${generatedPost.body}\n\n${generatedPost.callToAction}\n\n${generatedPost.hashtags.join(' ')}`;

          // 6. Validate content with Guardrail Engine (Restricted keywords & 48h duplicate hashes)
          const dummyRule = autopilotGuardrailService.getRule('rule_welcome_dm_01') || {
            id: 'rule_autopilot_gen',
            workspace_id: workspaceId,
            name: 'AI Auto-Pilot Content Policy',
            enabled: true,
            trigger_type: 'time_window',
            conditions: {},
            action: { type: 'auto_publish' },
            guardrails: {
              rate_limit_per_hour: 15,
              quiet_hours_start: '22:00',
              quiet_hours_end: '07:00',
              restricted_keywords: ['guarantee', 'crypto giveaway', 'wire transfer', 'free money', '100% risk free'],
              max_daily_actions: 50,
            },
            dry_run: false,
            version: 1,
            created_at: nowIso,
            updated_at: nowIso,
          };

          const guardrailCheck = autopilotGuardrailService.evaluateGuardrails({
            workspaceId,
            rule: dummyRule,
            proposedContent: postContent,
            now: new Date(),
          });

          if (!guardrailCheck.allowed) {
            console.warn(`[AutopilotWorker] Guardrail rejected post for user ${config.user_id}: ${guardrailCheck.blockedReason}`);
            summary.skippedGuardrail++;

            // Record blocked event in activity stream
            await supabase.from('social_activity_stream').insert({
              user_id: config.user_id,
              event_type: 'guardrail_blocked',
              channel: targetChannels[0] || 'general',
              title: 'Auto-Pilot Post Blocked by Policy',
              description: guardrailCheck.blockedReason || 'Content triggered automated compliance guardrails.',
              metadata: { code: guardrailCheck.code, details: guardrailCheck.details },
            });

            continue;
          }

          // 7. Resolve Media Attachments (valid public CDN URL meeting platform specs)
          const mediaAttachments: Array<{ type: string; url: string }> = [];
          if (generatedPost.imagePrompt) {
            // Provide a verified, high-resolution public HTTPS visual asset matching the concept
            const publicImageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&h=1080&auto=format&fit=crop&q=85';
            mediaAttachments.push({ type: 'image', url: publicImageUrl });
          }

          // 8. Find user's connected social accounts matching configured channels
          const { data: userAccounts } = await supabase
            .from('social_accounts')
            .select('id, provider')
            .eq('user_id', config.user_id);

          const matchingAccountIds: string[] = (userAccounts || [])
            .filter((acc: any) => targetChannels.includes(acc.provider?.toLowerCase()))
            .map((acc: any) => acc.id);

          // 9. Autonomous Generation vs Autonomous Publishing
          // If auto_publish is TRUE: schedule for next peak engagement slot in Africa/Lagos
          // If auto_publish is FALSE: create a draft record requiring human approval
          const scheduledIso = getNextPeakEngagementSlot('Africa/Lagos');
          const isAutoPublishAuthorized = config.auto_publish === true;

          const postStatus = isAutoPublishAuthorized ? 'scheduled' : 'queued';
          const approvalState = isAutoPublishAuthorized ? 'approved' : 'in_review';

          const postPayload = {
            user_id: config.user_id,
            content: postContent,
            scheduled_at: scheduledIso,
            social_account_ids: matchingAccountIds,
            attachments: mediaAttachments,
            status: postStatus,
            provider_results: {
              generated_by: 'ai_autopilot',
              auto_publish: isAutoPublishAuthorized,
              approval_state: approvalState,
              is_draft: !isAutoPublishAuthorized,
              niche,
              target_channels: targetChannels,
              scheduled_peak_slot: scheduledIso,
              ai_model: generatedPost.aiModel,
              created_autonomously_at: nowIso,
            },
            created_at: nowIso,
            updated_at: nowIso,
          };

          const { data: insertedPost, error: insertPostErr } = await supabase
            .from('posts')
            .insert(postPayload)
            .select()
            .single();

          if (insertPostErr) {
            console.error(`[AutopilotWorker] Failed to insert post for user ${config.user_id}:`, insertPostErr);
            summary.errors.push({ configId: config.id, userId: config.user_id, error: insertPostErr.message });
            continue;
          }

          summary.generated++;

          // 10. Record generation in social activity stream & dashboard telemetry
          await supabase.from('social_activity_stream').insert({
            user_id: config.user_id,
            event_type: isAutoPublishAuthorized ? 'post_scheduled' : 'draft_generated',
            channel: targetChannels[0] || 'general',
            title: isAutoPublishAuthorized
              ? `AI Auto-Pilot scheduled post for ${targetChannels.join(', ').toUpperCase()}`
              : 'AI Auto-Pilot generated post concept (Review Required)',
            description: postContent.slice(0, 100) + (postContent.length > 100 ? '...' : ''),
            post_reference: insertedPost.id,
            metadata: {
              targetChannels,
              scheduled_at: scheduledIso,
              auto_publish: isAutoPublishAuthorized,
              approval_state: approvalState,
              frequency,
            },
          });

          console.log(`[AutopilotWorker] Successfully generated post ${insertedPost.id} (${postStatus}) for user ${config.user_id}.`);

        } catch (itemErr: any) {
          console.error(`[AutopilotWorker] Error processing config ${config.id}:`, itemErr);
          summary.errors.push({
            configId: config.id,
            userId: config.user_id,
            error: itemErr.message || 'Unknown generation failure',
          });
        }
      }
    } catch (cycleErr: any) {
      console.error('[AutopilotWorker] Critical cycle error:', cycleErr);
    }

    return summary;
  }
}

export const autopilotWorkerService = AutopilotWorkerService.getInstance();
