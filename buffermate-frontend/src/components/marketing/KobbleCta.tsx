'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';

export default function KobbleCta() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Card 1: Growth / Self-Serve matching Kobble */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E7E4DC] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#141416] tracking-tight">
              Ready to scale <br />
              your social operations?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              Launch your first workspace today and connect up to 3 channels for free with automated peak-time scheduling.
            </p>
          </div>

          <div>
            <Link
              href="/signup"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#141416] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Start Free Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 2: Enterprise matching Kobble */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E7E4DC] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#141416] tracking-tight">
              Need an enterprise <br />
              solution?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              Custom multi-client workspaces, dedicated API limits, white-label client PDF analytics, and priority engineering support.
            </p>
          </div>

          <div>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#52832B] hover:bg-[#436e22] text-white text-xs sm:text-sm font-bold shadow-xs hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Contact Enterprise Sales</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

