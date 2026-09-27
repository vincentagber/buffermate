import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      channel = 'instagram',
      user_handle = '@user',
      comment_text = '',
      post_reference = 'Reel Post',
    } = body;

    // 1. Fetch active automations for this channel
    const { data: flows, error: flowsError } = await supabase
      .from('social_automations')
      .select('*')
      .eq('channel', channel)
      .eq('status', 'active');

    if (flowsError) {
      return NextResponse.json({ success: false, error: flowsError.message }, { status: 500 });
    }

    const normalizedText = comment_text.toLowerCase();
    let matchedFlow: any = null;
    let matchedKeyword = '';

    for (const flow of flows || []) {
      if (flow.trigger_type === 'comment_keyword' && Array.isArray(flow.keywords)) {
        for (const kw of flow.keywords) {
          if (normalizedText.includes(kw.toLowerCase())) {
            matchedFlow = flow;
            matchedKeyword = kw;
            break;
          }
        }
      }
      if (matchedFlow) break;
    }

    // Default fallback if no specific keyword matched but active flows exist
    if (!matchedFlow && flows && flows.length > 0) {
      matchedFlow = flows[0];
      matchedKeyword = 'auto';
    }

    if (!matchedFlow) {
      return NextResponse.json({
        success: true,
        matched: false,
        message: 'No active automation matched the keyword.',
      });
    }

    const publicReply = matchedFlow.reply_comment || 'Thanks for commenting! Sent you a DM 🚀';
    const privateDm = matchedFlow.dm_message || `Hey ${user_handle}! Here is the direct link: ${matchedFlow.link_url || 'https://buffermate.ai'}`;

    // 2. Increment stats on flow in database
    await supabase
      .from('social_automations')
      .update({
        runs_today: (matchedFlow.runs_today || 0) + 1,
        runs_total: (matchedFlow.runs_total || 0) + 1,
        leads_captured: (matchedFlow.leads_captured || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', matchedFlow.id);

    // 3. Log real activity event to activity stream
    const { data: activityLog } = await supabase
      .from('social_activity_stream')
      .insert({
        event_type: 'auto_dm',
        channel,
        title: `${channel.toUpperCase()} DM Sent via Keyword Trigger`,
        description: `Auto-replied to ${user_handle} on "${post_reference}" (matched "${matchedKeyword}").`,
        user_handle,
        post_reference,
        metadata: {
          keyword: matchedKeyword,
          automation_id: matchedFlow.id,
          public_reply: publicReply,
          private_dm: privateDm,
        },
      })
      .select()
      .single();

    // 4. Record lead in Social CRM
    const { data: leadRecord } = await supabase
      .from('social_leads')
      .insert({
        handle: user_handle,
        name: user_handle.replace('@', '').replace('_', ' '),
        channel,
        keyword_triggered: matchedKeyword,
        automation_id: matchedFlow.id,
        status: 'new',
        notes: `Triggered from ${channel} comment on "${post_reference}"`,
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      matched: true,
      matched_keyword: matchedKeyword,
      automation: matchedFlow,
      public_reply: publicReply,
      private_dm: privateDm,
      activity: activityLog,
      lead: leadRecord,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
