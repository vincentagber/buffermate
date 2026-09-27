import { NextResponse } from 'next/server';
import { connectionManager, SocialPlatformName } from '@/lib/services/social/ConnectionManager';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') as SocialPlatformName | null;

  try {
    if (platform) {
      const report = await connectionManager.testPlatformConnection(platform);
      return NextResponse.json({ success: report.status === 'passed', report });
    }

    const allReports = await connectionManager.testAllPlatforms();
    const allPassed = Object.values(allReports).every((r) => r.status === 'passed');

    return NextResponse.json({
      success: allPassed,
      reports: allReports,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, credentials } = body;

    if (!platform) {
      return NextResponse.json({ error: 'Platform is required' }, { status: 400 });
    }

    const report = await connectionManager.testPlatformConnection(platform, credentials);
    return NextResponse.json({ success: report.status === 'passed', report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
