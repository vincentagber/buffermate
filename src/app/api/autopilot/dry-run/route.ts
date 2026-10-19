import { NextResponse } from 'next/server';
import { autopilotGuardrailService } from '@/lib/services/autopilot-guardrails';
import { workspaceService, canPerformAction } from '@/lib/services/rbac';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      ruleId = 'rule_welcome_dm_01', 
      triggerPayload = { content: 'Simulated trigger content' }, 
      workspaceId = 'ws_northstar_main',
      actorUserId = 'user_admin_001' 
    } = body;

    const role = workspaceService.getMemberRole(workspaceId, actorUserId);
    if (!role || !canPerformAction(role, 'automation:manage')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: actor cannot manage automation rules' },
        { status: 403 }
      );
    }

    const run = await autopilotGuardrailService.executeRule(
      ruleId, 
      triggerPayload, 
      true, // isDryRun = true
      actorUserId
    );

    return NextResponse.json({
      success: true,
      data: run,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
