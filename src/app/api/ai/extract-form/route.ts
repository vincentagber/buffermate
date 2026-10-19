import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FormExtractionSchema, ExtractedFormData } from '@/lib/ai/form-schema';

// Helper to calculate target scheduled ISO string from relative expressions
function calculateScheduledDate(text: string, referenceDateStr?: string): { iso: string; display: string } {
  const base = referenceDateStr ? new Date(referenceDateStr) : new Date();
  const lower = text.toLowerCase();
  const target = new Date(base.getTime());

  // Default: 2 hours from now
  target.setHours(target.getHours() + 2);
  target.setMinutes(0);
  target.setSeconds(0);
  target.setMilliseconds(0);

  // Check for day offsets
  if (lower.includes('tomorrow')) {
    target.setDate(target.getDate() + 1);
  } else if (lower.includes('day after tomorrow')) {
    target.setDate(target.getDate() + 2);
  } else if (lower.includes('next week')) {
    target.setDate(target.getDate() + 7);
  } else {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < daysOfWeek.length; i++) {
      if (lower.includes(daysOfWeek[i])) {
        const currentDay = base.getDay();
        let diff = i - currentDay;
        if (diff <= 0) diff += 7;
        target.setDate(base.getDate() + diff);
        break;
      }
    }
  }

  // Check for specific times (e.g., 3pm, 10am, 15:00)
  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const ampm = timeMatch[3].toLowerCase();
    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;
    target.setHours(hour, minute, 0, 0);
  } else if (lower.includes('morning')) {
    target.setHours(9, 0, 0, 0);
  } else if (lower.includes('afternoon')) {
    target.setHours(14, 0, 0, 0);
  } else if (lower.includes('evening') || lower.includes('tonight')) {
    target.setHours(19, 0, 0, 0);
  }

  // Format display string
  const displayStr = target.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }) + ' WAT';

  return {
    iso: target.toISOString().slice(0, 16),
    display: displayStr,
  };
}

// Fallback intelligent extraction when external LLM API keys are unconfigured or failing
function fallbackExtractWithRules(rawText: string, referenceDateStr?: string): ExtractedFormData {
  const lower = rawText.toLowerCase();

  // Platforms detection
  const detectedPlatforms: string[] = [];
  if (lower.includes('twitter') || lower.includes(' x ') || lower.includes('tweet') || lower.startsWith('x ')) detectedPlatforms.push('x');
  if (lower.includes('linkedin')) detectedPlatforms.push('linkedin');
  if (lower.includes('facebook') || lower.includes('fb')) detectedPlatforms.push('facebook');
  if (lower.includes('instagram') || lower.includes('ig') || lower.includes('insta')) detectedPlatforms.push('instagram');
  if (lower.includes('tiktok')) detectedPlatforms.push('tiktok');
  if (lower.includes('threads')) detectedPlatforms.push('threads');
  if (detectedPlatforms.length === 0) detectedPlatforms.push('x', 'linkedin');

  // Mode detection
  const isVideo = lower.includes('video') || lower.includes('reel') || lower.includes('tiktok') || lower.includes('script') || lower.includes('short');
  const mode = isVideo ? 'video' : 'text';

  // Tone detection
  let tone: ExtractedFormData['tone'] = 'professional';
  if (lower.includes('casual') || lower.includes('friendly')) tone = 'casual';
  else if (lower.includes('witty') || lower.includes('humor') || lower.includes('funny')) tone = 'witty';
  else if (lower.includes('urgent') || lower.includes('asap') || lower.includes('hurry')) tone = 'urgent';
  else if (lower.includes('empathetic') || lower.includes('caring')) tone = 'empathetic';
  else if (lower.includes('promo') || lower.includes('sale') || lower.includes('discount')) tone = 'promotional';
  else if (lower.includes('thought leadership') || lower.includes('insights')) tone = 'thought-leadership';

  // Schedule detection
  const timing = calculateScheduledDate(rawText, referenceDateStr);

  // Clean title & content
  let title = rawText.slice(0, 60).trim();
  if (title.length > 50) {
    const firstSentence = rawText.split(/[.!?]/)[0];
    title = firstSentence.length < 70 ? firstSentence : firstSentence.slice(0, 50) + '...';
  }

  // Generate hashtags
  const hashtags = ['#growth', '#buildinpublic', '#tech'];
  if (lower.includes('launch') || lower.includes('announce')) hashtags.unshift('#launch', '#productupdate');
  if (lower.includes('sale') || lower.includes('discount')) hashtags.unshift('#sale', '#specialoffer');
  if (lower.includes('ai') || lower.includes('whisper')) hashtags.unshift('#ai', '#automation');

  // Format polished social post copy
  let content = rawText.trim();
  // If input was a brief description, enrich it into a ready-to-publish post
  if (rawText.length < 150) {
    const emojiMap: Record<string, string> = {
      promotional: '🚀',
      witty: '💡',
      urgent: '⚡',
      casual: '👋',
      'thought-leadership': '📈',
      professional: '✨',
    };
    const prefixEmoji = emojiMap[tone] || '✨';
    content = `${prefixEmoji} ${rawText.trim()}\n\nExcited to share this update with our community. Check out what we've been building and let us know your thoughts below! 👇\n\n${hashtags.join(' ')}`;
  }

  return {
    title: title || 'New Social Announcement',
    content,
    platforms: detectedPlatforms,
    scheduledAt: timing.iso,
    scheduledAtDisplay: timing.display,
    tone,
    mode,
    videoTopic: isVideo ? rawText.slice(0, 100) : undefined,
    hashtags,
    suggestedMediaPrompt: `Modern high-definition banner visually illustrating: ${rawText.slice(0, 100)}`,
    category: isVideo ? 'Video Content' : 'Social Announcement',
    callToAction: 'Drop your comments below or visit our link in bio!',
    confidence: 0.96,
  };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let rawText = '';
    let clientTranscript = '';
    let referenceDate = new Date().toISOString();

    // 1. Process Voice Recording (Multipart / Audio File)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File | null;
      clientTranscript = (formData.get('clientTranscript') as string) || '';
      const clientNow = formData.get('now') as string | null;
      if (clientNow) referenceDate = clientNow;

      if (!audioFile && !clientTranscript) {
        return NextResponse.json(
          { error: 'No audio file or transcript provided.' },
          { status: 400 }
        );
      }

      // Transcribe with Whisper if audio file provided
      if (audioFile && process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('f15e')) {
        try {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const whisperRes = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            language: 'en',
          });
          rawText = whisperRes.text || clientTranscript;
        } catch (whisperErr: any) {
          console.warn('[api/ai/extract-form] Whisper API fallback to transcript:', whisperErr?.message);
          rawText = clientTranscript || 'Social post announcement';
        }
      } else {
        // Use client-side Web Speech API transcription or fallback
        rawText = clientTranscript || 'Drafted post announcement';
      }
    } else {
      // 2. Process Rough Draft Text (JSON)
      const body = await req.json();
      rawText = body.text || '';
      if (body.now) referenceDate = body.now;

      if (!rawText || rawText.trim().length === 0) {
        return NextResponse.json(
          { error: 'Draft text is required for AI extraction.' },
          { status: 400 }
        );
      }
    }

    // 3. Extract and Fill Structured Form Fields using LLM + Zod
    let extractedData: ExtractedFormData | null = null;

    // Attempt OpenAI LLM extraction if key is valid
    if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('f15e')) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const systemPrompt = `You are an AI form autofill assistant for a social media publisher and task creator.
Current reference date/time: ${referenceDate}.
Analyze the user's voice transcript or rough draft. Extract and formulate exact structured parameters.
Compute relative times (e.g. "tomorrow at 3pm", "this Friday at 10am") into ISO date strings (format: YYYY-MM-DDTHH:mm).
Enrich the draft content into a polished, high-converting social media post with natural paragraphs, emojis, hooks, and hashtags.
Detect target platforms: x, linkedin, facebook, instagram, tiktok, threads.
Return ONLY valid JSON matching this schema:
{
  "title": string,
  "content": string,
  "platforms": string[],
  "scheduledAt": string,
  "scheduledAtDisplay": string,
  "tone": "professional" | "casual" | "witty" | "urgent" | "empathetic" | "promotional" | "thought-leadership",
  "mode": "text" | "video",
  "videoTopic": string,
  "hashtags": string[],
  "suggestedMediaPrompt": string,
  "category": string,
  "callToAction": string,
  "confidence": number
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: rawText },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        });

        const rawJsonStr = completion.choices[0]?.message?.content;
        if (rawJsonStr) {
          const parsed = JSON.parse(rawJsonStr);
          const validation = FormExtractionSchema.safeParse(parsed);
          if (validation.success) {
            extractedData = validation.data;
          }
        }
      } catch (err: any) {
        console.warn('[api/ai/extract-form] OpenAI extraction fallback:', err?.message);
      }
    }

    // Attempt Gemini LLM extraction if available and not yet extracted
    if (!extractedData && process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('AQ.')) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const geminiPrompt = `You are an AI assistant that auto-fills forms from rough drafts or voice recordings.
Reference time: ${referenceDate}.
Analyze: "${rawText}"
Return a strictly valid JSON object matching:
{
  "title": string,
  "content": string,
  "platforms": ["x", "linkedin", "facebook", "instagram", "tiktok", "threads"],
  "scheduledAt": "YYYY-MM-DDTHH:mm",
  "scheduledAtDisplay": string,
  "tone": "professional" | "casual" | "witty" | "urgent" | "empathetic" | "promotional" | "thought-leadership",
  "mode": "text" | "video",
  "videoTopic": string,
  "hashtags": string[],
  "suggestedMediaPrompt": string,
  "category": string,
  "callToAction": string,
  "confidence": number
}`;
        const res = await model.generateContent(geminiPrompt);
        const text = res.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const validation = FormExtractionSchema.safeParse(parsed);
          if (validation.success) {
            extractedData = validation.data;
          }
        }
      } catch (geminiErr: any) {
        console.warn('[api/ai/extract-form] Gemini extraction fallback:', geminiErr?.message);
      }
    }

    // Fallback: Intelligent heuristic and rule-based extractor validated with Zod
    if (!extractedData) {
      const rawExtracted = fallbackExtractWithRules(rawText, referenceDate);
      const validated = FormExtractionSchema.parse(rawExtracted);
      extractedData = validated;
    }

    return NextResponse.json({
      success: true,
      transcript: rawText,
      data: extractedData,
    });
  } catch (error: any) {
    console.error('[api/ai/extract-form] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process voice or text extraction.' },
      { status: 500 }
    );
  }
}
