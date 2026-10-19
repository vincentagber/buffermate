import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { autopilotWorkerService } from '../src/lib/services/autopilot-worker';
import { parseLocalToUtcIso, getNextPeakEngagementSlot, getLagosHour } from '../src/lib/utils/timezone';
import { createClient } from '@supabase/supabase-js';

async function runAutopilotWorkerTests() {
  console.log('=========================================================================');
  console.log('🤖 AI AUTO-PILOT AUTONOMOUS WORKER & TIMEZONE TEST SUITE');
  console.log('=========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`  ✅ Passed: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ Failed: ${desc}`);
      failed++;
    }
  }

  // --- SUITE 1: Africa/Lagos Timezone & Peak Slot Correctness ---
  console.log('📋 [TEST 1]: Africa/Lagos Timezone Parsing & Peak Slot Calculations');

  // Lagos is UTC+1 year-round (WAT). 09:00 Lagos time MUST equal 08:00 UTC.
  const utc09 = parseLocalToUtcIso('2026-10-20T09:00', 'Africa/Lagos');
  assert(utc09 === '2026-10-20T08:00:00.000Z', `09:00 Lagos must convert to 08:00:00.000Z (got: ${utc09})`);

  // 18:30 Lagos time MUST equal 17:30 UTC.
  const utc1830 = parseLocalToUtcIso('2026-10-20T18:30', 'Africa/Lagos');
  assert(utc1830 === '2026-10-20T17:30:00.000Z', `18:30 Lagos must convert to 17:30:00.000Z (got: ${utc1830})`);

  // Lagos hour extraction check
  const currentLagosHour = getLagosHour(new Date());
  assert(typeof currentLagosHour === 'number' && currentLagosHour >= 0 && currentLagosHour <= 23, `Lagos hour must be integer 0-23 (got: ${currentLagosHour})`);

  // Next peak slot must return valid future UTC ISO string
  const nextSlot = getNextPeakEngagementSlot('Africa/Lagos');
  assert(typeof nextSlot === 'string' && nextSlot.endsWith('Z'), `Peak slot must return UTC ISO string (got: ${nextSlot})`);
  assert(new Date(nextSlot).getTime() > Date.now() - 3600000, 'Peak slot must be valid current/future time window');

  // --- SUITE 2: Autonomous Generation vs Autonomous Publishing Permissions ---
  console.log('\n📋 [TEST 2]: Generation vs Publishing Permission Boundaries');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch or create test config
  const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
  const testUserId = users?.users?.[0]?.id || '260d11f7-3bd6-4a40-9902-6018573129be';

  // Ensure config exists with auto_publish = false first to verify draft safety
  const { data: configRecord } = await supabase
    .from('ai_autopost_config')
    .upsert({
      user_id: testUserId,
      enabled: true,
      niche: 'Digital Marketing & Growth Automation',
      tone: 'Authoritative & Engaging',
      target_channels: ['facebook', 'instagram', 'threads'],
      frequency_per_day: 2,
      auto_publish: false, // HUMAN APPROVAL REQUIRED
      last_generated_at: null, // Due immediately
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  assert(configRecord?.enabled === true, 'Auto-Pilot config must be enabled');
  assert(configRecord?.auto_publish === false, 'auto_publish must be false for draft test');

  // --- SUITE 3: Execute Real Autonomous Generation Cycle ---
  console.log('\n📋 [TEST 3]: Worker Autonomous Generation Cycle Execution');

  const summary = await autopilotWorkerService.executeAutopilotCycle();
  console.log('  Cycle Summary:', summary);

  assert(summary.configsChecked >= 1, `Worker must check at least 1 active configuration (checked: ${summary.configsChecked})`);
  assert(summary.generated >= 1 || summary.skippedNotDue >= 1, `Worker must generate new post or skip if not due (generated: ${summary.generated})`);

  // Verify the generated post in Supabase posts table
  const { data: latestPosts, error: postErr } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', testUserId)
    .order('created_at', { ascending: false })
    .limit(1);

  assert(!postErr, 'Posts table query must not fail');
  const latestPost = latestPosts?.[0];
  assert(Boolean(latestPost), 'A post record must exist for the user');

  if (latestPost) {
    assert(latestPost.provider_results?.generated_by === 'ai_autopilot', 'Post must be attributed to ai_autopilot');
    assert(latestPost.status === 'queued' || latestPost.status === 'scheduled', `Post status must be queued or scheduled (was: ${latestPost.status})`);
    
    // Safety check: If auto_publish was false, status MUST be queued/draft, NOT live
    if (configRecord.auto_publish === false) {
      assert(latestPost.provider_results?.is_draft === true, 'Draft flag must be true when auto_publish is false');
      assert(latestPost.provider_results?.approval_state === 'in_review', 'Approval state must be in_review when auto_publish is false');
    }
  }

  // --- SUITE 4: Verify Activity Stream Telemetry ---
  console.log('\n📋 [TEST 4]: Social Activity Stream Audit Telemetry');

  const { data: streamEvents } = await supabase
    .from('social_activity_stream')
    .select('*')
    .eq('user_id', testUserId)
    .order('created_at', { ascending: false })
    .limit(3);

  const hasAutopilotEvent = (streamEvents || []).some(
    (e) => e.event_type === 'draft_generated' || e.event_type === 'post_scheduled'
  );
  assert(hasAutopilotEvent, 'Activity stream must contain an Auto-Pilot generation event');

  // --- SUITE 5: Duplicate Prevention on Immediate Re-run ---
  console.log('\n📋 [TEST 5]: Idempotency & Frequency Throttling on Immediate Re-run');

  const secondRunSummary = await autopilotWorkerService.executeAutopilotCycle();
  assert(secondRunSummary.generated === 0, `Immediate second run must generate 0 posts due to frequency throttling (got: ${secondRunSummary.generated})`);
  assert(secondRunSummary.skippedNotDue >= 1, `Second run must skip configuration as not due (skipped: ${secondRunSummary.skippedNotDue})`);

  console.log('\n=========================================================================');
  console.log(`🎉 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAutopilotWorkerTests().catch((err) => {
  console.error('Test suite failed with unexpected error:', err);
  process.exit(1);
});
