-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Social Accounts Table
create type social_provider as enum ('x', 'facebook', 'linkedin', 'youtube', 'tiktok', 'instagram');

create table social_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider social_provider not null,
  provider_user_id text not null,
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  token_expires_at timestamp with time zone,
  meta jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, provider, provider_user_id)
);

-- Create Posts Table
create type post_status as enum ('scheduled', 'queued', 'posting', 'posted', 'failed');

create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  social_account_ids uuid[] not null default '{}',
  content text not null,
  attachments jsonb default '[]'::jsonb,
  status post_status default 'scheduled',
  scheduled_at timestamp with time zone not null,
  posted_at timestamp with time zone,
  provider_results jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create Schedules Table (for recurring posts - placeholder for now)
create table schedules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  cron_expression text,
  next_run_at timestamp with time zone,
  enabled boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create Post Attempts Table
create table post_attempts (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade not null,
  attempt_time timestamp with time zone default now(),
  provider social_provider not null,
  response jsonb,
  success boolean not null,
  error text
);

-- Create AI Generations Table
create table ai_generations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  prompt text not null,
  model text not null,
  result jsonb not null,
  created_at timestamp with time zone default now()
);

-- Indexes
create index idx_posts_scheduled_at_status on posts(scheduled_at, status);
create index idx_posts_user_id on posts(user_id);
create index idx_social_accounts_user_id on social_accounts(user_id);

-- RLS Policies
alter table social_accounts enable row level security;
alter table posts enable row level security;
alter table schedules enable row level security;
alter table post_attempts enable row level security;
alter table ai_generations enable row level security;

-- Social Accounts Policies
create policy "Users can view their own social accounts"
  on social_accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own social accounts"
  on social_accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own social accounts"
  on social_accounts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own social accounts"
  on social_accounts for delete
  using (auth.uid() = user_id);

-- Posts Policies
create policy "Users can view their own posts"
  on posts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own posts"
  on posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on posts for delete
  using (auth.uid() = user_id);

-- Schedules Policies
create policy "Users can view their own schedules"
  on schedules for select
  using (auth.uid() = user_id);

create policy "Users can insert their own schedules"
  on schedules for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own schedules"
  on schedules for update
  using (auth.uid() = user_id);

create policy "Users can delete their own schedules"
  on schedules for delete
  using (auth.uid() = user_id);

-- AI Generations Policies
create policy "Users can view their own ai generations"
  on ai_generations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own ai generations"
  on ai_generations for insert
  with check (auth.uid() = user_id);
