/**
 * Common TypeScript types and interfaces used throughout the app
 */

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
  userId: string;
  provider: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  connectedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  scheduledFor: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platforms: string[];
  media?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  postId: string;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  clicks: number;
  measuredAt: Date;
}
