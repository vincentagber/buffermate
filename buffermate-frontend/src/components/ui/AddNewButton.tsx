'use client';

import React from 'react';

export interface AddNewButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
  iconClassName?: string;
  label?: string;
  labelClassName?: string;
}

/**
 * AddNewButton — Premium interactive action button.
 * The button container remains firmly horizontal and never turns upside-down.
 * Guarantees crisp white text on black/dark backgrounds across normal, hover, and active states.
 */
export default function AddNewButton({
  title = 'Add New',
  size = 'md',
  className = '',
  iconClassName = '',
  label,
  labelClassName = '',
  onClick,
  type = 'button',
  disabled = false,
  ...rest
}: AddNewButtonProps) {
  // Dimension resolution
  let dimension = 20;
  if (typeof size === 'number') {
    dimension = size;
  } else if (size === 'sm') {
    dimension = 18;
  } else if (size === 'lg') {
    dimension = 24;
  }

  // Detect if button has a dark background or turns dark on hover/active
  const isDark =
    className.includes('#141416') ||
    className.includes('#161616') ||
    className.includes('bg-black') ||
    className.includes('bg-slate-900') ||
    className.includes('bg-slate-800') ||
    className.includes('bg-zinc-900') ||
    className.includes('bg-gray-900') ||
    className.includes('text-white');

  const willBeDarkOnHover =
    isDark ||
    className.includes('hover:bg-black') ||
    className.includes('hover:bg-slate-900') ||
    className.includes('hover:bg-[#141416]');

  const labelColorClass = isDark
    ? 'text-white group-hover:text-white group-active:text-white font-bold'
    : willBeDarkOnHover
    ? 'text-slate-700 group-hover:text-white group-active:text-white font-semibold'
    : 'text-slate-700 group-hover:text-slate-900 group-active:text-slate-950 font-semibold';

  const iconColorClass = isDark
    ? 'stroke-white group-hover:stroke-emerald-400 group-active:stroke-white'
    : willBeDarkOnHover
    ? 'stroke-zinc-500 group-hover:stroke-white group-active:stroke-white'
    : 'stroke-zinc-500 group-hover:stroke-zinc-900 group-active:stroke-zinc-950';

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`group cursor-pointer outline-hidden transition-all duration-200 inline-flex flex-row items-center justify-center whitespace-nowrap select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${dimension}px`}
        height={`${dimension}px`}
        viewBox="0 0 24 24"
        className={`fill-none group-hover:rotate-90 group-active:rotate-90 transition-transform duration-300 shrink-0 transform-gpu ${iconColorClass} ${iconClassName}`}
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          strokeWidth="1.5"
        />
        <path d="M8 12H16" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 16V8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {label && (
        <span
          className={`ml-1.5 text-xs transition-colors duration-200 ${labelColorClass} ${labelClassName}`}
        >
          {label}
        </span>
      )}
    </button>
  );
}
