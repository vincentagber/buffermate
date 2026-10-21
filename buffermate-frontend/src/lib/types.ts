/**
 * Common TypeScript types and interfaces used throughout BufferMate
 */

export type SocialChannel = 'instagram' | 'tiktok' | 'facebook' | 'threads' | 'whatsapp' | 'x' | 'twitter' | 'linkedin' | 'mock';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  provider: SocialChannel;
  provider_user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  access_token_encrypted?: string;
  meta?: Record<string, any>;
  status?: 'active' | 'ready' | 'disconnected';
  created_at: string;
}

export interface SocialAutomation {
  id: string;
  user_id?: string;
  name: string;
  channel: SocialChannel;
  trigger_type: 'comment_keyword' | 'dm_received' | 'story_reply' | 'spam_filter' | 'new_follower';
  keywords: string[];
  reply_comment: string;
  dm_message: string;
  link_url?: string;
  status: 'active' | 'paused' | 'draft';
  runs_today: number;
  runs_total: number;
  leads_captured: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityEvent {
  id: string;
  user_id?: string;
  event_type: 'auto_dm' | 'lead_captured' | 'comment_replied' | 'post_published' | 'story_reply' | 'ai_autopost';
  channel: SocialChannel;
  title: string;
  description: string;
  user_handle?: string;
  post_reference?: string;
  time_ago?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface SocialLead {
  id: string;
  user_id?: string;
  handle: string;
  name?: string;
  channel: SocialChannel;
  keyword_triggered?: string;
  automation_id?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  last_interaction: string;
  notes?: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  workspace_id?: string;
  social_account_ids?: string[];
  channels?: SocialChannel[];
  content: string;
  scheduled_at: string;
  posted_at?: string;
  status: 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'scheduled' | 'queued' | 'posting' | 'publishing' | 'posted' | 'published' | 'partially_published' | 'failed' | 'canceled';
  approval_state?: PostApprovalState;
  content_version?: number;
  approved_by?: string;
  approved_at?: string;
  attachments?: Array<{ type: string; url?: string; thumbnail?: string }>;
  provider_results?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface AiAutoPostConfig {
  id?: string;
  user_id?: string;
  enabled: boolean;
  niche: string;
  tone: string;
  target_channels: SocialChannel[];
  frequency_per_day: number;
  auto_publish: boolean;
  last_generated_at?: string;
}

export interface AiSuggestedPost {
  id: string;
  topic: string;
  hook: string;
  content: string;
  hashtags: string[];
  recommended_time: string;
  target_channels: SocialChannel[];
  call_to_action: string;
  estimated_engagement: string;
}

// ============================================================================
// PRD DOMAIN MODELS: WORKSPACES, RBAC, PUBLISHING & AUTOPILOT
// ============================================================================

export type WorkspaceRole = 
  | 'owner'
  | 'admin'
  | 'strategist'
  | 'creator'
  | 'community_manager'
  | 'analyst'
  | 'approver';

export type PermissionAction =
  | 'workspace:manage'
  | 'members:manage'
  | 'connections:manage'
  | 'billing:manage'
  | 'campaigns:manage'
  | 'content:create'
  | 'content:edit'
  | 'content:delete'
  | 'content:submit_for_approval'
  | 'content:approve'
  | 'content:publish'
  | 'inbox:read'
  | 'inbox:reply'
  | 'analytics:view'
  | 'automation:manage'
  | 'automation:kill_switch';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  default_locale: string;
  plan_id: string;
  owner_user_id?: string;
  settings: {
    autopilot_killed?: boolean;
    require_approval?: boolean;
    default_publish_time?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  status: 'active' | 'invited' | 'suspended';
  invited_by?: string;
  joined_at: string;
}

export interface AuditLog {
  id: string;
  workspace_id: string;
  actor_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata_redacted: Record<string, any>;
  created_at: string;
}

export type ProviderCapability =
  | 'create_text'
  | 'publish_image'
  | 'publish_video'
  | 'publish_carousel'
  | 'schedule'
  | 'comments_read'
  | 'comments_reply'
  | 'inbox_read'
  | 'inbox_reply'
  | 'insights_read'
  | 'ads_manage'
  | 'account_metrics';

export interface PostValidationResult {
  valid: boolean;
  platform: SocialChannel;
  errors: string[];
  warnings?: string[];
  characterCount: number;
  maxCharacters: number;
  supportsMedia: boolean;
  requiresMedia: boolean;
}

export type PostApprovalState = 'draft' | 'in_review' | 'changes_requested' | 'approved';

export type PublishJobStatus = 
  | 'scheduled'
  | 'publishing'
  | 'processing'
  | 'published'
  | 'partially_published'
  | 'failed'
  | 'unknown_reconciling'
  | 'canceled';

export interface PublishJob {
  id: string;
  workspace_id: string;
  post_id: string;
  variant_id?: string;
  social_account_id?: string;
  platform: SocialChannel;
  scheduled_at: string;
  status: PublishJobStatus;
  idempotency_key: string;
  attempts: number;
  max_retries: number;
  next_attempt_at?: string;
  lock_acquired_at?: string;
  lock_expires_at?: string;
  error_code?: string;
  error_message?: string;
  external_post_id?: string;
  external_post_url?: string;
  last_reconciled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PublishAttempt {
  id: string;
  publish_job_id: string;
  post_id: string;
  platform: SocialChannel;
  started_at: string;
  finished_at?: string;
  provider_request_id?: string;
  provider_post_id?: string;
  outcome: 'success' | 'transient_failure' | 'permanent_failure' | 'ambiguous_timeout';
  error_code?: string;
  sanitized_details?: Record<string, any>;
}

export type ApprovalDecision = 'approved' | 'changes_requested' | 'rejected';

export interface ApprovalRecord {
  id: string;
  workspace_id: string;
  post_id: string;
  version: number;
  reviewer_id: string;
  decision: ApprovalDecision;
  feedback?: string;
  decided_at: string;
}

export interface AutopilotGuardrails {
  rate_limit_per_hour: number;
  quiet_hours_start: string; // HH:mm local
  quiet_hours_end: string;   // HH:mm local
  restricted_keywords: string[];
  max_daily_actions: number;
}

export interface AutopilotRule {
  id: string;
  workspace_id: string;
  name: string;
  enabled: boolean;
  trigger_type: string;
  conditions: Record<string, any>;
  action: Record<string, any>;
  guardrails: AutopilotGuardrails;
  dry_run: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface AutopilotRun {
  id: string;
  workspace_id: string;
  rule_id: string;
  trigger_ref?: string;
  status: 'completed' | 'blocked_guardrail' | 'failed' | 'dry_run_success';
  decision: Record<string, any>;
  action_result: Record<string, any>;
  is_dry_run: boolean;
  started_at: string;
  finished_at?: string;
}

// PRD Section 19: Structured Dashboard Data Contract
export interface CommandCenterDataContract {
  workspace: {
    id: string;
    name: string;
    timezone: string;
    role?: WorkspaceRole;
  };
  asOf: string; // ISO timestamp
  pipeline: {
    value: number;
    currency: string;
    changePercent: number;
    periodDays: number;
    attributionMethod: 'crm_campaign_match' | 'first_touch_social' | 'last_touch_social' | 'multi_touch_modeled';
    dataStatus: 'available' | 'partial' | 'unavailable';
    isEstimate: boolean;
  };
  qualifiedLeads: {
    value: number;
    changePercent: number;
    periodDays: number;
    definition: string;
    source: string;
  };
  goals: Array<{
    id: string;
    name: string;
    current: number;
    target: number;
    unit: string;
    status: 'on_track' | 'at_risk' | 'behind' | 'completed';
    owner?: string;
    due_at?: string;
  }>;
  autopilot: {
    enabled: boolean;
    killed: boolean;
    actionsToday: number;
    escalated: number;
    blocked: number;
    rolledBack: number;
    lastRunAt?: string;
  };
  attention: Array<{
    type: 'approval_pending' | 'connection_needs_reauth' | 'failed_publish' | 'expiring_token' | 'unanswered_message';
    count: number;
    message: string;
    actionUrl: string;
  }>;
}

