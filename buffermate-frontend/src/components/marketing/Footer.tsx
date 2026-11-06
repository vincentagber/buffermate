'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Heart,
  Globe,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { BufferMateLogo } from '@/app/dashboard/components/Sidebar';
import { InstagramIcon, TikTokIcon, FacebookIcon, ThreadsIcon, XIcon, WhatsAppIcon } from '@/components/SocialIcons';

export default function MarketingFooter() {
  return (
    <footer className="bg-white border-t border-slate-200/80 font-sans text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <BufferMateLogo className="w-8 h-8" />
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                  buffermate
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-[#161616] text-white rounded-md tracking-wider">
                  AI
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              Autonomous social publishing, viral hook generation, and real-time comment lead funnels for modern creators and high-velocity marketing teams.
            </p>

            {/* Live Uptime / Platform Status Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational (99.98% Uptime)</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2 text-slate-400">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-900 hover:border-slate-300 transition-colors"
                aria-label="X (Twitter)"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-900 hover:border-slate-300 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://threads.net"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-900 hover:border-slate-300 transition-colors"
                aria-label="Threads"
              >
                <ThreadsIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-900 hover:border-slate-300 transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="hover:text-slate-900 transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link href="/features#scheduler" className="hover:text-slate-900 transition-colors">
                  Visual Scheduler & Calendar
                </Link>
              </li>
              <li>
                <Link href="/features#ai-studio" className="hover:text-slate-900 transition-colors">
                  Gemini & GPT-4 Hook Studio
                </Link>
              </li>
              <li>
                <Link href="/features#auto-dm" className="hover:text-slate-900 transition-colors">
                  24/7 Comment Auto-DM Bots
                </Link>
              </li>
              <li>
                <Link href="/features#inbox" className="hover:text-slate-900 transition-colors">
                  Unified Social Inbox
                </Link>
              </li>
              <li>
                <Link href="/features#analytics" className="hover:text-slate-900 transition-colors">
                  Audience Intelligence
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-slate-900 transition-colors font-semibold text-purple-700">
                  Plans & Pricing →
                </Link>
              </li>
            </ul>
          </div>

          {/* Integrations Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Integrations
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/integrations" className="hover:text-slate-900 transition-colors">
                  Instagram Professional
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-slate-900 transition-colors">
                  TikTok Creator & Business
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-slate-900 transition-colors">
                  Meta Threads API
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-slate-900 transition-colors">
                  Facebook Pages
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-slate-900 transition-colors">
                  X / Twitter API v2
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-slate-900 transition-colors">
                  WhatsApp Direct Gateway
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.bachs.io"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span>Bachs Payment Gateway</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Support Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-slate-900 transition-colors">
                  About BufferMate
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-slate-900 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-slate-900 transition-colors">
                  Blog & Playbooks
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-slate-900 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 transition-colors">
                  Contact Support & Sales
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.bachs.io"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span>Developer API Docs</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 BufferMate AI Technologies Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AES-256 Token Encryption</span>
            </span>
            <span>·</span>
            <span className="text-slate-500">
              Payments powered by <strong className="text-slate-700">Bachs</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

