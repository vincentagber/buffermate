import { NextResponse } from 'next/server';
import { workspaceService } from '@/lib/services/rbac';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user_admin_001';

    const workspaces = workspaceService.listWorkspacesForUser(userId);
    return NextResponse.json({
      success: true,
      data: workspaces,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, timezone, ownerUserId = 'user_admin_001' } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const ws = workspaceService.createWorkspace({
      name,
      slug,
      timezone: timezone || 'UTC',
      ownerUserId,
    });

    return NextResponse.json({
      success: true,
      data: ws,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
