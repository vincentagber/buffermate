import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { topic = 'Social Media Automation & Growth', niche = 'Marketing', channels = ['instagram', 'tiktok', 'facebook', 'threads'] } = await req.json();

    let generatedSuggestions = [];

    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = `You are an elite social media growth strategist. Generate 3 viral post concepts for ${niche} about: "${topic}".
Each post must include:
- topic: short title
- hook: an attention-grabbing opening line
- content: a high-engagement caption with line breaks and call-to-action to comment a keyword (like 'GUIDE', 'PRICE', 'ACCESS', 'BOOK') for instant DM delivery.
- hashtags: array of 4-6 hashtags
- recommended_time: best time to post today/tomorrow
- call_to_action: clear instructions on what keyword to comment
- estimated_engagement: e.g. "95% Viral Potential"

Format strictly as a valid JSON array of objects with keys: topic, hook, content, hashtags, recommended_time, call_to_action, estimated_engagement.`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        });

        const raw = response.choices[0].message.content || '{}';
        const parsed = JSON.parse(raw);
        generatedSuggestions = parsed.posts || parsed.suggestions || (Array.isArray(parsed) ? parsed : Object.values(parsed)[0]) || [];
      } catch (aiErr) {
        console.warn('OpenAI call failed, using dynamic generator fallback:', aiErr);
      }
    }

    if (!Array.isArray(generatedSuggestions) || generatedSuggestions.length === 0) {
      const cleanTopic = topic && topic.trim() ? topic.trim() : 'Digital Marketing & Growth Automation';
      
      // Derive contextual keyword trigger from topic
      let keyword = 'ACCESS';
      const lower = cleanTopic.toLowerCase();
      if (lower.includes('course') || lower.includes('coaching') || lower.includes('class')) keyword = 'COURSE';
      else if (lower.includes('launch') || lower.includes('product') || lower.includes('shop')) keyword = 'LAUNCH';
      else if (lower.includes('lead') || lower.includes('client') || lower.includes('scale')) keyword = 'LEADS';
      else if (lower.includes('demo') || lower.includes('app') || lower.includes('software')) keyword = 'DEMO';
      else if (lower.includes('price') || lower.includes('cost') || lower.includes('quote')) keyword = 'PRICE';

      const hashtagsBase = cleanTopic
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(' ')
        .filter((w: string) => w.length > 3)
        .slice(0, 2)
        .map((w: string) => `#${w}`);

      generatedSuggestions = [
        {
          id: `sug-${Date.now()}-1`,
          topic: `${cleanTopic} Blueprint`,
          hook: cleanTopic.toLowerCase().includes('comment') || cleanTopic.toLowerCase().includes('digital marketing')
            ? 'How one simple comment automation generated 1,200 leads in 48 hours without spending $1 on ads 🤯'
            : `How one simple comment automation for "${cleanTopic}" generated 1,200 leads in 48 hours without spending $1 on ads 🤯`,
          content: `Most creators lose 80% of their post engagement because they cannot reply to comments fast enough.\n\nHere is the exact 3-step flywheel we use for ${cleanTopic}:\n1. Hook followers with a high-value resource\n2. Ask for a specific keyword comment (e.g. "${keyword}")\n3. Our AI engine instantly replies and DMs the link!\n\nComment "${keyword}" below to test this live right now! 👇\n\n#socialautomation #marketinghacks #leadgeneration #contentcreator ${hashtagsBase.join(' ')}`,
          hashtags: ['#socialautomation', '#marketinghacks', '#leadgeneration', '#contentcreator', ...hashtagsBase],
          recommended_time: 'Today at 6:30 PM (Peak Reach Window)',
          target_channels: channels.length >= 3 ? channels.slice(0, 3) : channels,
          call_to_action: `Comment "${keyword}" to get the playbook DM'd instantly.`,
          estimated_engagement: '94% Viral Potential',
        },
        {
          id: `sug-${Date.now()}-2`,
          topic: `24/7 Conversion Funnel`,
          hook: 'Why smart brands never leave customer DMs unread in 2026 📈',
          content: `Speed to lead is everything. If a follower asks for info on ${cleanTopic}, replying in 2 minutes vs 2 hours makes a 391% difference in conversion.\n\nAutomate your responses across ${channels.join(', ')} with zero code.\n\nDrop "DEMO" below for a private walkthrough!`,
          hashtags: ['#growthmindset', '#businesstips', '#marketingstrategy', '#entrepreneurship', ...hashtagsBase],
          recommended_time: 'Tomorrow at 9:00 AM (Morning Catch-up)',
          target_channels: channels.length >= 3 ? [channels[0], channels[1] || channels[0], channels[2] || channels[0]] : channels,
          call_to_action: 'Drop "DEMO" to test the auto-responder.',
          estimated_engagement: '88% High Conversion',
        },
        {
          id: `sug-${Date.now()}-3`,
          topic: `Multi-Platform Publishing`,
          hook: 'Stop posting manually to 5 different social networks one by one 🛑',
          content: `Publishing everywhere doesn't mean working 10 hours a day.\n\nWith BufferMate AI, write once, optimize with AI per platform for ${cleanTopic}, and schedule in 30 seconds.\n\nCheck the link in our bio to try it free today!`,
          hashtags: ['#productivitytips', '#socialmediamarketing', '#buffersocial', '#digitalmarketing', ...hashtagsBase],
          recommended_time: 'Thursday at 1:15 PM (Lunchtime Surge)',
          target_channels: channels,
          call_to_action: 'Click link in bio or drop "START" for instant onboarding.',
          estimated_engagement: '91% High Save Rate',
        },
      ];
    }

    return NextResponse.json({
      success: true,
      data: generatedSuggestions.map((s: any, idx: number) => ({
        id: s.id || `sug-${Date.now()}-${idx}`,
        target_channels: s.target_channels || channels,
        ...s,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
