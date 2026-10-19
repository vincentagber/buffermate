import { NextResponse } from 'next/server';
import { workspaceService, ROLE_PERMISSIONS } from '@/lib/services/rbac';
import { WorkspaceRole } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params;
    const body = await request.json();
    const { userId, role, actorId = 'user_admin_001' } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: 'userId and role are required' },
        { status: 400 }
      );
    }

    if (!Object.keys(ROLE_PERMISSIONS).includes(role)) {
      return NextResponse.json(
        { success: false, error: `Invalid role '${role}'. Supported roles: ${Object.keys(ROLE_PERMISSIONS).join(', ')}` },
        { status: 400 }
      );
    }

    const res = workspaceService.addMember(workspaceId, userId, role as WorkspaceRole, actorId);

    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: res.member,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
