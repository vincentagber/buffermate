import { NextResponse } from 'next/server';
import { publishingEngine } from '@/lib/services/publishing-engine';
import { workspaceService, canPerformAction } from '@/lib/services/rbac';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await request.json().catch(() => ({}));
    const { actorUserId = 'user_creator_002', workspaceId = 'ws_northstar_main' } = body;

    const role = workspaceService.getMemberRole(workspaceId, actorUserId);
    if (!role || !canPerformAction(role, 'content:submit_for_approval')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: actor cannot submit content for approval' },
        { status: 403 }
      );
    }

    const res = publishingEngine.submitForApproval(postId, actorUserId);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: res.post,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
