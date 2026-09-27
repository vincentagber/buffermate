-- Migration 002: SocialFlow Automations, CRM Leads, and AI Auto-Posting Engine

-- 1. Automations Table (Comment Keywords -> Auto Comment Reply + DM Funnels)
create table if not exists social_automations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  channel text not null check (channel in ('instagram', 'tiktok', 'facebook', 'threads', 'whatsapp', 'x', 'linkedin')),
  trigger_type text not null default 'comment_keyword', -- 'comment_keyword', 'dm_received', 'story_reply', 'spam_filter', 'new_follower'
  keywords text[] default '{}',
  reply_comment text,
  dm_message text,
  link_url text,
  status text default 'active' check (status in ('active', 'paused', 'draft')),
  runs_today int default 0,
  runs_total int default 0,
  leads_captured int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Activity Stream Logs
create table if not exists social_activity_stream (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null, -- 'auto_dm', 'lead_captured', 'comment_replied', 'post_published', 'story_reply'
  channel text not null,
  title text not null,
  description text not null,
  user_handle text,
  post_reference text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- 3. Social CRM & Captured Leads
create table if not exists social_leads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  handle text not null,
  name text,
  channel text not null,
  keyword_triggered text,
  automation_id uuid references social_automations(id) on delete set null,
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'converted')),
  last_interaction timestamp with time zone default now(),
  notes text,
  created_at timestamp with time zone default now()
);

-- 4. AI Auto-Post Engine Configuration
create table if not exists ai_autopost_config (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  enabled boolean default false,
  niche text default 'Marketing & Business Growth',
  tone text default 'Authoritative & Engaging',
  target_channels text[] default '{"instagram", "facebook", "tiktok", "threads"}',
  frequency_per_day int default 2,
  auto_publish boolean default true,
  last_generated_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_social_automations_user_id on social_automations(user_id);
create index if not exists idx_social_activity_stream_user_id on social_activity_stream(user_id);
create index if not exists idx_social_leads_user_id on social_leads(user_id);

-- RLS
alter table social_automations enable row level security;
alter table social_activity_stream enable row level security;
alter table social_leads enable row level security;
alter table ai_autopost_config enable row level security;

create policy "Users manage their own automations" on social_automations for all using (auth.uid() = user_id);
create policy "Users manage their own activity logs" on social_activity_stream for all using (auth.uid() = user_id);
create policy "Users manage their own leads" on social_leads for all using (auth.uid() = user_id);
create policy "Users manage their own ai autopost config" on ai_autopost_config for all using (auth.uid() = user_id);
