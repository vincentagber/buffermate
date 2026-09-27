-- ==============================================================================
-- Migration 003: BufferMate AI Content Studio, Campaigns & Publishing Engine
-- ==============================================================================

-- 1. Contents Table (AI Generated & User Authored Posts)
create table if not exists contents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  workspace_id uuid,
  title text not null default 'Untitled Content',
  topic text not null,
  hook text,
  content text not null,
  call_to_action text,
  hashtags text[] default '{}',
  content_type text default 'social_post',
  tone text default 'professional',
  language text default 'en',
  platform text default 'all',
  image_url text,
  image_prompt text,
  ai_model text default 'gemini-2.5-flash',
  status text default 'DRAFT' check (status in ('DRAFT', 'READY', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'ARCHIVED')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Content Variants Table (Platform Specific Tailored Copy)
create table if not exists content_variants (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references contents(id) on delete cascade not null,
  platform text not null,
  caption text not null,
  hook text,
  call_to_action text,
  hashtags text[] default '{}',
  image_url text,
  image_prompt text,
  status text default 'READY' check (status in ('DRAFT', 'READY', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'FAILED')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Automation Campaigns Table (Multi-Day Auto-Pilots)
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  topic text not null,
  target_audience text,
  tone text default 'professional',
  frequency text default 'daily', -- 'daily', 'weekdays', 'custom'
  scheduled_time text default '09:00',
  timezone text default 'Africa/Lagos',
  platforms text[] default '{facebook, instagram, linkedin, x}',
  duration_days integer default 30,
  auto_approve boolean default false,
  auto_publish boolean default false,
  status text default 'ACTIVE' check (status in ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
  posts_generated integer default 0,
  posts_published integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. Scheduled Posts Table (Engine Execution Queue)
create table if not exists scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content_id uuid references contents(id) on delete set null,
  variant_id uuid references content_variants(id) on delete set null,
  campaign_id uuid references campaigns(id) on delete set null,
  social_account_id uuid,
  platform text not null,
  account_name text,
  caption text not null,
  image_url text,
  scheduled_for timestamp with time zone not null,
  timezone text default 'Africa/Lagos',
  status text default 'QUEUED' check (status in ('QUEUED', 'PROCESSING', 'PUBLISHED', 'FAILED', 'CANCELLED')),
  published_at timestamp with time zone,
  external_post_id text,
  error_message text,
  retry_count integer default 0,
  lock_acquired_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. Publishing History & Telemetry
create table if not exists publishing_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  scheduled_post_id uuid references scheduled_posts(id) on delete set null,
  content_id uuid references contents(id) on delete set null,
  platform text not null,
  account_handle text,
  status text not null, -- 'SUCCESS', 'FAILED', 'RETRY'
  external_post_id text,
  post_url text,
  response_data jsonb default '{}'::jsonb,
  error_message text,
  latency_ms integer default 0,
  published_at timestamp with time zone default now()
);

-- Indexes for lightning fast queuing & status lookups
create index if not exists idx_contents_user_status on contents(user_id, status);
create index if not exists idx_scheduled_posts_queue on scheduled_posts(scheduled_for, status) where status = 'QUEUED';
create index if not exists idx_scheduled_posts_user on scheduled_posts(user_id, status);
create index if not exists idx_campaigns_user on campaigns(user_id, status);
create index if not exists idx_publishing_history_user on publishing_history(user_id, published_at desc);

-- Enable RLS
alter table contents enable row level security;
alter table content_variants enable row level security;
alter table campaigns enable row level security;
alter table scheduled_posts enable row level security;
alter table publishing_history enable row level security;

-- RLS Policies
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can manage their own contents') then
    create policy "Users can manage their own contents" on contents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can manage their own content variants') then
    create policy "Users can manage their own content variants" on content_variants for all using (
      exists (select 1 from contents where contents.id = content_variants.content_id and contents.user_id = auth.uid())
    );
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can manage their own campaigns') then
    create policy "Users can manage their own campaigns" on campaigns for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can manage their own scheduled posts') then
    create policy "Users can manage their own scheduled posts" on scheduled_posts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can manage their own publishing history') then
    create policy "Users can manage their own publishing history" on publishing_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;
