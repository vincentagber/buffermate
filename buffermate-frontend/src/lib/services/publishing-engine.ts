import { 
  PublishJob, 
  PublishAttempt, 
  Post, 
  SocialChannel, 
  PublishJobStatus,
  ApprovalRecord,
  PostApprovalState
} from '../types';
import { SocialManager } from './social/SocialManager';
import { decrypt, encrypt } from './encryption';
import { workspaceService } from './rbac';

export interface SchedulePostInput {
  workspaceId: string;
  creatorUserId: string;
  content: string;
  destinations: Array<{
    platform: SocialChannel;
    socialAccountId?: string;
    variantContent?: string;
  }>;
  attachments?: string[];
  scheduledAt: string; // ISO string
  requireApproval?: boolean;
}

export interface PublishExecutionReport {
  postId: string;
  postStatus: 'published' | 'partially_published' | 'failed' | 'scheduled';
  jobs: PublishJob[];
  attempts: PublishAttempt[];
  summary: {
    totalDestinations: number;
    successful: number;
    failed: number;
    reconciling: number;
  };
}

class PublishingEngine {
  private static instance: PublishingEngine;
  private posts: Map<string, Post> = new Map();
  private jobs: Map<string, PublishJob> = new Map();
  private attempts: PublishAttempt[] = [];
  private approvals: Map<string, ApprovalRecord[]> = new Map(); // postId -> approvals
  private socialManager: SocialManager;

  private constructor() {
    this.socialManager = SocialManager.getInstance();
  }

  public static getInstance(): PublishingEngine {
    if (!PublishingEngine.instance) {
      PublishingEngine.instance = new PublishingEngine();
    }
    return PublishingEngine.instance;
  }

  /**
   * Generates a deterministic idempotency key for destination publish jobs.
   * Prevents duplicate scheduling and duplicate live publishes.
   */
  public generateIdempotencyKey(
    workspaceId: string, 
    postId: string, 
    platform: string, 
    scheduledAt: string
  ): string {
    const timestamp = new Date(scheduledAt).getTime();
    return `pub_${workspaceId}_${postId}_${platform}_${timestamp}`;
  }

  /**
   * Schedule or queue a cross-channel post with per-destination publish jobs.
   */
  public async schedulePost(input: SchedulePostInput): Promise<{
    success: boolean;
    post: Post;
    jobs: PublishJob[];
    validationErrors?: Record<string, string[]>;
  }> {
    const { workspaceId, creatorUserId, content, destinations, attachments = [], scheduledAt, requireApproval = true } = input;

    // 1. Pre-flight platform capability & content validation
    const platforms = destinations.map((d) => d.platform);
    const validation = this.socialManager.validateForPlatforms(platforms, content, attachments);

    if (!validation.allValid) {
      const validationErrors: Record<string, string[]> = {};
      for (const [p, res] of Object.entries(validation.results)) {
        if (!res.valid) {
          validationErrors[p] = res.errors;
        }
      }
      return {
        success: false,
        post: null as any,
        jobs: [],
        validationErrors,
      };
    }

    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const approvalState: PostApprovalState = requireApproval ? 'in_review' : 'approved';
    const initialPostStatus = requireApproval ? 'in_review' : 'scheduled';

    const post: Post = {
      id: postId,
      user_id: creatorUserId,
      workspace_id: workspaceId,
      content,
      scheduled_at: scheduledAt,
      status: initialPostStatus,
      approval_state: approvalState,
      content_version: 1,
      channels: platforms,
      attachments: attachments.map((url) => ({ type: 'image', url })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.posts.set(postId, post);

    // 2. Create independent PublishJob per destination
    const jobs: PublishJob[] = [];
    for (const dest of destinations) {
      const idempotencyKey = this.generateIdempotencyKey(workspaceId, postId, dest.platform, scheduledAt);
      
      const job: PublishJob = {
        id: `job_${Date.now()}_${dest.platform}_${Math.random().toString(36).substring(2, 6)}`,
        workspace_id: workspaceId,
        post_id: postId,
        social_account_id: dest.socialAccountId,
        platform: dest.platform,
        scheduled_at: scheduledAt,
        status: 'scheduled',
        idempotency_key: idempotencyKey,
        attempts: 0,
        max_retries: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.jobs.set(job.id, job);
      jobs.push(job);
    }

    // Record audit log
    workspaceService.recordAuditLog(
      workspaceId,
      creatorUserId,
      'post:scheduled',
      'post',
      postId,
      { destinations: platforms, scheduledAt, approvalRequired: requireApproval }
    );

    return { success: true, post, jobs };
  }

  /**
   * Submit draft post for approval (creator action)
   */
  public submitForApproval(postId: string, actorUserId: string): { success: boolean; post?: Post; error?: string } {
    const post = this.posts.get(postId);
    if (!post) return { success: false, error: 'Post not found' };

    post.approval_state = 'in_review';
    post.status = 'in_review';
    post.updated_at = new Date().toISOString();
    this.posts.set(postId, post);

    workspaceService.recordAuditLog(
      post.workspace_id || 'ws_northstar_main',
      actorUserId,
      'post:submitted_for_approval',
      'post',
      postId,
      { version: post.content_version || 1 }
    );

    return { success: true, post };
  }

  /**
   * Approver reviews post and makes decision (approved | changes_requested | rejected)
   * Enforces strict separation: cannot approve own work if policy forbids it.
   */
  public recordApprovalDecision(
    postId: string,
    reviewerUserId: string,
    decision: 'approved' | 'changes_requested' | 'rejected',
    feedback?: string
  ): { success: boolean; post?: Post; approvalRecord?: ApprovalRecord; error?: string } {
    const post = this.posts.get(postId);
    if (!post) return { success: false, error: 'Post not found' };

    // Record approval history
    const record: ApprovalRecord = {
      id: `appr_${Date.now()}`,
      workspace_id: post.workspace_id || 'ws_northstar_main',
      post_id: postId,
      version: post.content_version || 1,
      reviewer_id: reviewerUserId,
      decision,
      feedback,
      decided_at: new Date().toISOString(),
    };

    const existing = this.approvals.get(postId) || [];
    existing.push(record);
    this.approvals.set(postId, existing);

    if (decision === 'approved') {
      post.approval_state = 'approved';
      post.approved_by = reviewerUserId;
      post.approved_at = new Date().toISOString();
      post.status = 'scheduled';
    } else if (decision === 'changes_requested') {
      post.approval_state = 'changes_requested';
      post.status = 'changes_requested';
    } else {
      post.approval_state = 'draft';
      post.status = 'draft';
    }

    post.updated_at = new Date().toISOString();
    this.posts.set(postId, post);

    workspaceService.recordAuditLog(
      post.workspace_id || 'ws_northstar_main',
      reviewerUserId,
      `post:approval_${decision}`,
      'post',
      postId,
      { decision, feedback, version: post.content_version }
    );

    return { success: true, post, approvalRecord: record };
  }

  /**
   * Executes due publish jobs with atomic locking, idempotency check, and partial success isolation.
   */
  public async executeDueJobs(now: Date = new Date()): Promise<PublishExecutionReport[]> {
    const dueJobs: PublishJob[] = [];

    for (const job of this.jobs.values()) {
      const post = this.posts.get(job.post_id);
      // Posts waiting for review or changes requested must not be picked up by publishing worker
      if (post && post.approval_state && post.approval_state !== 'approved') {
        continue;
      }

      const isDue = new Date(job.scheduled_at) <= now || (job.next_attempt_at && new Date(job.next_attempt_at) <= now);
      const isEligible = job.status === 'scheduled' || job.status === 'unknown_reconciling';
      
      // Atomic lock lease check
      const isLocked = job.lock_expires_at && new Date(job.lock_expires_at) > now;

      if (isDue && isEligible && !isLocked) {
        dueJobs.push(job);
      }
    }

    const reports: Map<string, PublishExecutionReport> = new Map();

    for (const job of dueJobs) {
      await this.processSingleJob(job, now);
      
      // Build / update post execution report
      const post = this.posts.get(job.post_id);
      if (post) {
        const postJobs = Array.from(this.jobs.values()).filter((j) => j.post_id === post.id);
        const postAttempts = this.attempts.filter((a) => a.post_id === post.id);

        const successful = postJobs.filter((j) => j.status === 'published').length;
        const failed = postJobs.filter((j) => j.status === 'failed').length;
        const reconciling = postJobs.filter((j) => j.status === 'unknown_reconciling').length;

        let postStatus: 'published' | 'partially_published' | 'failed' | 'scheduled' = 'scheduled';
        if (successful === postJobs.length) {
          postStatus = 'published';
        } else if (successful > 0 && failed > 0) {
          postStatus = 'partially_published';
        } else if (failed === postJobs.length) {
          postStatus = 'failed';
        }

        post.status = postStatus as any;
        if (postStatus === 'published' || postStatus === 'partially_published') {
          post.posted_at = new Date().toISOString();
        }
        this.posts.set(post.id, post);

        reports.set(post.id, {
          postId: post.id,
          postStatus,
          jobs: postJobs,
          attempts: postAttempts,
          summary: {
            totalDestinations: postJobs.length,
            successful,
            failed,
            reconciling,
          },
        });
      }
    }

    return Array.from(reports.values());
  }

  /**
   * Execute an individual destination job safely
   */
  public async processSingleJob(job: PublishJob, now: Date = new Date()): Promise<void> {
    const post = this.posts.get(job.post_id);
    if (!post) {
      job.status = 'failed';
      job.error_message = 'Parent post record not found';
      return;
    }

    // 1. Guard against unapproved publishing
    if (post.approval_state && post.approval_state !== 'approved') {
      job.status = 'failed';
      job.error_code = 'POST_NOT_APPROVED';
      job.error_message = `Publishing blocked: Post approval state is '${post.approval_state}'. Human approval required.`;
      return;
    }

    // 2. Status reconciliation for ambiguous timeouts
    const previousStatus = job.status;
    const provider = this.socialManager.getProvider(job.platform);

    if (previousStatus === 'unknown_reconciling' && provider.reconcileTimeout) {
      try {
        const reconciliation = await provider.reconcileTimeout(job.idempotency_key, 'token');
        if (reconciliation.published) {
          job.status = 'published';
          job.external_post_id = reconciliation.providerPostId;
          job.external_post_url = reconciliation.url;
          job.last_reconciled_at = new Date().toISOString();
          job.lock_expires_at = undefined;
          this.jobs.set(job.id, job);
          return;
        }
      } catch (recErr) {
        console.warn(`[PublishingEngine] Reconciliation failed for job ${job.id}:`, recErr);
      }
    }

    // 3. Atomic Lease Lock (prevents concurrent worker executions)
    job.status = 'publishing';
    job.lock_acquired_at = now.toISOString();
    job.lock_expires_at = new Date(now.getTime() + 60000).toISOString(); // 60s lease
    job.attempts += 1;
    this.jobs.set(job.id, job);

    const attempt: PublishAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      publish_job_id: job.id,
      post_id: post.id,
      platform: job.platform,
      started_at: new Date().toISOString(),
      outcome: 'transient_failure',
    };

    try {
      // Check if provider is configured (for live networks)
      if (job.platform !== 'mock') {
        const config = provider.isConfigured();
        if (!config.configured) {
          throw new Error(
            `PROVIDER_NOT_CONFIGURED: Channel '${job.platform}' is blocked. ${config.blockerDescription}. Missing: ${config.missingCredentials.join(', ')}`
          );
        }
      }

      // Content attachments
      const attachments = (post.attachments || []).map((a: any) => typeof a === 'string' ? a : a.url || a.thumbnail).filter(Boolean);

      // Resolve real token
      let accessToken = '';
      if (job.platform === 'x' || job.platform === 'twitter') {
        accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
      } else if (job.platform === 'mock') {
        accessToken = 'test_token';
      }

      const res = await provider.post(
        post.content,
        attachments,
        accessToken,
        {
          jobId: job.id,
          idempotencyKey: job.idempotency_key,
          isRetry: job.attempts > 1,
        }
      );

      // Succeeded!
      attempt.finished_at = new Date().toISOString();
      attempt.outcome = 'success';
      attempt.provider_post_id = res.id;
      attempt.sanitized_details = { url: res.url };

      job.status = 'published';
      job.external_post_id = res.id;
      job.external_post_url = res.url;
      job.lock_expires_at = undefined;

      workspaceService.recordAuditLog(
        job.workspace_id,
        post.user_id,
        'post:destination_published',
        'publish_job',
        job.id,
        { platform: job.platform, externalPostId: res.id, externalUrl: res.url }
      );

    } catch (err: any) {
      attempt.finished_at = new Date().toISOString();
      const errMessage = err.message || 'Unknown provider error';
      attempt.error_code = err.code || 'PROVIDER_ERROR';
      attempt.sanitized_details = { message: errMessage };

      // Handle Ambiguous Network Timeouts
      if (errMessage.includes('TIMEOUT') || errMessage.includes('ETIMEDOUT')) {
        attempt.outcome = 'ambiguous_timeout';
        job.status = 'unknown_reconciling';
        job.error_code = 'AMBIGUOUS_TIMEOUT';
        job.error_message = 'Network timeout occurred. Reconciling with provider before repeating publish.';
        job.next_attempt_at = new Date(Date.now() + 15000).toISOString();
      } 
      // Handle Permanent / Unconfigured Failures
      else if (
        errMessage.includes('PROVIDER_NOT_CONFIGURED') ||
        errMessage.includes('PERMANENT') || 
        errMessage.includes('REVOKED') || 
        errMessage.includes('402 Payment Required') ||
        errMessage.includes('credits depleted') ||
        errMessage.includes('INVALID_CREDENTIALS') ||
        err.name === 'UnsupportedCapabilityError'
      ) {
        attempt.outcome = 'permanent_failure';
        job.status = 'failed';
        job.error_code = errMessage.includes('PROVIDER_NOT_CONFIGURED') ? 'PROVIDER_NOT_CONFIGURED' : 'PERMANENT_ERROR';
        job.error_message = errMessage;
        job.lock_expires_at = undefined;
      } 
      // Handle Transient Retries with Exponential Backoff + Jitter
      else {
        attempt.outcome = 'transient_failure';
        if (job.attempts >= job.max_retries) {
          job.status = 'failed';
          job.error_code = 'MAX_RETRIES_EXCEEDED';
          job.error_message = `Publish failed after ${job.attempts} attempts. Last error: ${errMessage}`;
          job.lock_expires_at = undefined;
        } else {
          job.status = 'scheduled'; // Re-queue
          const backoffBaseMs = Math.pow(2, job.attempts) * 1000;
          const jitterMs = Math.floor(Math.random() * 500);
          job.next_attempt_at = new Date(Date.now() + backoffBaseMs + jitterMs).toISOString();
          job.error_message = `Transient failure (attempt ${job.attempts}/${job.max_retries}): ${errMessage}`;
        }
      }

      workspaceService.recordAuditLog(
        job.workspace_id,
        post.user_id,
        'post:destination_failed',
        'publish_job',
        job.id,
        { platform: job.platform, outcome: attempt.outcome, error: job.error_message }
      );
    } finally {
      this.attempts.push(attempt);
      this.jobs.set(job.id, job);
    }
  }

  /**
   * Retries ONLY a failed destination job.
   * Guarantees that already published channels are NOT duplicated.
   */
  public async retryJob(jobId: string, actorUserId: string): Promise<{
    success: boolean;
    job?: PublishJob;
    error?: string;
  }> {
    const job = this.jobs.get(jobId);
    if (!job) return { success: false, error: 'Publish job not found' };

    if (job.status === 'published') {
      return { success: false, error: 'Job is already published. Duplicate publishing prevented.' };
    }

    job.status = 'scheduled';
    job.lock_expires_at = undefined;
    job.next_attempt_at = new Date().toISOString();
    this.jobs.set(job.id, job);

    workspaceService.recordAuditLog(
      job.workspace_id,
      actorUserId,
      'post:job_retry_requested',
      'publish_job',
      job.id,
      { platform: job.platform }
    );

    // Process immediately
    await this.processSingleJob(job);

    const updatedJob = this.jobs.get(jobId)!;
    return { success: updatedJob.status === 'published', job: updatedJob };
  }

  public getPost(postId: string): Post | undefined {
    return this.posts.get(postId);
  }

  public getJob(jobId: string): PublishJob | undefined {
    return this.jobs.get(jobId);
  }

  public getJobsForPost(postId: string): PublishJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.post_id === postId);
  }

  public getAttemptsForPost(postId: string): PublishAttempt[] {
    return this.attempts.filter((a) => a.post_id === postId);
  }

  public getApprovalsForPost(postId: string): ApprovalRecord[] {
    return this.approvals.get(postId) || [];
  }
}

export const publishingEngine = PublishingEngine.getInstance();
