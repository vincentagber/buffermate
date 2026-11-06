'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { InstagramIcon, TikTokIcon, ThreadsIcon, XIcon } from '@/components/SocialIcons';

export default function MarketingFooter() {
  return (
    <footer className="bg-[#F6F4EE] border-t border-[#E7E4DC] font-sans text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-2xl bg-[#52832B] flex items-center justify-center shadow-xs shrink-0">
                <div className="w-3 h-3 rounded-full border-2 border-white bg-transparent" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-[#141416] tracking-tight leading-tight">
                  Buffermate
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  social media · automated
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              Autonomous social publishing, viral hook generation, and real-time comment lead funnels for modern creators and high-velocity marketing teams.
            </p>

            {/* Live Uptime Badge matching Kobble */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#E7E4DC] text-[11px] font-medium text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational (99.98% Uptime)</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2 text-slate-400">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#E7E4DC] bg-white flex items-center justify-center hover:text-slate-900 transition-colors"
                aria-label="X (Twitter)"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#E7E4DC] bg-white flex items-center justify-center hover:text-slate-900 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://threads.net"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#E7E4DC] bg-white flex items-center justify-center hover:text-slate-900 transition-colors"
                aria-label="Threads"
              >
                <ThreadsIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#E7E4DC] bg-white flex items-center justify-center hover:text-slate-900 transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#141416] uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="hover:text-[#141416] transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link href="/features#scheduler" className="hover:text-[#141416] transition-colors">
                  Visual Scheduler &amp; Calendar
                </Link>
              </li>
              <li>
                <Link href="/features#ai-studio" className="hover:text-[#141416] transition-colors">
                  Gemini Viral Script Studio
                </Link>
              </li>
              <li>
                <Link href="/features#auto-dm" className="hover:text-[#141416] transition-colors">
                  24/7 Comment Auto-DM Bots
                </Link>
              </li>
              <li>
                <Link href="/features#inbox" className="hover:text-[#141416] transition-colors">
                  Unified Social Inbox
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#141416] transition-colors font-bold text-[#52832B]">
                  Plans &amp; Pricing →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#141416] uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#141416] transition-colors">
                  About Buffermate
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#141416] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#141416] transition-colors">
                  Blog &amp; Playbooks
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#141416] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#141416] transition-colors">
                  Contact Support &amp; Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#141416] uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-[#141416] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#141416] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.bachs.io"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#141416] transition-colors inline-flex items-center gap-1"
                >
                  <span>Bachs Payment Security</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <span className="text-slate-400">
                  AES-256 OAuth Compliance
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#E7E4DC] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Buffermate AI Technologies Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AES-256 Token Encryption</span>
            </span>
            <span>·</span>
            <span className="text-slate-600">
              Payments secured via <strong className="text-slate-900">Bachs</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
