'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon } from 'lucide-react';

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
          ? 'bg-[#F5F4F0]/90 backdrop-blur-md border-b border-[#E2E0D5] shadow-xs'
          : 'bg-[#F5F4F0]/80 backdrop-blur-sm border-b border-[#E2E0D5]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 h-[72px] flex items-center justify-between">
        {/* Buffermate Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          {/* Rounded Green Squircle with inner ring */}
          <div className="w-9 h-9 rounded-2xl bg-[#6F9C3E] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-transparent" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[19px] text-[#1A202C] tracking-tight leading-tight">
              Buffermate
            </span>
            <span className="text-[10px] text-[#6B6B60] font-semibold tracking-tight">
              social media · automated
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-[15px] font-semibold text-[#4A5568]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors hover:text-[#1A202C] ${
                  isActive ? 'text-[#6F9C3E]' : 'text-[#4A5568]'
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
            className="text-[14px] font-bold text-[#1A202C] hover:text-[#6F9C3E] transition-colors px-2 py-1"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-full bg-[#1A202C] hover:bg-[#2D3748] text-white text-[14px] font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded-full bg-[#1A202C] text-white text-xs font-bold"
          >
            Start Free
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1A202C] rounded-lg hover:bg-[#EAE6DD]"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F5F4F0] border-b border-[#E2E0D5] px-5 pt-3 pb-6 space-y-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-[15px] font-semibold text-[#1A202C] hover:bg-[#EAE6DD] rounded-xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#E2E0D5] flex flex-col space-y-2">
            <Link
              href="/login"
              className="w-full py-2.5 text-center text-sm font-semibold text-[#1A202C] hover:bg-[#EAE6DD] rounded-xl"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="w-full py-2.5 text-center text-sm font-bold bg-[#6F9C3E] text-white rounded-full shadow-md"
            >
              Start Free Workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
