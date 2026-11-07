import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Database,
  RefreshCw,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | BufferMate Social Media Automation',
  description:
    'Detailed Privacy Policy for BufferMate, explaining our data collection, AES-256 encrypted OAuth token storage, TikTok Developer API integration, data retention, and user data deletion procedures.',
  alternates: {
    canonical: 'https://buffermate.vercel.app/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 7, 2026';
  const effectiveDate = 'January 15, 2026';

  return (
    <div className="min-h-screen bg-[#E2E0D5] text-[#000000] relative selection:bg-[#00784D]/30 selection:text-[#000000]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#07B979]/15 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#141416]/8 to-transparent blur-[140px]" />
      </div>

      <MarketingNavbar />

      <main className="flex-1 flex flex-col w-full relative">
        {/* Header Hero */}
        <section className="relative overflow-hidden w-full px-5 md:px-10 pt-16 pb-12 sm:pt-20 sm:pb-16 border-b border-[#141416]/10">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141416] text-white text-[12px] font-mono uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5 text-[#07B979]" />
              <span>Security &amp; Data Protection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-hero-sans font-normal tracking-[-0.04em] text-[#000000] leading-tight">
              Privacy{' '}
              <span
                className="font-hero-sans font-black tracking-[-0.04em] inline-block"
                style={{
                  backgroundImage:
                    'linear-gradient(to right bottom in oklab, rgb(0, 120, 77) 0%, rgb(7, 185, 121) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}
              >
                Policy
              </span>
            </h1>

            <p className="font-hero-sans text-base sm:text-lg text-[#141416]/75 max-w-2xl mx-auto leading-relaxed">
              At BufferMate, we believe in radical transparency regarding how your data is handled. This policy details our data practices, AES-256 token encryption, third-party platform integrations, and how you retain full control over your information.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#141416]/70 pt-2">
              <span>Effective Date: <strong>{effectiveDate}</strong></span>
              <span>•</span>
              <span>Last Updated: <strong>{lastUpdated}</strong></span>
              <span>•</span>
              <span>Compliance: <strong>GDPR / CCPA / TikTok Open API</strong></span>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="max-w-4xl mx-auto px-5 md:px-8 py-12 sm:py-16">
          <div className="bg-white rounded-[28px] border border-[#141416]/15 shadow-xl p-6 sm:p-12 space-y-12 text-[#141416] leading-relaxed">
            {/* Security Guarantee Box */}
            <div className="p-6 rounded-2xl bg-[#141416] text-white space-y-3">
              <div className="flex items-center space-x-2 text-[#07B979] font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Our Core Privacy Commitments</span>
              </div>
              <ul className="text-sm text-zinc-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#07B979] font-bold">✓</span>
                  <span><strong>Zero Password Storage:</strong> We never see, prompt for, or store your passwords for TikTok, Instagram, Facebook, X, or any social media network.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#07B979] font-bold">✓</span>
                  <span><strong>AES-256 Encryption at Rest:</strong> All OAuth tokens and refresh keys are encrypted using AES-256-GCM before database write operations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#07B979] font-bold">✓</span>
                  <span><strong>No Sale of Personal Data:</strong> We do not sell, rent, monetize, or share your data or social media audience metrics with third-party data brokers or advertisers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#07B979] font-bold">✓</span>
                  <span><strong>Immediate Self-Serve Deletion:</strong> You can disconnect accounts or delete all stored data with a single click at any time.</span>
                </li>
              </ul>
            </div>

            {/* Section 1: Information We Collect */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">1</span>
                Information We Collect
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                We only collect data necessary to provide BufferMate&rsquo;s social media scheduling, automation, and analytics services:
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#000000] flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#00784D]" />
                    A. BufferMate Account Information
                  </h3>
                  <p className="text-xs sm:text-sm text-[#141416]/80">
                    When registering an account on BufferMate (<a href="https://buffermate.vercel.app" className="text-[#00784D] underline">https://buffermate.vercel.app</a>), we collect your email address, full name, and encrypted authentication credentials managed securely via Supabase Auth.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#000000] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#00784D]" />
                    B. Social Media OAuth Data &amp; Permissions
                  </h3>
                  <p className="text-xs sm:text-sm text-[#141416]/80 leading-relaxed">
                    When you link social accounts, you authorize BufferMate via official OAuth 2.0 protocols. We receive and store:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#141416]/80">
                    <li>
                      <strong>TikTok:</strong> We request scopes <code>user.info.basic</code> and <code>video.publish</code> (or <code>video.upload</code>). We receive and store your TikTok <code>open_id</code>, <code>union_id</code>, public display name, handle (username), avatar URL, and encrypted OAuth access and refresh tokens.
                    </li>
                    <li>
                      <strong>Meta (Instagram &amp; Facebook):</strong> We store Page access tokens, connected Instagram business account IDs, page names, and profile avatars for post dispatch and comment sync.
                    </li>
                    <li>
                      <strong>X (Twitter):</strong> OAuth 2.0 user tokens and screen names.
                    </li>
                    <li>
                      <strong>LinkedIn:</strong> Member ID and authorized company page tokens.
                    </li>
                    <li>
                      <strong>Threads:</strong> Threads user ID and publishing tokens.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#000000] flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#00784D]" />
                    C. User Content &amp; Media Attachments
                  </h3>
                  <p className="text-xs sm:text-sm text-[#141416]/80">
                    Captions, hashtags, video files, images, scheduling preferences, and drafts you upload or generate in BufferMate. Media is stored in secure cloud storage buckets strictly to deliver your posts to social networks at your designated schedule times.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#000000] flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#00784D]" />
                    D. Inbox Messages &amp; Public Analytics
                  </h3>
                  <p className="text-xs sm:text-sm text-[#141416]/80">
                    To power the Unified Social Inbox and Analytics dashboards, BufferMate fetches public comments and engagement metrics (impressions, views, likes, shares, comments) on posts published through or connected to your workspace.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 2: How We Use Your Information */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">2</span>
                How We Use Your Information
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                BufferMate uses your information strictly to operate the features you deliberately activate:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#141416]/80">
                <li>
                  <strong>Direct Video &amp; Post Publishing:</strong> Uploading and publishing your scheduled videos, images, and text to TikTok, Instagram, Facebook, X, LinkedIn, and Threads at your chosen time.
                </li>
                <li>
                  <strong>Token Renewal:</strong> Automatically refreshing OAuth tokens using official platform endpoints (such as <code>https://open.tiktokapis.com/v2/oauth/token/</code>) before they expire so your scheduled publishing continues uninterrupted.
                </li>
                <li>
                  <strong>AI Content Generation:</strong> Processing your prompts in the AI Studio via the Google Gemini API to draft hooks, captions, and script ideas. Prompts are used transiently to generate responses and are not used to train proprietary public AI models without consent.
                </li>
                <li>
                  <strong>Customer Support &amp; System Health:</strong> Troubleshooting failed posts, monitoring API rate limit health, and responding to support inquiries.
                </li>
              </ul>
            </article>

            {/* Section 3: TikTok Developer Compliance & Data Practices */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">3</span>
                TikTok Developer Platform Compliance
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                In strict compliance with the{' '}
                <a
                  href="https://developers.tiktok.com/doc/developer-terms-of-service"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00784D] font-semibold underline inline-flex items-center gap-0.5"
                >
                  TikTok Developer Terms of Service <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and TikTok Platform Guidelines:
              </p>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#141416]/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#07B979] shrink-0 mt-0.5" />
                    <span>
                      <strong>Purpose Limitation:</strong> TikTok user data is collected and processed solely to authenticate your identity in your BufferMate workspace and to execute your user-initiated video publishing commands.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#07B979] shrink-0 mt-0.5" />
                    <span>
                      <strong>No Data Aggregation or Brokering:</strong> We do not aggregate TikTok user data across unrelated accounts, and we do not sell, rent, or transfer TikTok data to any data brokers, ad networks, or third-party marketing services.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#07B979] shrink-0 mt-0.5" />
                    <span>
                      <strong>Independent Action:</strong> BufferMate will never publish content to your TikTok account without your explicit scheduling, approval, or automated queue instructions configured in your workspace.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#07B979] shrink-0 mt-0.5" />
                    <span>
                      <strong>Video Compliance Validation:</strong> Videos uploaded for TikTok publishing are validated to ensure compliance with TikTok specifications (MP4/WebM formats, duration, aspect ratio, audio codecs) before initiating upload.
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* Section 4: Data Storage, Encryption & Security */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">4</span>
                Data Storage, Security &amp; Token Encryption
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                We implement comprehensive administrative, technical, and physical safeguards to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#141416]/80">
                <li>
                  <strong>AES-256-GCM Encryption:</strong> OAuth access tokens and refresh tokens are encrypted at rest with industry-standard 256-bit AES-GCM encryption before being committed to our database. Encryption keys are stored separately in secure server environment variables.
                </li>
                <li>
                  <strong>Encrypted Transmission:</strong> All data in transit between your browser, our application servers, and third-party APIs is encrypted using Transport Layer Security (TLS 1.3 / HTTPS).
                </li>
                <li>
                  <strong>Secure Cloud Infrastructure:</strong> Database records are maintained in high-security PostgreSQL clusters hosted via Supabase, protected by Row-Level Security (RLS) policies ensuring users cannot access data across workspaces.
                </li>
                <li>
                  <strong>Payment Tokenization:</strong> All subscription transactions are processed by <strong>Bachs Payment Gateway</strong> (https://docs.bachs.io). BufferMate servers never receive or store your credit card numbers.
                </li>
              </ul>
            </article>

            {/* Section 5: TikTok Data Deletion Instructions (Mandatory Requirement) */}
            <article className="space-y-4" id="data-deletion">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">5</span>
                Data Deletion &amp; Account Disconnection (TikTok &amp; Social Accounts)
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                In compliance with TikTok Developer Verification standards and global privacy regulations (GDPR Article 17 and CCPA), you have the absolute right to disconnect social media accounts and delete your data at any time.
              </p>

              <div className="space-y-3 pt-2">
                {/* Method 1: Self-Serve In-App Disconnect */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#000000] flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    Method 1: Disconnect Inside BufferMate (Self-Serve)
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-[#141416]/80">
                    <li>Log in to your BufferMate workspace at <a href="https://buffermate.vercel.app/dashboard" className="text-[#00784D] underline">https://buffermate.vercel.app/dashboard</a>.</li>
                    <li>Navigate to <strong>Settings</strong> &rarr; <strong>Connected Accounts</strong>.</li>
                    <li>Locate your <strong>TikTok</strong> profile and click <strong>Disconnect</strong>.</li>
                  </ol>
                  <p className="text-xs text-zinc-500 pt-1">
                    <em>Result:</em> All active and refresh tokens for that TikTok account are instantly deleted from our database. Any pending scheduled videos for that channel are immediately canceled.
                  </p>
                </div>

                {/* Method 2: Revoke Directly Inside TikTok Mobile App */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#000000] flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#00784D]" />
                    Method 2: Revoke Access Directly Within TikTok
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-[#141416]/80">
                    <li>Open the TikTok app on your mobile device.</li>
                    <li>Tap your <strong>Profile</strong> icon at the bottom right.</li>
                    <li>Tap the <strong>Menu</strong> icon (three lines) at the top right &rarr; select <strong>Settings and Privacy</strong>.</li>
                    <li>Select <strong>Security &amp; Permissions</strong> &rarr; tap <strong>Manage App Permissions</strong>.</li>
                    <li>Select <strong>BufferMate</strong> and tap <strong>Remove Access</strong>.</li>
                  </ol>
                  <p className="text-xs text-zinc-500 pt-1">
                    <em>Result:</em> TikTok immediately revokes the OAuth token, preventing any further communication between BufferMate and your TikTok profile.
                  </p>
                </div>

                {/* Method 3: Complete Account & Data Deletion Request */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#000000] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#00784D]" />
                    Method 3: Full Workspace &amp; Personal Data Deletion Request
                  </h3>
                  <p className="text-xs sm:text-sm text-[#141416]/80 leading-relaxed">
                    To request permanent deletion of your BufferMate account and all associated personal data, email{' '}
                    <a href="mailto:privacy@buffermate.app" className="text-[#00784D] font-bold underline">
                      privacy@buffermate.app
                    </a>{' '}
                    with the subject line &ldquo;Data Deletion Request&rdquo; from your registered email address.
                  </p>
                  <p className="text-xs sm:text-sm text-[#141416]/80 leading-relaxed">
                    Upon receipt:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-xs sm:text-sm text-[#141416]/80">
                    <li>All stored OAuth tokens, account credentials, and profile identifiers are permanently erased within 48 hours.</li>
                    <li>All scheduled posts, media attachments, and drafted scripts are permanently deleted.</li>
                    <li>Your email and workspace records are fully purged within 30 days, except where retention is strictly required by accounting and tax regulations.</li>
                  </ul>
                </div>
              </div>
            </article>

            {/* Section 6: Data Retention Policy */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">6</span>
                Data Retention
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                We retain your information only as long as necessary to provide the services you requested:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base text-[#141416]/80">
                <li><strong>OAuth Tokens:</strong> Retained only while your social account remains actively connected. Deleted immediately upon disconnection.</li>
                <li><strong>Published Post Records &amp; Logs:</strong> Kept in your workspace history so you can review published posts and analytics. Deleted upon account closure.</li>
                <li><strong>Media Uploads:</strong> Media files scheduled for publication are retained for active dispatch, then automatically cleaned up from temporary delivery buffers.</li>
                <li><strong>Billing Invoices:</strong> Retained in tokenized format as required by law for accounting purposes.</li>
              </ul>
            </article>

            {/* Section 7: Third-Party Service Providers */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">7</span>
                Third-Party Service Providers
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                We work with reputable infrastructure partners to deliver BufferMate. Each partner is bound by confidentiality and data processing agreements:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base text-[#141416]/80">
                <li><strong>Supabase:</strong> Managed PostgreSQL database, authentication, and secure session management.</li>
                <li><strong>Vercel:</strong> Web frontend hosting and secure edge network distribution.</li>
                <li><strong>Bachs Payment Gateway:</strong> PCI-compliant tokenized payment processing.</li>
                <li><strong>Google Cloud (Gemini API):</strong> AI-assisted caption and script ideation.</li>
                <li><strong>TikTok Open API, Meta Graph API, X API, LinkedIn API:</strong> Authorized social publishing endpoints.</li>
              </ul>
            </article>

            {/* Section 8: Your Rights (GDPR & CCPA) */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">8</span>
                Your Privacy Rights (GDPR, CCPA &amp; Global Users)
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                Depending on your location, you hold specific statutory rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base text-[#141416]/80">
                <li><strong>Right to Access:</strong> You can request a copy of the personal information we hold about you.</li>
                <li><strong>Right to Rectification:</strong> You can update or correct inaccuracies in your account details via Profile Settings.</li>
                <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You can request complete deletion of your account and data.</li>
                <li><strong>Right to Restrict or Object:</strong> You can revoke OAuth permissions at any time.</li>
                <li><strong>Right to Data Portability:</strong> You can export your scheduled content and analytics logs.</li>
                <li><strong>Right to Non-Discrimination:</strong> We never discriminate or degrade service quality for exercising your privacy rights.</li>
              </ul>
            </article>

            {/* Section 9: Children's Privacy */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">9</span>
                Children&rsquo;s Privacy
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                BufferMate is a business and creator software platform intended for users who are at least 18 years old (or the legal age of majority in your jurisdiction). We do not knowingly collect personal information from children under the age of 13 (or under 16 where applicable). If we learn that personal data of a minor has been collected without verifiable parental consent, we will take immediate steps to delete that information.
              </p>
            </article>

            {/* Section 10: Contact Information & DPO */}
            <article className="space-y-4 pt-6 border-t border-zinc-200">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight">
                Privacy Officer &amp; Contact Information
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                If you have questions, comments, or data deletion requests regarding this Privacy Policy, please contact our Data Protection team:
              </p>
              <div className="p-5 rounded-2xl bg-[#E2E0D5]/50 border border-[#141416]/10 text-sm space-y-2">
                <p><strong>BufferMate Technologies Inc. — Data Protection Office</strong></p>
                <p>Website: <a href="https://buffermate.vercel.app" className="text-[#00784D] underline">https://buffermate.vercel.app</a></p>
                <p>Data Protection &amp; Privacy Email: <a href="mailto:privacy@buffermate.app" className="text-[#00784D] underline">privacy@buffermate.app</a></p>
                <p>TikTok Verification Inquiries: <a href="mailto:support@buffermate.app" className="text-[#00784D] underline">support@buffermate.app</a></p>
                <p>Physical Address: BufferMate AI Technologies, 100 Montgomery St, Suite 1500, San Francisco, CA 94104</p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

