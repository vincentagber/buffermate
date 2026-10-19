import { NextResponse } from 'next/server';
import { autopilotGuardrailService } from '@/lib/services/autopilot-guardrails';
import { workspaceService, canPerformAction } from '@/lib/services/rbac';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get('workspaceId') || 'ws_northstar_main';
  const killed = autopilotGuardrailService.isKillSwitchActive(workspaceId);

  return NextResponse.json({
    success: true,
    data: {
      workspaceId,
      killed,
      status: killed ? 'HALTED_BY_KILL_SWITCH' : 'ACTIVE',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      workspaceId = 'ws_northstar_main', 
      actorUserId = 'user_admin_001', 
      enableKill, 
      reason = 'Emergency operational pause' 
    } = body;

    const role = workspaceService.getMemberRole(workspaceId, actorUserId);
    if (!role || !canPerformAction(role, 'automation:kill_switch')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: actor cannot operate automation kill switch' },
        { status: 403 }
      );
    }

    let result;
    if (enableKill) {
      result = autopilotGuardrailService.triggerKillSwitch(workspaceId, actorUserId, reason);
    } else {
      result = autopilotGuardrailService.resumeAutopilot(workspaceId, actorUserId);
    }

    return NextResponse.json({
      success: true,
      data: {
        workspaceId,
        killed: result.killed,
        status: result.killed ? 'HALTED_BY_KILL_SWITCH' : 'ACTIVE',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
