import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles, Video, Image as ImageIcon, PenTool, Zap, PlayCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/30">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Buffermate
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-10">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
            <Link href="/login" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-36 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 mix-blend-screen animate-pulse" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8 animate-[fade-in_1s_ease-out] backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>The Future of Automated Video Creation</span>
            </div>

            <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight animate-[slide-up_0.8s_ease-out]">
              From Script to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-600">Viral Video</span>
              <span className="text-foreground"> in Seconds.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-[slide-up_1s_ease-out_0.2s_both] leading-relaxed">
              Leverage the power of <strong>OpenAI</strong>, <strong>XAI</strong>, and <strong>MetaAI</strong> to automate your entire video production workflow.
              Generate scripts, produce videos, create thumbnails, and auto-post—all in one seamless platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-[slide-up_1s_ease-out_0.4s_both]">
              <Link href="/login" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 flex items-center justify-center group">
                Start Creating for Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#demo" className="w-full sm:w-auto px-10 py-5 rounded-full text-lg font-bold border border-input hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center backdrop-blur-sm">
                <PlayCircle className="mr-2 w-5 h-5" /> Watch Demo
              </Link>
            </div>

            {/* Abstract UI Mockup */}
            <div className="mt-24 relative max-w-6xl mx-auto animate-[slide-up_1.2s_ease-out_0.6s_both] perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-600 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative glass-card rounded-2xl border border-white/10 p-2 md:p-4 shadow-2xl bg-black/40 backdrop-blur-xl transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out">
                <div className="aspect-[21/9] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden flex items-center justify-center border border-white/5 relative">
                  {/* Abstract UI Elements */}
                  <div className="absolute inset-0 flex">
                    <div className="w-64 border-r border-white/10 p-6 hidden md:block">
                      <div className="h-8 w-32 bg-white/10 rounded mb-8"></div>
                      <div className="space-y-4">
                        <div className="h-4 w-full bg-white/5 rounded"></div>
                        <div className="h-4 w-3/4 bg-white/5 rounded"></div>
                        <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1 p-8 flex flex-col">
                      <div className="flex justify-between mb-8">
                        <div className="h-10 w-48 bg-white/10 rounded"></div>
                        <div className="h-10 w-32 bg-primary/20 rounded border border-primary/30"></div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <PlayCircle className="w-20 h-20 text-white/20 group-hover:text-white transition-colors duration-300 scale-90 group-hover:scale-100 transform" />
                      </div>
                      <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-gradient-to-r from-primary to-purple-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-secondary/30 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">End-to-End Video Automation</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A complete suite of AI tools working in harmony to produce studio-quality content without the studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: <PenTool className="w-10 h-10 text-purple-500" />,
                  title: "Intelligent Scripting",
                  description: "Powered by OpenAI. Generate engaging, viral-ready scripts tailored to your niche and audience tone automatically."
                },
                {
                  icon: <Video className="w-10 h-10 text-primary" />,
                  title: "AI Video Production",
                  description: "Powered by XAI. Transform text scripts into high-definition videos with realistic avatars, voiceovers, and dynamic scenes."
                },
                {
                  icon: <ImageIcon className="w-10 h-10 text-blue-500" />,
                  title: "Visual Enhancement",
                  description: "Powered by MetaAI. Automatically generate stunning thumbnails and supplementary visuals to boost click-through rates."
                },
                {
                  icon: <Zap className="w-10 h-10 text-yellow-500" />,
                  title: "Auto-Posting",
                  description: "Schedule once, publish everywhere. Our smart scheduler posts your videos at peak engagement times."
                },
                {
                  icon: <Sparkles className="w-10 h-10 text-pink-500" />,
                  title: "Style Customization",
                  description: "Define your brand's visual identity. Control tone, color palettes, and editing styles for consistent branding."
                },
                {
                  icon: <CheckCircle className="w-10 h-10 text-green-500" />,
                  title: "Performance Analytics",
                  description: "Track views, engagement, and growth across all platforms from a single, unified dashboard."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-background p-10 rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-2 group">
                  <div className="mb-8 p-4 bg-secondary rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  From Idea to Published <br />
                  <span className="text-primary">In Four Simple Steps</span>
                </h2>
                <div className="space-y-12">
                  {[
                    { title: "Input Your Topic", desc: "Simply tell Buffermate what you want to create a video about." },
                    { title: "AI Generation", desc: "Our multi-model engine writes the script, creates visuals, and renders the video." },
                    { title: "Review & Customize", desc: "Watch the preview, tweak the style, or regenerate specific parts instantly." },
                    { title: "Auto-Publish", desc: "The system automatically posts your video to X, LinkedIn, and Facebook." }
                  ].map((step, i) => (
                    <div key={i} className="flex space-x-6 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                        <p className="text-muted-foreground text-lg">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-10 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-background border border-border rounded-3xl p-8 shadow-2xl aspect-square flex items-center justify-center">
                  {/* Visual Abstract of the Workflow */}
                  <div className="grid grid-cols-2 gap-4 w-full h-full">
                    <div className="bg-secondary/50 rounded-2xl p-6 flex flex-col justify-between animate-[fade-in_1s_ease-out_0.2s_both]">
                      <PenTool className="w-8 h-8 text-purple-500" />
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-foreground/10 rounded"></div>
                        <div className="h-2 w-3/4 bg-foreground/10 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-secondary/50 rounded-2xl p-6 flex flex-col justify-between animate-[fade-in_1s_ease-out_0.4s_both]">
                      <ImageIcon className="w-8 h-8 text-blue-500" />
                      <div className="h-20 w-full bg-foreground/5 rounded border border-foreground/5"></div>
                    </div>
                    <div className="bg-secondary/50 rounded-2xl p-6 flex flex-col justify-between animate-[fade-in_1s_ease-out_0.6s_both]">
                      <Video className="w-8 h-8 text-primary" />
                      <div className="h-20 w-full bg-foreground/5 rounded border border-foreground/5 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-foreground/20 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-foreground border-b-[4px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary/10 rounded-2xl p-6 flex flex-col justify-between border border-primary/20 animate-[fade-in_1s_ease-out_0.8s_both]">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <div className="text-center">
                        <span className="text-sm font-bold text-primary">Published!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary -z-10"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10 mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>

          <div className="max-w-5xl mx-auto px-4 text-center text-white relative z-10">
            <h2 className="font-heading text-5xl md:text-7xl font-bold mb-8 tracking-tight">Ready to revolutionize your content?</h2>
            <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
              Join the new era of content creation. Automated, intelligent, and incredibly powerful.
            </p>
            <Link href="/login" className="inline-flex items-center bg-white text-primary px-12 py-6 rounded-full text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/25 hover:-translate-y-1">
              Get Started for Free <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80 font-medium">
              <div className="flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> No credit card required</div>
              <div className="flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> 14-day free trial</div>
              <div className="flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Cancel anytime</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl">Buffermate</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © 2025 Buffermate. All rights reserved. | Developed by{' '}
              <a
                className="text-decoration-none fw-semibold font-medium text-primary hover:underline transition-all"
                href="https://vincentagber.vercel.app/"
                target="_blank"
                rel="noopener"
              >
                Vincent Agber
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
