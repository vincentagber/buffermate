-- ==============================================================================
-- Migration 004: Multi-Workspace Tenant Isolation, RBAC & Publishing Engine
-- Aligned with PRD requirements for "Socially" Social Media Management SaaS
-- ==============================================================================

-- 1. Workspaces Table
create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text default 'UTC',
  default_locale text default 'en',
  plan_id text default 'pro',
  owner_user_id uuid references auth.users(id) on delete set null,
  settings jsonb default '{"autopilot_killed": false, "require_approval": true}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Workspace Members & RBAC
-- Roles: owner, admin, strategist, creator, community_manager, analyst, approver
create table if not exists workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in (
    'owner', 
    'admin', 
    'strategist', 
    'creator', 
    'community_manager', 
    'analyst', 
    'approver'
  )),
  status text default 'active' check (status in ('active', 'invited', 'suspended')),
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamp with time zone default now(),
  unique(workspace_id, user_id)
);

-- 3. Audit Logs (Tenant-scoped immutable audit trail)
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata_redacted jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- 4. Extend Posts & Social Accounts with workspace_id & approval states
alter table posts add column if not exists workspace_id uuid references workspaces(id) on delete cascade;
alter table posts add column if not exists approval_state text default 'draft' check (approval_state in ('draft', 'in_review', 'changes_requested', 'approved'));
alter table posts add column if not exists content_version integer default 1;
alter table posts add column if not exists approved_by uuid references auth.users(id) on delete set null;
alter table posts add column if not exists approved_at timestamp with time zone;

alter table social_accounts add column if not exists workspace_id uuid references workspaces(id) on delete cascade;
alter table social_accounts add column if not exists capabilities jsonb default '[]'::jsonb;
alter table social_accounts add column if not exists health_status text default 'connected' check (health_status in ('connected', 'needs_reauth', 'permission_missing', 'rate_limited', 'restricted', 'disconnected'));
alter table social_accounts add column if not exists last_sync_at timestamp with time zone;

-- 5. Approvals History
create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  version integer not null default 1,
  reviewer_id uuid references auth.users(id) on delete set null not null,
  decision text not null check (decision in ('approved', 'changes_requested', 'rejected')),
  feedback text,
  decided_at timestamp with time zone default now()
);

-- 6. Durable Publish Jobs (Destination-level granularity for partial success)
create table if not exists publish_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  variant_id uuid,
  social_account_id uuid references social_accounts(id) on delete cascade,
  platform text not null,
  scheduled_at timestamp with time zone not null,
  status text not null default 'scheduled' check (status in (
    'scheduled', 
    'publishing', 
    'processing', 
    'published', 
    'partially_published', 
    'failed', 
    'unknown_reconciling', 
    'canceled'
  )),
  idempotency_key text not null unique,
  attempts integer default 0,
  max_retries integer default 5,
  next_attempt_at timestamp with time zone,
  lock_acquired_at timestamp with time zone,
  lock_expires_at timestamp with time zone,
  error_code text,
  error_message text,
  external_post_id text,
  external_post_url text,
  last_reconciled_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 7. Publish Attempts Telemetry
create table if not exists publish_attempts (
  id uuid primary key default gen_random_uuid(),
  publish_job_id uuid references publish_jobs(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  platform text not null,
  started_at timestamp with time zone default now(),
  finished_at timestamp with time zone,
  provider_request_id text,
  provider_post_id text,
  outcome text not null check (outcome in ('success', 'transient_failure', 'permanent_failure', 'ambiguous_timeout')),
  error_code text,
  sanitized_details jsonb default '{}'::jsonb
);

-- 8. Autopilot Automation Rules & Guardrails
create table if not exists automation_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  enabled boolean default true,
  trigger_type text not null,
  conditions jsonb default '{}'::jsonb,
  action jsonb default '{}'::jsonb,
  guardrails jsonb default '{
    "rate_limit_per_hour": 10,
    "quiet_hours_start": "22:00",
    "quiet_hours_end": "07:00",
    "restricted_keywords": ["guarantee", "crypto giveaway", "urgent wire", "free money"],
    "max_daily_actions": 50
  }'::jsonb,
  dry_run boolean default false,
  version integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 9. Automation Execution Runs & Telemetry
create table if not exists automation_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  rule_id uuid references automation_rules(id) on delete cascade not null,
  trigger_ref text,
  status text not null check (status in ('completed', 'blocked_guardrail', 'failed', 'dry_run_success')),
  decision jsonb default '{}'::jsonb,
  action_result jsonb default '{}'::jsonb,
  is_dry_run boolean default false,
  started_at timestamp with time zone default now(),
  finished_at timestamp with time zone default now()
);

-- Indexes for performance & query isolation
create index if not exists idx_workspaces_slug on workspaces(slug);
create index if not exists idx_workspace_members_user on workspace_members(user_id, workspace_id);
create index if not exists idx_audit_logs_workspace on audit_logs(workspace_id, created_at desc);
create index if not exists idx_publish_jobs_queue on publish_jobs(scheduled_at, status) where status in ('scheduled', 'unknown_reconciling');
create index if not exists idx_publish_jobs_workspace on publish_jobs(workspace_id, status);
create index if not exists idx_publish_jobs_post on publish_jobs(post_id);
create index if not exists idx_approvals_post on approvals(post_id, version);
create index if not exists idx_automation_runs_workspace on automation_runs(workspace_id, started_at desc);

-- Enable RLS
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table audit_logs enable row level security;
alter table approvals enable row level security;
alter table publish_jobs enable row level security;
alter table publish_attempts enable row level security;
alter table automation_rules enable row level security;
alter table automation_runs enable row level security;
