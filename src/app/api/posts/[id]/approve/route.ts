import { NextResponse } from 'next/server';
import { publishingEngine } from '@/lib/services/publishing-engine';
import { workspaceService, canApproveContent } from '@/lib/services/rbac';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await request.json();
    const { 
      reviewerUserId = 'user_approver_003', 
      workspaceId = 'ws_northstar_main',
      decision, // 'approved' | 'changes_requested' | 'rejected'
      feedback 
    } = body;

    if (!decision || !['approved', 'changes_requested', 'rejected'].includes(decision)) {
      return NextResponse.json(
        { success: false, error: "Valid decision required: 'approved', 'changes_requested', or 'rejected'" },
        { status: 400 }
      );
    }

    const role = workspaceService.getMemberRole(workspaceId, reviewerUserId);
    if (!role || !canApproveContent(role)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Unauthorized: Role '${role || 'unknown'}' does not hold approval authority. Separate approver role required.` 
        },
        { status: 403 }
      );
    }

    const post = publishingEngine.getPost(postId);
    if (post && post.user_id === reviewerUserId && role === 'creator') {
      return NextResponse.json(
        { success: false, error: 'Self-approval forbidden: Creators cannot approve their own drafts.' },
        { status: 403 }
      );
    }

    const res = publishingEngine.recordApprovalDecision(postId, reviewerUserId, decision, feedback);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        post: res.post,
        approvalRecord: res.approvalRecord,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
