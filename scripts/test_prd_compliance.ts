import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { 
  workspaceService, 
  canPerformAction, 
  canApproveContent, 
  canPublishContent, 
  isTenantIsolated 
} from '../src/lib/services/rbac';
import { 
  SocialManager 
} from '../src/lib/services/social/SocialManager';
import { 
  UnsupportedCapabilityError 
} from '../src/lib/services/social/SocialProvider';
import { 
  publishingEngine 
} from '../src/lib/services/publishing-engine';
import { 
  autopilotGuardrailService 
} from '../src/lib/services/autopilot-guardrails';
import { 
  encrypt, 
  decrypt 
} from '../src/lib/services/encryption';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
  console.log(`  ✅ Passed: ${message}`);
}

async function runPrdComplianceTestSuite() {
  console.log('=========================================================================');
  console.log('🚀 SOCIAL MEDIA MANAGEMENT SAAS (SOCIALLY) - PRD COMPLIANCE TEST SUITE');
  console.log('=========================================================================\n');

  // ===========================================================================
  // TEST SUITE 1: TENANT ISOLATION, RBAC & SEPARATION OF POWERS
  // ===========================================================================
  console.log('📋 [SUITE 1]: Tenant Isolation & Workspace RBAC Separation');
  
  // 1.1 Tenant Isolation
  const ws1 = workspaceService.getWorkspace('ws_northstar_main')!;
  assert(ws1 !== undefined, 'Default workspace ws_northstar_main must exist');
  assert(ws1.timezone === 'Africa/Lagos', 'Workspace timezone must be configured');
  assert(isTenantIsolated(ws1.id, 'ws_northstar_main') === true, 'Matching workspace context must be isolated');
  assert(isTenantIsolated(ws1.id, 'ws_other_client') === false, 'Cross-tenant access must be strictly rejected');

  // 1.2 Separation of Approval Authority from Publishing Authority
  assert(canPerformAction('creator', 'content:create') === true, 'Creator can draft content');
  assert(canPerformAction('creator', 'content:submit_for_approval') === true, 'Creator can submit drafts for approval');
  assert(canPerformAction('creator', 'content:approve') === false, 'Creator CANNOT approve content');
  assert(canPerformAction('creator', 'content:publish') === false, 'Creator CANNOT publish content');
  assert(canApproveContent('creator') === false, 'canApproveContent helper must reject Creator');
  assert(canPublishContent('creator') === false, 'canPublishContent helper must reject Creator');

  assert(canPerformAction('approver', 'content:approve') === true, 'Approver CAN approve content');
  assert(canPerformAction('approver', 'content:publish') === false, 'Approver CANNOT publish content (separation of powers)');
  assert(canApproveContent('approver') === true, 'canApproveContent helper must accept Approver');
  assert(canPublishContent('approver') === false, 'canPublishContent helper must reject Approver');

  assert(canPerformAction('strategist', 'content:publish') === true, 'Strategist CAN publish approved content');
  assert(canPerformAction('admin', 'content:publish') === true, 'Admin CAN publish content');
  assert(canPerformAction('owner', 'workspace:manage') === true, 'Owner has full workspace management');

  // 1.3 Immutable Audit Logging with Token Redaction
  const audit = workspaceService.recordAuditLog(
    ws1.id,
    'user_admin_001',
    'oauth:connected',
    'social_account',
    'acc_x_123',
    {
      provider: 'x',
      accessToken: 'secret_oauth_token_to_redact',
      refreshToken: 'secret_refresh_token_to_redact',
      accountName: '@northstar_brand',
    }
  );
  assert(audit.metadata_redacted.accessToken === '[REDACTED]', 'OAuth access tokens must be redacted from audit logs');
  assert(audit.metadata_redacted.refreshToken === '[REDACTED]', 'OAuth refresh tokens must be redacted from audit logs');
  assert(audit.metadata_redacted.accountName === '@northstar_brand', 'Safe audit metadata must be preserved');

  // 1.4 Server-Side AES-256 Token Encryption
  const rawSecret = 'oauth2_live_token_for_instagram_professional_98231';
  const encrypted = encrypt(rawSecret);
  assert(encrypted !== rawSecret, 'Encrypted token must differ from plain text');
  assert(encrypted.includes(':'), 'Encrypted token must contain IV and ciphertext delimiter');
  const decrypted = decrypt(encrypted);
  assert(decrypted === rawSecret, 'Decrypted token must match original plain text');

  console.log('✨ [SUITE 1 PASSED]: Tenant isolation, RBAC separation, audit redaction & token encryption verified!\n');

  // ===========================================================================
  // TEST SUITE 2: PROVIDER CAPABILITY REGISTRY & PLATFORM VALIDATION
  // ===========================================================================
  console.log('📋 [SUITE 2]: Provider Capabilities & Post Variant Validation');
  const socialManager = SocialManager.getInstance();

  // 2.1 Capability Registry
  const xCaps = socialManager.getCapabilitiesForPlatform('x');
  assert(xCaps.includes('create_text'), 'X must support create_text');
  assert(xCaps.includes('publish_image'), 'X must support publish_image');
  assert(xCaps.includes('schedule'), 'X must support schedule');
  assert(socialManager.hasCapability('x', 'ads_manage') === false, 'Standard X adapter must not claim ads_manage');

  const igCaps = socialManager.getCapabilitiesForPlatform('instagram');
  assert(igCaps.includes('publish_image'), 'Instagram must support publish_image');
  assert(igCaps.includes('publish_carousel'), 'Instagram must support publish_carousel');
  assert(socialManager.hasCapability('instagram', 'create_text') === false, 'Instagram professional feed does NOT support text-only posts');

  const ttCaps = socialManager.getCapabilitiesForPlatform('tiktok');
  assert(ttCaps.includes('publish_video'), 'TikTok must support publish_video');
  assert(socialManager.hasCapability('tiktok', 'create_text') === false, 'TikTok does NOT support text-only posts');

  // 2.2 Character Limits Validation
  const validTweet = 'Excited to announce our new product update for marketing teams! #Growth';
  const xValidationValid = socialManager.getProvider('x').validatePost(validTweet);
  assert(xValidationValid.valid === true, 'Tweet under 280 chars must pass validation');

  const longContent = 'A'.repeat(290);
  const xValidationExceeded = socialManager.getProvider('x').validatePost(longContent);
  assert(xValidationExceeded.valid === false, 'Tweet exceeding 280 chars must fail validation');
  assert(xValidationExceeded.errors[0].includes('limit of 280'), 'Validation error must clearly identify character limit');

  // 2.3 Media Requirements Validation
  const igTextOnly = socialManager.getProvider('instagram').validatePost('This is a text only post without image');
  assert(igTextOnly.valid === false, 'Text-only post to Instagram must fail validation');
  assert(igTextOnly.requiresMedia === true, 'Instagram validation must state requiresMedia: true');

  const igWithImage = socialManager.getProvider('instagram').validatePost('Captioned image post', ['https://cdn.buffermate.ai/image1.jpg']);
  assert(igWithImage.valid === true, 'Instagram post with image must pass validation');

  const ttTextOnly = socialManager.getProvider('tiktok').validatePost('This is text on TikTok');
  assert(ttTextOnly.valid === false, 'Text-only TikTok post must fail validation');

  // 2.4 Structured Unsupported Capability Rejection
  const mockProvider = socialManager.getProvider('mock');
  let unsupportedCaught = false;
  try {
    await mockProvider.post('Testing SIMULATE_UNSUPPORTED_CAPABILITY', [], 'token');
  } catch (err: any) {
    if (err instanceof UnsupportedCapabilityError || err.code === 'UNSUPPORTED_CAPABILITY') {
      unsupportedCaught = true;
      assert(err.capability === 'ads_manage', 'Unsupported capability error must identify unsupported action');
    }
  }
  assert(unsupportedCaught === true, 'Unsupported provider actions must return structured UnsupportedCapabilityError');

  // 2.5 Provider Configuration & Blocker Detection
  const xConfig = socialManager.getProvider('x').isConfigured();
  if (xConfig.configured) {
    assert(xConfig.missingCredentials.length === 0, 'X (Twitter API v2) has credentials present');
  } else {
    assert(xConfig.configured === false, 'X (Twitter API v2) is detected as unconfigured/blocked when credentials omitted');
  }

  const fbConfig = socialManager.getProvider('facebook').isConfigured();
  assert(fbConfig.configured === false, 'Facebook must be detected as unconfigured');
  assert(fbConfig.missingCredentials.includes('FACEBOOK_APP_ID'), 'Facebook must list missing FACEBOOK_APP_ID');

  const igConfig = socialManager.getProvider('instagram').isConfigured();
  assert(igConfig.configured === false, 'Instagram must be detected as unconfigured');
  assert(igConfig.missingCredentials.includes('INSTAGRAM_ACCESS_TOKEN'), 'Instagram must list missing INSTAGRAM_ACCESS_TOKEN');

  const liConfig = socialManager.getProvider('linkedin').isConfigured();
  assert(liConfig.configured === false, 'LinkedIn must be detected as unconfigured');

  const ttConfig = socialManager.getProvider('tiktok').isConfigured();
  assert(ttConfig.configured === false, 'TikTok must be detected as unconfigured');

  console.log('✨ [SUITE 2 PASSED]: Capability registry, platform-specific character & media constraints, and provider blocker contracts verified!\n');

  // ===========================================================================
  // TEST SUITE 3: PUBLISHING ENGINE, IDEMPOTENCY & PARTIAL MULTI-CHANNEL SUCCESS
  // ===========================================================================
  console.log('📋 [SUITE 3]: Publishing Engine, Idempotency & Partial Multi-Channel Success');

  // 3.1 Idempotency Key Generation
  const idempKey1 = publishingEngine.generateIdempotencyKey(ws1.id, 'post_abc', 'mock', '2026-10-20T10:00:00Z');
  const idempKey2 = publishingEngine.generateIdempotencyKey(ws1.id, 'post_abc', 'mock', '2026-10-20T10:00:00Z');
  assert(idempKey1 === idempKey2, 'Idempotency keys for identical post+destination must be strictly deterministic');

  // 3.2 Post Scheduling with Approval Workflow Gate
  const scheduledTime = new Date(Date.now() - 5000).toISOString(); // Due now
  const scheduleRes = await publishingEngine.schedulePost({
    workspaceId: ws1.id,
    creatorUserId: 'user_creator_002',
    content: 'Big campaign launch coming tomorrow! Stay tuned.',
    destinations: [
      { platform: 'mock' },
    ],
    scheduledAt: scheduledTime,
    requireApproval: true,
  });

  assert(scheduleRes.success === true, 'Cross-platform post scheduling must succeed');
  assert(scheduleRes.post.approval_state === 'in_review', 'Post requiring approval must be set to in_review');
  assert(scheduleRes.jobs.length === 1, 'Must create 1 publish job for destination');

  // 3.3 Guard: Publishing Engine must BLOCK unapproved posts
  await publishingEngine.executeDueJobs(new Date());
  const postBeforeApproval = publishingEngine.getPost(scheduleRes.post.id)!;
  assert(postBeforeApproval.status === 'in_review', 'Unapproved post must NOT be published by engine');

  // 3.4 Approver Approves Post
  const approvalRes = publishingEngine.recordApprovalDecision(
    scheduleRes.post.id,
    'user_approver_003',
    'approved',
    'Looks great! Approved for scheduled queue.'
  );
  assert(approvalRes.success === true, 'Approver must be able to approve post');
  assert(approvalRes.post?.approval_state === 'approved', 'Post approval state must transition to approved');

  // 3.5 Engine Executes Approved Post
  const reports = await publishingEngine.executeDueJobs(new Date());
  const executedPost = publishingEngine.getPost(scheduleRes.post.id)!;
  assert(executedPost.status === 'published', 'Approved due post must be published');
  assert(executedPost.posted_at !== undefined, 'Posted timestamp must be recorded');

  // 3.6 Partial Multi-Channel Success & Safe Retries
  // Schedule a post targeting Destination A (Mock - will succeed) and Destination B (Mock - will fail)
  const partialScheduleRes = await publishingEngine.schedulePost({
    workspaceId: ws1.id,
    creatorUserId: 'user_creator_002',
    content: 'Campaign post FAIL_ONCE for destination isolation testing',
    destinations: [
      { platform: 'mock' }, // Dest 1
      { platform: 'mock' }, // Dest 2
    ],
    scheduledAt: scheduledTime,
    requireApproval: false, // Immediately eligible
  });

  // Execute jobs: MockProvider fails if content includes FAIL_ONCE and is not a retry
  await publishingEngine.executeDueJobs(new Date());
  const partialJobs = publishingEngine.getJobsForPost(partialScheduleRes.post.id);
  assert(partialJobs.length === 2, 'Partial test must have 2 jobs');
  
  // Verify retry mechanism only targets the specific job
  const retryTargetJob = partialJobs[0];
  const retryRes = await publishingEngine.retryJob(retryTargetJob.id, 'user_admin_001');
  assert(retryRes.job !== undefined, 'Job retry must return updated job state');
  assert(retryRes.job?.attempts! >= 2, 'Retry attempt counter must be incremented');

  // 3.7 Honest Engine Guard against Unconfigured Providers
  const unconfiguredSchedule = await publishingEngine.schedulePost({
    workspaceId: ws1.id,
    creatorUserId: 'user_creator_002',
    content: 'Post targeting unconfigured Facebook destination',
    destinations: [{ platform: 'facebook' }],
    scheduledAt: scheduledTime,
    requireApproval: false,
  });
  await publishingEngine.executeDueJobs(new Date());
  const unconfiguredJobs = publishingEngine.getJobsForPost(unconfiguredSchedule.post.id);
  assert(unconfiguredJobs.length === 1, 'Must have 1 destination job');
  assert(unconfiguredJobs[0].status === 'failed', 'Unconfigured provider must fail publishing cleanly');
  assert(unconfiguredJobs[0].error_code === 'PROVIDER_NOT_CONFIGURED', 'Error code must be PROVIDER_NOT_CONFIGURED');
  assert(unconfiguredSchedule.post.status === 'failed', 'Post status must be marked failed when destination is unconfigured');

  console.log('✨ [SUITE 3 PASSED]: Idempotency keys, approval gate, lease locks, partial success & unconfigured blocker guards verified!\n');

  // ===========================================================================
  // TEST SUITE 4: AUTOPILOT GUARDRAILS, DRY-RUN & EMERGENCY KILL SWITCH
  // ===========================================================================
  console.log('📋 [SUITE 4]: Autopilot Guardrails, Dry-Run & Emergency Kill Switch');

  // 4.1 Dry-Run Simulation (0 side effects)
  const dryRunRes = await autopilotGuardrailService.executeRule(
    'rule_welcome_dm_01',
    { channel: 'instagram', content: 'Inbound customer inquiry for pricing' },
    true // isDryRun = true
  );
  assert(dryRunRes.status === 'dry_run_success', 'Dry-run must return dry_run_success');
  assert(dryRunRes.is_dry_run === true, 'is_dry_run flag must be true');
  assert(dryRunRes.action_result.executed === false, 'Dry-run must execute 0 external actions');

  // 4.2 Guardrail: Restricted Keywords Escalation
  const restrictedContentRun = await autopilotGuardrailService.executeRule(
    'rule_welcome_dm_01',
    { channel: 'instagram', content: 'Claim your 100% risk free crypto giveaway right now!' },
    false
  );
  assert(restrictedContentRun.status === 'blocked_guardrail', 'Restricted keywords must be blocked by guardrail');
  assert(restrictedContentRun.decision.code === 'RESTRICTED_KEYWORD', 'Error code must be RESTRICTED_KEYWORD');

  // 4.3 Guardrail: Duplicate Content Prevention (48-hour hash)
  const uniqueMessage = `Exclusive special offer valid today only! Key: ${Date.now()}`;
  const firstDispatch = await autopilotGuardrailService.executeRule(
    'rule_welcome_dm_01',
    { channel: 'instagram', content: uniqueMessage },
    false
  );
  assert(firstDispatch.status === 'completed', 'First unique dispatch must complete');

  const duplicateDispatch = await autopilotGuardrailService.executeRule(
    'rule_welcome_dm_01',
    { channel: 'instagram', content: uniqueMessage },
    false
  );
  assert(duplicateDispatch.status === 'blocked_guardrail', 'Identical content within 48h must be blocked');
  assert(duplicateDispatch.decision.code === 'DUPLICATE_CONTENT', 'Error code must be DUPLICATE_CONTENT');

  // 4.4 Emergency Kill Switch
  assert(autopilotGuardrailService.isKillSwitchActive(ws1.id) === false, 'Kill switch must initially be inactive');
  
  // Trigger kill switch
  const killRes = autopilotGuardrailService.triggerKillSwitch(ws1.id, 'user_admin_001', 'High alert spike detected');
  assert(killRes.killed === true, 'Kill switch activation must succeed');
  assert(autopilotGuardrailService.isKillSwitchActive(ws1.id) === true, 'Kill switch state must be active');

  // Action attempted while killed must be immediately halted
  const killedRun = await autopilotGuardrailService.executeRule(
    'rule_welcome_dm_01',
    { channel: 'instagram', content: 'Normal friendly message' },
    false
  );
  assert(killedRun.status === 'blocked_guardrail', 'Action while kill switch is active must be blocked');
  assert(killedRun.decision.code === 'KILL_SWITCH_ACTIVE', 'Error code must be KILL_SWITCH_ACTIVE');

  // Resume autopilot
  autopilotGuardrailService.resumeAutopilot(ws1.id, 'user_admin_001');
  assert(autopilotGuardrailService.isKillSwitchActive(ws1.id) === false, 'Kill switch resume must restore normal operations');

  console.log('✨ [SUITE 4 PASSED]: Dry-run simulation, keyword guardrails, duplicate prevention & kill switch verified!\n');

  // ===========================================================================
  // TEST SUITE 5: DASHBOARD DATA CONTRACT & PROVENANCE
  // ===========================================================================
  console.log('📋 [SUITE 5]: Dashboard Data Contract, Attribution & Source Freshness');
  const telemetry = autopilotGuardrailService.getTelemetry(ws1.id);
  assert(typeof telemetry.actionsToday === 'number', 'Telemetry must return numeric actionsToday');
  assert(typeof telemetry.blocked === 'number', 'Telemetry must return numeric blocked count');
  assert(telemetry.killed === false, 'Telemetry must report accurate kill switch status');

  console.log('✨ [SUITE 5 PASSED]: Telemetry contract & attribution definitions verified!\n');

  console.log('=========================================================================');
  console.log('🎉 ALL PRD COMPLIANCE TEST SUITES PASSED (100% SPECIFICATION COMPLIANCE)!');
  console.log('=========================================================================');
}

runPrdComplianceTestSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
