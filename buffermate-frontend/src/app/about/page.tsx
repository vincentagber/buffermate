'use client';

import React from 'react';
import Link from 'next/link';
import {
  Zap,
  Layers,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Target
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import KobbleMarquee from '@/components/marketing/KobbleMarquee';
import MarketingFooter from '@/components/marketing/Footer';

export default function AboutPage() {
  const values = [
    {
      icon: <Zap className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-100',
      title: 'Built for Speed',
      description: 'From drafting a hook to multi-channel dispatch, every step is optimized for throughput. Scheduled content reaches active feeds at peak audience velocity without manual lag.',
    },
    {
      icon: <Layers className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-50 border-amber-100',
      title: 'Automation at Scale',
      description: 'Tap an autonomous publishing engine ready to manage 1 to 100+ social accounts. Scale your audience and inbound client funnels without hiring overhead or creator burnout.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      iconBg: 'bg-blue-50 border-blue-100',
      title: 'Transparent & Secure',
      description: 'Official developer APIs only. Zero password storage, AES-256 encrypted tokens, and strict anti-spam guardrails to protect your account health and brand reputation.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EE] font-sans text-slate-900 selection:bg-[#52832B]/20 selection:text-[#52832B]">
      <MarketingNavbar />

      <main className="overflow-hidden">
        {/* About Hero matching Kobble */}
        <section className="pt-12 sm:pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-[#E7E4DC] text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52832B]" />
            <span>ABOUT BUFFERMATE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#141416] leading-[1.08] max-w-4xl mx-auto">
            Social media intelligence, <br className="hidden sm:inline" />
            <span className="text-[#52832B]">delivered at scale.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Buffermate was built with a simple mission: give modern creators and agencies a transparent, fast, and reliable way to automate social content creation, schedule across every platform, and turn audience engagement into paying clients.
          </p>
        </section>

        {/* Story Section matching Kobble (2-columns) */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Story text */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141416] tracking-tight leading-tight">
                The Modern Creator <br />
                <span className="text-[#52832B]">Workflow, solved.</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                <p>
                  Managing a serious social presence used to mean juggling scattered spreadsheets, brittle Chrome extensions, manually reformating images for 6 different aspect ratios, and constantly checking feeds at late hours to hit peak posting windows.
                </p>
                <p>
                  We noticed a massive gap: high-growth brands and creators were getting thousands of comments on viral videos saying &ldquo;PRICE&rdquo; or &ldquo;LINK&rdquo;, but dropping 80% of those leads because manual DMs took 4 hours. By the time a human replied, the buyer was gone.
                </p>
                <p>
                  That&apos;s why we built Buffermate AI. We replaced the busywork with autonomous intelligence. From Google Gemini 2.0 hook formulation to automated multi-channel scheduling and sub-15s direct message funnels, we help you make every post count.
                </p>
              </div>
            </div>

            {/* Right Column: Tilted Photo Card matching Kobble */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80"
                  alt="Buffermate Team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values matching Kobble */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141416] tracking-tight text-center">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-7 border border-[#E7E4DC] shadow-xs space-y-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center ${v.iconBg}`}
                >
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-[#141416] tracking-tight">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Marquee matching Kobble */}
        <KobbleMarquee />

        {/* Dark Navy CTA Banner matching Kobble */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-[#0A0F1D] text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 shadow-2xl border border-slate-800">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to put your social media <br className="hidden sm:inline" />
              on autopilot?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Launch your workspace today and experience the speed of autonomous publishing.
            </p>
            <div>
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-[#52832B] hover:bg-[#436e22] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Start Free Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
