import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles, Video, Image as ImageIcon, PenTool, Zap, PlayCircle, BarChart3, Layers } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Buffermate
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-10">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Log In</Link>
            <Link href="/login" className="btn-primary">
              Get Started Now
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-primary text-sm font-medium mb-8 animate-[fade-in_1s_ease-out]">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>The All-in-One AI Video Suite</span>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-slate-900 animate-[slide-up_0.8s_ease-out]">
              Grow your audience with <br />
              <span className="text-primary">automated video content.</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 animate-[slide-up_1s_ease-out_0.2s_both] leading-relaxed">
              Buffermate helps you generate scripts, produce videos, and schedule posts across all your social channels. Powered by the world's best AI models.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-[slide-up_1s_ease-out_0.4s_both]">
              <Link href="/login" className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-md text-lg font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center">
                Start Creating for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-md text-lg font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center">
                <PlayCircle className="mr-2 w-5 h-5" /> Watch Demo
              </Link>
            </div>

            {/* Dashboard Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto animate-[slide-up_1.2s_ease-out_0.6s_both]">
              <div className="rounded-xl bg-slate-900 p-2 shadow-2xl border border-slate-800">
                <div className="rounded-lg overflow-hidden bg-white aspect-[16/10] relative">
                  {/* Abstract UI Representation */}
                  <div className="absolute inset-0 bg-slate-50 flex">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-slate-200 bg-white p-6 hidden md:block text-left">
                      <div className="h-8 w-8 bg-primary rounded-md mb-8"></div>
                      <div className="space-y-4">
                        <div className="h-3 w-24 bg-slate-100 rounded"></div>
                        <div className="h-3 w-32 bg-slate-100 rounded"></div>
                        <div className="h-3 w-20 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 p-8">
                      <div className="flex justify-between items-center mb-8">
                        <div className="h-8 w-48 bg-slate-200 rounded"></div>
                        <div className="h-10 w-32 bg-primary rounded"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="h-32 bg-white border border-slate-200 rounded-lg shadow-sm"></div>
                        <div className="h-32 bg-white border border-slate-200 rounded-lg shadow-sm"></div>
                        <div className="h-32 bg-white border border-slate-200 rounded-lg shadow-sm"></div>
                      </div>
                      <div className="h-64 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="h-16 w-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Video className="w-8 h-8 text-primary" />
                          </div>
                          <div className="h-4 w-48 bg-slate-100 rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Trusted by content creators worldwide</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale">
              {/* Placeholders for logos */}
              <div className="h-8 w-32 bg-slate-300 rounded"></div>
              <div className="h-8 w-32 bg-slate-300 rounded"></div>
              <div className="h-8 w-32 bg-slate-300 rounded"></div>
              <div className="h-8 w-32 bg-slate-300 rounded"></div>
              <div className="h-8 w-32 bg-slate-300 rounded"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="font-heading text-4xl font-bold mb-6 text-slate-900">Everything you need to go viral</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A complete suite of tools designed to streamline your video production workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <PenTool className="w-6 h-6 text-primary" />,
                  title: "AI Scriptwriting",
                  description: "Generate engaging scripts tailored to your audience in seconds with OpenAI."
                },
                {
                  icon: <Video className="w-6 h-6 text-primary" />,
                  title: "Video Production",
                  description: "Turn text into high-quality video content automatically using XAI models."
                },
                {
                  icon: <ImageIcon className="w-6 h-6 text-primary" />,
                  title: "Auto-Thumbnails",
                  description: "Create click-worthy thumbnails for every video with MetaAI image generation."
                },
                {
                  icon: <Layers className="w-6 h-6 text-primary" />,
                  title: "Multi-Channel",
                  description: "Publish to YouTube, TikTok, Instagram, and more from a single dashboard."
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-primary" />,
                  title: "Analytics",
                  description: "Track performance across all platforms to understand what works best."
                },
                {
                  icon: <Zap className="w-6 h-6 text-primary" />,
                  title: "Smart Scheduling",
                  description: "Automatically post at the best times for maximum engagement."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-xl border border-slate-200 bg-white hover:shadow-lg transition-shadow duration-300 group">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

          <div className="max-w-4xl mx-auto px-4 text-center text-white relative z-10">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-8">Ready to start creating?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of creators who are saving time and growing faster with Buffermate.
            </p>
            <Link href="/login" className="inline-flex items-center bg-white text-primary px-10 py-5 rounded-md text-lg font-bold hover:bg-blue-50 transition-all shadow-xl">
              Get Started for Free <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
            <p className="mt-6 text-sm text-blue-200 font-medium">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-slate-900">Buffermate</span>
          </div>

          <div className="flex space-x-8 text-sm text-slate-600">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Support</Link>
          </div>

          <div className="text-center md:text-right mt-6 md:mt-0">
            <p className="text-sm text-slate-500">
              © 2025 Buffermate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
