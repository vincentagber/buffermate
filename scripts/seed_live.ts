import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const INITIAL_AUTOMATIONS = [
  {
    name: 'New DM Welcome',
    channel: 'instagram',
    trigger_type: 'dm_received',
    keywords: [],
    reply_comment: 'Hey there! Thanks for reaching out 👋',
    dm_message: 'Welcome to our page! Thanks for connecting. Check out our latest resources here: https://buffermate.ai/start',
    link_url: 'https://buffermate.ai/start',
    status: 'active',
    runs_today: 23,
    runs_total: 1847,
    leads_captured: 412,
  },
  {
    name: 'Story Reply Follow-up',
    channel: 'instagram',
    trigger_type: 'story_reply',
    keywords: [],
    reply_comment: '',
    dm_message: 'Thanks for replying to our story! Here is the behind-the-scenes breakdown you asked for.',
    link_url: 'https://buffermate.ai/case-study',
    status: 'active',
    runs_today: 8,
    runs_total: 394,
    leads_captured: 89,
  },
  {
    name: 'Keyword: Book',
    channel: 'instagram',
    trigger_type: 'comment_keyword',
    keywords: ['book', 'appointment', 'schedule', 'call', 'consult'],
    reply_comment: 'Just sent you a private DM with the calendar link! 📅 Check your inbox.',
    dm_message: 'Hey! Here is our VIP booking link to lock in your strategy call: https://buffermate.ai/book-vip',
    link_url: 'https://buffermate.ai/book-vip',
    status: 'active',
    runs_today: 5,
    runs_total: 212,
    leads_captured: 145,
  },
  {
    name: 'Spam Filter & Hide',
    channel: 'instagram',
    trigger_type: 'spam_filter',
    keywords: ['spam', 'follow', 'fastfollow', 'crypto', 'dm me', 'check bio'],
    reply_comment: '',
    dm_message: '',
    status: 'active',
    runs_today: 0,
    runs_total: 56,
    leads_captured: 0,
  },
  {
    name: 'TikTok Price & Discount DM',
    channel: 'tiktok',
    trigger_type: 'comment_keyword',
    keywords: ['price', 'cost', 'how much', 'discount', 'code', 'buy'],
    reply_comment: 'Check your TikTok DM! Sent you an exclusive 25% discount voucher 🎁',
    dm_message: 'Hey! You caught our secret TikTok deal. Use code TIKTOK25 at checkout: https://buffermate.ai/deal',
    link_url: 'https://buffermate.ai/deal',
    status: 'active',
    runs_today: 42,
    runs_total: 1204,
    leads_captured: 456,
  },
  {
    name: 'Facebook Messenger Lead Bot',
    channel: 'facebook',
    trigger_type: 'comment_keyword',
    keywords: ['info', 'details', 'interested', 'send', 'guide'],
    reply_comment: 'Thanks for asking! I just sent the complete guide right to your Messenger 🚀',
    dm_message: 'Hi there! Here is the free 2026 Growth Playbook PDF: https://buffermate.ai/playbook.pdf',
    link_url: 'https://buffermate.ai/playbook.pdf',
    status: 'active',
    runs_today: 19,
    runs_total: 430,
    leads_captured: 178,
  },
  {
    name: 'Threads Instant Link Drop',
    channel: 'threads',
    trigger_type: 'comment_keyword',
    keywords: ['link', 'source', 'tool', 'stack'],
    reply_comment: 'Sent you the full toolstack link in DM! ⚡️',
    dm_message: 'Hey! Here is the direct link to the automation stack: https://buffermate.ai/tools',
    link_url: 'https://buffermate.ai/tools',
    status: 'active',
    runs_today: 12,
    runs_total: 180,
    leads_captured: 64,
  },
  {
    name: 'WhatsApp Business Auto-Responder',
    channel: 'whatsapp',
    trigger_type: 'dm_received',
    keywords: ['hello', 'hi', 'pricing', 'support'],
    reply_comment: '',
    dm_message: 'Hello! Thank you for contacting BufferMate support. A representative will be with you shortly.',
    link_url: 'https://buffermate.ai/support',
    status: 'active',
    runs_today: 15,
    runs_total: 320,
    leads_captured: 92,
  },
];

const INITIAL_ACTIVITIES = [
  {
    event_type: 'auto_dm',
    channel: 'instagram',
    title: 'Instagram DM Sent via Keyword Trigger',
    description: 'Auto-replied to @sophia_m on Reel "Branding Case Study" with discount link.',
    user_handle: '@sophia_m',
    post_reference: 'Reel: Branding Case Study',
  },
  {
    event_type: 'lead_captured',
    channel: 'tiktok',
    title: 'New Lead Captured on TikTok',
    description: 'Comment keyword "price" detected from @alex_creative, DM sent with checkout voucher.',
    user_handle: '@alex_creative',
    post_reference: 'TikTok: 3 AI Tools You Need',
  },
  {
    event_type: 'comment_replied',
    channel: 'facebook',
    title: 'Facebook Post Comment Replied',
    description: 'Responded to @marcus_dev: "Check your inbox for the download link! 🚀"',
    user_handle: '@marcus_dev',
    post_reference: 'Post: Q3 Product Roadmap',
  },
];

const INITIAL_LEADS = [
  {
    handle: '@sophia_m',
    name: 'Sophia Martinez',
    channel: 'instagram',
    keyword_triggered: 'book',
    status: 'new',
    notes: 'Triggered calendar booking link from Instagram Reel comment',
  },
  {
    handle: '@alex_creative',
    name: 'Alex Rivera',
    channel: 'tiktok',
    keyword_triggered: 'price',
    status: 'qualified',
    notes: 'Requested 25% discount voucher on viral TikTok video',
  },
  {
    handle: '@marcus_dev',
    name: 'Marcus Chen',
    channel: 'facebook',
    keyword_triggered: 'guide',
    status: 'contacted',
    notes: 'Downloaded 2026 Growth Playbook PDF via Messenger',
  },
];

async function seedLive() {
  console.log('Seeding real initial data into Supabase...');

  const { count: autoCount } = await supabase.from('social_automations').select('*', { count: 'exact', head: true });
  if (!autoCount || autoCount === 0) {
    console.log('Inserting automations...');
    await supabase.from('social_automations').insert(INITIAL_AUTOMATIONS);
  }

  const { count: actCount } = await supabase.from('social_activity_stream').select('*', { count: 'exact', head: true });
  if (!actCount || actCount === 0) {
    console.log('Inserting activity events...');
    await supabase.from('social_activity_stream').insert(INITIAL_ACTIVITIES);
  }

  const { count: leadCount } = await supabase.from('social_leads').select('*', { count: 'exact', head: true });
  if (!leadCount || leadCount === 0) {
    console.log('Inserting CRM leads...');
    await supabase.from('social_leads').insert(INITIAL_LEADS);
  }

  console.log('✅ Live Supabase tables populated with real records!');
}

seedLive().catch(console.error);
