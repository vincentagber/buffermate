import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  ExternalLink,
  Scale,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | BufferMate Social Media Automation',
  description:
    'Comprehensive Terms of Service for BufferMate users, detailing our social media publishing tools, TikTok and Meta OAuth integration, intellectual property, acceptable use, and subscription terms.',
  alternates: {
    canonical: 'https://buffermate.vercel.app/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
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
              <Scale className="w-3.5 h-3.5 text-[#07B979]" />
              <span>Legal &amp; Compliance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-hero-sans font-normal tracking-[-0.04em] text-[#000000] leading-tight">
              Terms of{' '}
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
                Service
              </span>
            </h1>

            <p className="font-hero-sans text-base sm:text-lg text-[#141416]/75 max-w-2xl mx-auto leading-relaxed">
              These Terms of Service outline the legal agreement between you and BufferMate regarding the use of our multi-platform social media scheduling, automation, AI content assistance, and inbox management services.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#141416]/70 pt-2">
              <span>Effective Date: <strong>{effectiveDate}</strong></span>
              <span>•</span>
              <span>Last Updated: <strong>{lastUpdated}</strong></span>
              <span>•</span>
              <span>Version: <strong>2.4.0</strong></span>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="max-w-4xl mx-auto px-5 md:px-8 py-12 sm:py-16">
          <div className="bg-white rounded-[28px] border border-[#141416]/15 shadow-xl p-6 sm:p-12 space-y-12 text-[#141416] leading-relaxed">
            {/* Quick Summary Callout */}
            <div className="p-6 rounded-2xl bg-[#141416] text-white space-y-3">
              <div className="flex items-center space-x-2 text-[#07B979] font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Executive Summary</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                BufferMate connects to third-party social media platforms (including TikTok, Instagram, Facebook, X, LinkedIn, and Threads) exclusively through authorized OAuth 2.0 developer APIs. We never ask for or store your social network passwords. You own your content. You are responsible for ensuring that the content you schedule or publish complies with platform policies and applicable law.
              </p>
            </div>

            {/* Section 1: Acceptance of Terms */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">1</span>
                Acceptance of Terms
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                By accessing or using the website located at{' '}
                <a href="https://buffermate.vercel.app" className="text-[#00784D] font-semibold underline underline-offset-2">
                  https://buffermate.vercel.app
                </a>{' '}
                (&ldquo;BufferMate&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), or by registering for an account, you agree to be bound by these Terms of Service and our{' '}
                <Link href="/privacy" className="text-[#00784D] font-semibold underline underline-offset-2">
                  Privacy Policy
                </Link>
                . If you are using BufferMate on behalf of an organization or company, you represent and warrant that you have full legal authority to bind that entity to these terms.
              </p>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                If you do not agree to all provisions of these Terms, you must not access or use BufferMate.
              </p>
            </article>

            {/* Section 2: Description of BufferMate Services */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">2</span>
                Description of the Service
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                BufferMate provides a cloud-based software-as-a-service (SaaS) platform for social media publishing, scheduling, inbox management, and analytics. Primary capabilities include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#141416]/80">
                <li>
                  <strong>Multi-Channel Publishing &amp; Scheduling:</strong> Composing, formatting, scheduling, and automatically publishing social posts, short-form videos, and image assets across supported social media networks.
                </li>
                <li>
                  <strong>Visual Calendar &amp; Content Queue:</strong> Organizing, previewing, reordering, and maintaining publication queues across individual or multiple client accounts.
                </li>
                <li>
                  <strong>Unified Social Inbox:</strong> Monitoring and responding to inbound social comments, mentions, and customer engagement across connected profiles.
                </li>
                <li>
                  <strong>AI Content Assistance:</strong> Drafting hooks, captions, video scripts, and post ideas using integrated artificial intelligence models (Google Gemini API).
                </li>
                <li>
                  <strong>Audience Analytics &amp; Reporting:</strong> Aggregating public post metrics (impressions, reach, likes, comments, shares) to surface optimal posting times and engagement performance.
                </li>
              </ul>
            </article>

            {/* Section 3: Third-Party Social Media Integrations & TikTok Developer Terms */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">3</span>
                Third-Party Social Media Platforms &amp; Developer APIs
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                BufferMate operates by interfacing with third-party social media platforms through their official developer APIs. When connecting an account, you must authorize BufferMate via the official OAuth 2.0 flow of each respective platform.
              </p>

              {/* Specific TikTok Section */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h3 className="font-bold text-base text-[#000000] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#07B979]" />
                  TikTok Open API &amp; Content Posting Terms
                </h3>
                <p className="text-sm text-[#141416]/80 leading-relaxed">
                  When you connect a TikTok account to BufferMate:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#141416]/80">
                  <li>
                    BufferMate requests the official TikTok OAuth scopes: <code>user.info.basic</code> (to display your TikTok handle, display name, and avatar in your workspace) and <code>video.publish</code> or <code>video.upload</code> (to upload, process, and publish video content directly to your TikTok profile per your scheduled instructions).
                  </li>
                  <li>
                    You agree to comply with the{' '}
                    <a
                      href="https://www.tiktok.com/legal/page/row/terms-of-service/en"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#00784D] font-semibold underline inline-flex items-center gap-0.5"
                    >
                      TikTok Terms of Service <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://www.tiktok.com/community-guidelines/en"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#00784D] font-semibold underline inline-flex items-center gap-0.5"
                    >
                      TikTok Community Guidelines <ExternalLink className="w-3 h-3" />
                    </a>.
                  </li>
                  <li>
                    BufferMate strictly validates video specifications required by TikTok (including resolution, duration, aspect ratio, and video formats). Videos that fail TikTok validation cannot be dispatched.
                  </li>
                  <li>
                    You can disconnect your TikTok integration at any time from BufferMate or directly from your TikTok application permissions settings.
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h3 className="font-bold text-base text-[#000000] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#07B979]" />
                  Other Supported Platforms
                </h3>
                <p className="text-sm text-[#141416]/80 leading-relaxed">
                  Your use of BufferMate to publish to other networks is also subject to their respective policies:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#141416]/80">
                  <li>Meta Platforms (Instagram Graph API, Facebook Pages API, Threads API) Terms of Service.</li>
                  <li>X (formerly Twitter) Developer Agreement and Developer Policy.</li>
                  <li>LinkedIn Marketing Developer Platform Terms and API Use Guidelines.</li>
                </ul>
              </div>
            </article>

            {/* Section 4: Account Registration & Security */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">4</span>
                Account Registration, Passwords &amp; Security
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                To access BufferMate features, you must create a workspace account using a valid email address and secure password (authenticated through Supabase Auth). You are responsible for maintaining the confidentiality of your login credentials and for all activities that take place under your account.
              </p>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                You must notify us immediately at <code>support@buffermate.app</code> upon becoming aware of any unauthorized use of your account or any other breach of security. BufferMate cannot and will not be liable for any loss or damage arising from your failure to protect your login credentials.
              </p>
            </article>

            {/* Section 5: User Content & Intellectual Property */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">5</span>
                User Content, Ownership &amp; License
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                <strong>You retain 100% ownership</strong> of all text, scripts, photos, videos, audio, graphics, and other media assets (&ldquo;User Content&rdquo;) that you upload, compose, or publish through BufferMate. BufferMate claims no intellectual property rights over your content.
              </p>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                By uploading or submitting User Content to BufferMate, you grant us a worldwide, non-exclusive, royalty-free license solely to host, cache, transmit, resize, format, and deliver that content to your selected third-party social networks strictly as needed to perform the publishing services you request.
              </p>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base text-[#141416]/80">
                <li>You have all necessary rights, licenses, and permissions to upload and distribute your User Content.</li>
                <li>Your User Content does not infringe upon the copyrights, trademarks, privacy, publicity, or other rights of any person or entity.</li>
                <li>Your User Content is not unlawful, defamatory, obscene, fraudulent, harmful to minors, or in violation of platform community standards.</li>
              </ul>
            </article>

            {/* Section 6: Prohibited Uses */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">6</span>
                Acceptable Use &amp; Prohibited Conduct
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                You agree not to use BufferMate to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#141416]/80">
                <li>Send unsolicited bulk communications, spam, repetitive unauthorized commercial messages, or phishing links.</li>
                <li>Engage in artificial engagement inflation, coordinated bot manipulation, fake follower/comment campaigns, or actions intended to deceive social media algorithms in violation of platform developer policies.</li>
                <li>Attempt to probe, scan, or test the vulnerability of BufferMate systems or breach security or authentication barriers.</li>
                <li>Reverse-engineer, decompile, disassemble, or derive the source code of BufferMate software.</li>
                <li>Abuse API rate limits or intentionally overload social media network gateways.</li>
                <li>Violate any applicable federal, state, local, or international law or regulation.</li>
              </ul>
              <p className="text-sm text-[#141416]/80 leading-relaxed">
                We reserve the right to suspend or terminate accounts that engage in prohibited activities without prior notice or refund.
              </p>
            </article>

            {/* Section 7: Subscriptions, Payments & Bachs Billing */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">7</span>
                Subscriptions, Fees &amp; Payment Processing
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                BufferMate offers free starter workspaces as well as paid monthly and annual recurring subscriptions (e.g., Pro and Agency plans). All subscription fees are billed in advance.
              </p>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                Payments are processed through <strong>Bachs Payment Gateway</strong> (https://docs.bachs.io). BufferMate does not process, store, or receive raw payment card numbers. All payment data is handled under Bachs secure tokenized checkout infrastructure.
              </p>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                You may cancel your subscription at any time through your BufferMate billing dashboard. Upon cancellation, your subscription remains active until the end of your current billing period, after which your account reverts to standard free tier limits.
              </p>
            </article>

            {/* Section 8: Termination & Account Deletion */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">8</span>
                Termination &amp; Account Deletion
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                You may terminate your account at any time by requesting deletion in Workspace Settings or by emailing <code>support@buffermate.app</code>. Upon termination, all your stored OAuth tokens (including TikTok, Meta, and X tokens) will be permanently purged and your scheduled queues halted.
              </p>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                BufferMate may terminate or suspend your access immediately, without prior notice, if you breach these Terms of Service or if requested by third-party social media platform authorities.
              </p>
            </article>

            {/* Section 9: Disclaimer of Warranties */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">9</span>
                Disclaimer of Warranties
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                BufferMate is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                We do not warrant that our service will be uninterrupted, error-free, secure, or free of bugs. Because social media platforms frequently update their developer APIs, rate limits, and authentication protocols, temporary interruptions or delays in third-party publishing may occasionally occur beyond our reasonable control.
              </p>
            </article>

            {/* Section 10: Limitation of Liability */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">10</span>
                Limitation of Liability
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                To the maximum extent permitted by applicable law, in no event shall BufferMate, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base text-[#141416]/80">
                <li>Your access to or inability to access or use the Service;</li>
                <li>Any conduct or content of any third party or social media platform;</li>
                <li>Any content obtained from the Service; or</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                Our total aggregate liability under these terms shall not exceed the amount actually paid by you to BufferMate during the six (6) months prior to the event giving rise to liability.
              </p>
            </article>

            {/* Section 11: Changes to Terms */}
            <article className="space-y-4">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight flex items-center gap-2">
                <span className="text-sm font-mono text-white bg-[#00784D] w-6 h-6 rounded-full inline-flex items-center justify-center">11</span>
                Modifications to Terms
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                We reserve the right to revise or update these Terms of Service at any time. If a revision is material, we will provide at least 30 days notice before new terms take effect by updating the &ldquo;Last Updated&rdquo; date on this page and notifying you via email or a prominent notification within the BufferMate dashboard.
              </p>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                By continuing to access or use BufferMate after revisions become effective, you agree to be bound by the updated terms.
              </p>
            </article>

            {/* Section 12: Contact Information */}
            <article className="space-y-4 pt-6 border-t border-zinc-200">
              <h2 className="text-2xl font-bold font-hero-sans text-[#000000] tracking-tight">
                Contact Information
              </h2>
              <p className="text-sm sm:text-base text-[#141416]/80 leading-relaxed">
                If you have questions, concerns, or legal inquiries regarding these Terms of Service, please contact us:
              </p>
              <div className="p-5 rounded-2xl bg-[#E2E0D5]/50 border border-[#141416]/10 text-sm space-y-2">
                <p><strong>BufferMate Technologies Inc.</strong></p>
                <p>Website: <a href="https://buffermate.vercel.app" className="text-[#00784D] underline">https://buffermate.vercel.app</a></p>
                <p>Legal &amp; Terms Inquiries: <a href="mailto:legal@buffermate.app" className="text-[#00784D] underline">legal@buffermate.app</a></p>
                <p>Customer Support: <a href="mailto:support@buffermate.app" className="text-[#00784D] underline">support@buffermate.app</a></p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
