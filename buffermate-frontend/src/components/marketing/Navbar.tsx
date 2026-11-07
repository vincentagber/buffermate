'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon } from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';

export default function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#E2E0D5]/95 backdrop-blur-md border-b border-[#141416]/15 shadow-xs'
          : 'bg-[#E2E0D5]/85 backdrop-blur-sm border-b border-[#141416]/10'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 h-[72px] flex items-center justify-between">
        {/* Buffermate Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          {/* Rounded Brand Squircle with inner ring */}
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00784D] to-[#07B979] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0 border border-[#00784D]/20">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-transparent" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[19px] text-[#000000] tracking-tight leading-tight">
              Buffermate
            </span>
            <span className="text-[10px] text-[#141416]/70 font-semibold tracking-tight">
              social media · automated
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-[15px] font-semibold text-[#141416]/80">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors hover:text-[#000000] ${
                  isActive ? 'text-[#000000] font-black underline underline-offset-4 decoration-[#00784D] decoration-2' : 'text-[#141416]/80'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="text-[14px] font-bold text-[#141416] hover:text-[#000000] transition-colors px-2 py-1"
          >
            Log In
          </Link>

          <AnimatedButton href="/signup" size="sm">
            Start Free
          </AnimatedButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded-full bg-[#00784D] hover:bg-[#07B979] text-white text-xs font-bold border border-[#07B979]/30 transition-colors"
          >
            Start Free
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#000000] rounded-lg hover:bg-[#141416]/10"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#E2E0D5] border-b border-[#141416]/20 px-5 pt-3 pb-6 space-y-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-[15px] font-semibold text-[#000000] hover:bg-[#141416]/10 rounded-xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#141416]/15 flex flex-col space-y-2">
            <Link
              href="/login"
              className="w-full py-2.5 text-center text-sm font-semibold text-[#000000] hover:bg-[#141416]/10 rounded-xl"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="w-full py-2.5 text-center text-sm font-bold bg-[#00784D] hover:bg-[#07B979] text-white rounded-full shadow-md border border-[#07B979]/40 transition-colors"
            >
              Start Free Workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
