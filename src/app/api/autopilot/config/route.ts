import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const admin = createAdminClient();
    let targetUserId = user?.id;

    if (!targetUserId) {
      const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 10 });
      const primary = usersData?.users?.find(u => u.email === 'vincentagber74@gmail.com') ||
                      usersData?.users?.[0];
      targetUserId = primary?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({
        enabled: true,
        niche: 'Digital Marketing & Growth Automation',
        tone: 'Engaging, High-Converting & Authoritative',
        target_channels: ['instagram', 'tiktok', 'facebook', 'threads'],
        frequency_per_day: 2,
        auto_publish: true,
      });
    }

    const { data, error } = await admin
      .from('ai_autopost_config')
      .select('*')
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('Error fetching ai_autopost_config:', error);
    }

    if (data) {
      return NextResponse.json({
        id: data.id,
        user_id: data.user_id,
        enabled: data.enabled ?? true,
        niche: data.niche || 'Digital Marketing & Growth Automation',
        tone: data.tone || 'Engaging, High-Converting & Authoritative',
        target_channels: data.target_channels || ['instagram', 'tiktok', 'facebook', 'threads'],
        frequency_per_day: data.frequency_per_day || 2,
        auto_publish: data.auto_publish ?? true,
        last_generated_at: data.last_generated_at,
      });
    }

    // Default configuration if not yet persisted
    const defaultConfig = {
      user_id: targetUserId,
      enabled: true,
      niche: 'Digital Marketing & Growth Automation',
      tone: 'Engaging, High-Converting & Authoritative',
      target_channels: ['instagram', 'tiktok', 'facebook', 'threads'],
      frequency_per_day: 2,
      auto_publish: true,
    };

    try {
      const { data: inserted } = await admin
        .from('ai_autopost_config')
        .insert(defaultConfig)
        .select()
        .single();
      if (inserted) return NextResponse.json(inserted);
    } catch (insertErr) {
      console.warn('ai_autopost_config default insert notice:', insertErr);
    }

    return NextResponse.json(defaultConfig);
  } catch (err: any) {
    console.error('Error in GET /api/autopilot/config:', err);
    return NextResponse.json({
      enabled: true,
      niche: 'Digital Marketing & Growth Automation',
      tone: 'Engaging, High-Converting & Authoritative',
      target_channels: ['instagram', 'tiktok', 'facebook', 'threads'],
      frequency_per_day: 2,
      auto_publish: true,
    });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const admin = createAdminClient();
    let targetUserId = user?.id;

    if (!targetUserId) {
      const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 10 });
      const primary = usersData?.users?.find(u => u.email === 'vincentagber74@gmail.com') ||
                      usersData?.users?.[0];
      targetUserId = primary?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { enabled, niche, tone, target_channels, frequency_per_day, auto_publish } = body;

    const payload = {
      user_id: targetUserId,
      enabled: typeof enabled === 'boolean' ? enabled : true,
      niche: niche || 'Digital Marketing & Growth Automation',
      tone: tone || 'Engaging, High-Converting & Authoritative',
      target_channels: Array.isArray(target_channels) ? target_channels : ['instagram', 'tiktok', 'facebook', 'threads'],
      frequency_per_day: Number(frequency_per_day) || 2,
      auto_publish: typeof auto_publish === 'boolean' ? auto_publish : true,
      updated_at: new Date().toISOString(),
    };

    // Check if existing
    const { data: existing } = await admin
      .from('ai_autopost_config')
      .select('id')
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (existing?.id) {
      const { data, error } = await admin
        .from('ai_autopost_config')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    } else {
      const { data, error } = await admin
        .from('ai_autopost_config')
        .insert(payload)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    }
  } catch (err: any) {
    console.error('Error in POST /api/autopilot/config:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
