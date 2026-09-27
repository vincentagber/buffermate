/**
 * Common TypeScript types and interfaces used throughout SocialFlow / Buffermate
 */

export type SocialChannel = 'instagram' | 'tiktok' | 'facebook' | 'threads' | 'whatsapp' | 'x' | 'twitter' | 'linkedin';

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
  social_account_ids?: string[];
  channels?: SocialChannel[];
  content: string;
  scheduled_at: string;
  posted_at?: string;
  status: 'draft' | 'scheduled' | 'queued' | 'posting' | 'posted' | 'failed';
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
