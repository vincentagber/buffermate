'use client';

import React from 'react';
import Link from 'next/link';

export interface AnimatedButtonProps {
  children?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  variant?: 'greenyellow' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
  target?: string;
  rel?: string;
}

/**
 * AnimatedButton — Interactive animated button from Uiverse.io by gharsh11032000
 * Features sliding SVG directional arrows, expanding radial circle fill, and smooth text translation.
 */
export default function AnimatedButton({
  children = 'Modern Button',
  href,
  onClick,
  variant = 'greenyellow',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  title,
  target,
  rel,
}: AnimatedButtonProps) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = variant === 'brand' ? 'btn-brand' : '';
  const combinedClasses = `animated-button ${sizeClass} ${variantClass} ${className}`.trim();

  const innerContent = (
    <>
      <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <span className="text">{children}</span>
      <span className="circle" aria-hidden="true" />
      <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={combinedClasses}
        onClick={onClick}
        title={title}
        target={target}
        rel={rel}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {innerContent}
    </button>
  );
}
