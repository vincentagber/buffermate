import { NextResponse } from 'next/server';
import { publishingEngine } from '@/lib/services/publishing-engine';
import { workspaceService, canPublishContent } from '@/lib/services/rbac';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await request.json().catch(() => ({}));
    const { actorUserId = 'user_admin_001', workspaceId = 'ws_northstar_main' } = body;

    const role = workspaceService.getMemberRole(workspaceId, actorUserId);
    if (!role || !canPublishContent(role)) {
      return NextResponse.json(
        { success: false, error: `Unauthorized: Role '${role || 'unknown'}' cannot trigger publishing retries.` },
        { status: 403 }
      );
    }

    const res = await publishingEngine.retryJob(jobId, actorUserId);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: res.job,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
