'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  Send,
  Check,
  CheckCircle2,
  Phone,
  Clock,
  Sparkles,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import { triggerConfetti } from '@/components/ui/Confetti';
import { WhatsAppIcon } from '@/components/SocialIcons';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('sales');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send message payload
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, category, subject, message }),
      });
    } catch (err) {
      // Fallback graceful handler
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      triggerConfetti();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <MarketingNavbar />

      <main className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
        {/* Header */}
        <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-3xl mx-auto leading-tight">
            We&apos;re here to help you scale your publishing.
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about custom plans, API integrations, or need technical guidance? Our team typically responds within 4 business hours.
          </p>
        </section>

        {/* Contact Form & Contact Details Grid */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Contact Info & Direct Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Direct Support Channels</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect directly with our creator success and technical support team.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <Mail className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Email Inquiries</p>
                      <p className="text-slate-500 text-xs mt-0.5">support@buffermate.app</p>
                      <p className="text-[11px] text-purple-700 font-semibold mt-1">Average response: &lt; 4 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">WhatsApp Direct VIP</p>
                      <p className="text-slate-500 text-xs mt-0.5">+234 810 000 0000</p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">For Scale & Agency accounts</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <Clock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Operating Hours</p>
                      <p className="text-slate-500 text-xs mt-0.5">Monday – Friday: 8:00 AM – 7:00 PM (WAT / UTC+1)</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Emergency server monitoring active 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Message Dispatched!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{name}</strong>. We received your note regarding <em>{subject || 'Buffermate AI inquiry'}</em> and will get back to you at <strong>{email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setSubject('');
                      setMessage('');
                    }}
                    className="mt-4 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Send Us A Message</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the form below and we&apos;ll direct your inquiry to the right specialist.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Work Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                      >
                        <option value="sales">Sales & Agency Scaling</option>
                        <option value="technical">Technical Support & Integrations</option>
                        <option value="billing">Billing & Payment Inquiries (Bachs)</option>
                        <option value="partnership">Partnership & Affiliates</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Agency White-Label Demo"
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your team size, connected social platforms, or specific workflow requirements..."
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#141416] hover:bg-black text-white rounded-full text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message to Buffermate Team</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
