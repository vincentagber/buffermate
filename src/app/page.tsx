'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  Calendar,
  Menu,
  X,
  Play,
  Sparkles,
  Shield,
  Globe
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight">Buffermate</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <Link href="/login" className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">Log in</Link>
            <Link href="/signup" className="btn-primary px-6 py-2.5 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-fade-in-up">
          <div className="flex flex-col space-y-6 text-center">
            <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-slate-900">Features</Link>
            <Link href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-slate-900">Pricing</Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-slate-900">Log in</Link>
            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary py-4 text-lg shadow-lg">
              Get Started for Free
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
                <Sparkles className="w-3 h-3 mr-2" />
                New: AI Video Generation
              </div>
              <h1 className="font-heading text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 animate-fade-in-up delay-100">
                Social Growth, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Automated.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
                Stop wasting time on manual posting. Buffermate uses advanced AI to create, schedule, and analyze your content across all platforms.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up delay-300">
                <Link href="/signup" className="w-full sm:w-auto btn-primary px-8 py-4 text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transition-all transform hover:-translate-y-1 flex items-center justify-center">
                  Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center group">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-blue-600 fill-current ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start space-x-6 text-slate-400 animate-fade-in-up delay-300">
                <span className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> No credit card required</span>
                <span className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> 14-day free trial</span>
              </div>
            </div>

            <div className="lg:w-1/2 animate-float">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-lg"></div>
                <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Placeholder for Hero Image */}
                  <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
                    {/* Mock UI Elements */}
                    <div className="absolute top-6 left-6 right-6 bottom-6 bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="h-2 w-20 bg-slate-100 rounded-full"></div>
                      </div>
                      <div className="flex-1 flex gap-4">
                        <div className="w-1/4 bg-slate-50 rounded-lg"></div>
                        <div className="flex-1 bg-slate-50 rounded-lg p-4 space-y-3">
                          <div className="h-32 bg-blue-50 rounded-lg w-full mb-4"></div>
                          <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -right-6 top-10 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-float delay-100 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Engagement</p>
                      <p className="text-lg font-bold text-slate-900">+124%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-6 bottom-10 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-float delay-200 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">AI Generated</p>
                      <p className="text-lg font-bold text-slate-900">24 Posts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Trusted by content creators from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos (Placeholders) */}
            <div className="text-xl font-bold text-slate-900">Google</div>
            <div className="text-xl font-bold text-slate-900">Spotify</div>
            <div className="text-xl font-bold text-slate-900">Airbnb</div>
            <div className="text-xl font-bold text-slate-900">Stripe</div>
            <div className="text-xl font-bold text-slate-900">Netflix</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to grow</h2>
            <p className="text-lg text-slate-600">Powerful tools to help you create, schedule, and analyze your social media content in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: AI Content Engine */}
            <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Content Engine</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Generate engaging posts, scripts, and even videos in seconds. Our AI understands your brand voice.
              </p>
              <div className="aspect-video bg-white rounded-lg border border-slate-200 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-slate-50 p-4 flex flex-col gap-3">
                  {/* Mock Chat Interface */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0"></div>
                    <div className="bg-white p-2 rounded-lg rounded-tl-none text-[10px] text-slate-400 shadow-sm border border-slate-100 w-3/4">
                      Write a post about our new coffee blend...
                    </div>
                  </div>
                  <div className="flex gap-2 flex-row-reverse">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex-shrink-0"></div>
                    <div className="bg-blue-600 p-2 rounded-lg rounded-tr-none text-[10px] text-white shadow-sm w-3/4">
                      Here's a draft: "Wake up to the rich aroma of our new Midnight Roast! ☕️ #CoffeeLover"
                    </div>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <div className="h-6 flex-1 bg-white border border-slate-200 rounded flex items-center px-2">
                      <div className="w-16 h-1 bg-slate-200 rounded"></div>
                    </div>
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Smart Scheduling */}
            <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-600/5 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Scheduling</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Queue up content for months. We automatically pick the best times to post for maximum engagement.
              </p>
              <div className="aspect-video bg-white rounded-lg border border-slate-200 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-slate-50 p-4">
                  {/* Mock Calendar */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="text-[8px] text-center text-slate-400">Day</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 h-24">
                    {[...Array(14)].map((_, i) => (
                      <div key={i} className={`rounded-sm ${i === 3 || i === 8 || i === 12 ? 'bg-purple-100 border border-purple-200 relative group/cal' : 'bg-white border border-slate-100'}`}>
                        {(i === 3 || i === 8 || i === 12) && (
                          <div className="absolute inset-0.5 bg-purple-500 rounded-[1px] opacity-20"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded shadow-sm border border-slate-100 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-[8px] font-bold text-slate-600">Best Time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Deep Analytics */}
            <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-600/5 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Deep Analytics</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Understand what works. Track follower growth, engagement rates, and ROI across all channels.
              </p>
              <div className="aspect-video bg-white rounded-lg border border-slate-200 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-slate-50 p-4 flex items-end justify-between gap-2">
                  {/* Mock Chart */}
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full bg-green-100 rounded-t-sm relative group/bar overflow-hidden" style={{ height: `${h}%` }}>
                      <div className="absolute bottom-0 left-0 right-0 top-0 bg-green-500 opacity-20 group-hover/bar:opacity-30 transition-opacity"></div>
                    </div>
                  ))}
                </div>
                {/* Floating Tooltip Mock */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg">
                  +124% Growth
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-blue-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">Ready to grow your audience?</h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of creators and businesses who use Buffermate to save time and increase engagement.
              </p>
              <Link href="/signup" className="inline-flex items-center bg-white text-blue-600 font-bold py-4 px-10 rounded-full shadow-xl hover:bg-blue-50 transition-colors transform hover:-translate-y-1">
                Get Started for Free <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">Buffermate</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              The all-in-one social media management platform for modern creators.
            </p>
            <div className="flex space-x-4">
              <Globe className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-white cursor-pointer transition-colors"></div>
              <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-white cursor-pointer transition-colors"></div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">AI Writer</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Buffermate Inc. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
