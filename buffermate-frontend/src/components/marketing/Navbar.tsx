'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Moon, Sun } from 'lucide-react';

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
    { label: 'Pricing', href: '/pricing' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#F6F4EE]/95 backdrop-blur-md border-b border-[#E7E4DC] shadow-xs'
          : 'bg-[#F6F4EE] border-b border-[#EFECE5]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo matching Kobble layout */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            {/* Kobble-Style Rounded Green Squircle with inner ring */}
            <div className="w-9 h-9 rounded-2xl bg-[#52832B] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-transparent" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-[#141416] tracking-tight leading-tight">
                Buffermate
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight">
                social media · automated
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Clean links matching Kobble */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-[#141416] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              type="button"
              className="w-9 h-9 rounded-full hover:bg-[#EBE7DF] text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              <Moon className="w-4 h-4" />
            </button>

            <Link
              href="/login"
              className="text-sm font-semibold text-slate-800 hover:text-[#141416] transition-colors"
            >
              Log In
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-full bg-[#52832B] hover:bg-[#446F23] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md hover:scale-[1.02] cursor-pointer"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/signup"
              className="px-4 py-2 rounded-full bg-[#52832B] text-white text-xs font-bold"
            >
              Start Free
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-lg hover:bg-[#EAE6DD]"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F4EE] border-b border-[#E7E4DC] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-[#EAE6DD] rounded-xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#E7E4DC] flex flex-col space-y-2">
            <Link
              href="/login"
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 hover:bg-[#EAE6DD] rounded-xl"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
