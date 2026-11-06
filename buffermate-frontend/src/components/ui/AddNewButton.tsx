'use client';

import React from 'react';

export interface AddNewButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
  iconClassName?: string;
  label?: string;
}

/**
 * AddNewButton — From Uiverse.io by catraco
 * Smoothly rotates 90° on hover with dynamic stroke & fill transitions.
 */
export default function AddNewButton({
  title = 'Add New',
  size = 'md',
  className = '',
  iconClassName = '',
  label,
  onClick,
  type = 'button',
  disabled = false,
  ...rest
}: AddNewButtonProps) {
  // Dimension resolution
  let dimension = 38;
  if (typeof size === 'number') {
    dimension = size;
  } else if (size === 'sm') {
    dimension = 28;
  } else if (size === 'lg') {
    dimension = 50;
  }

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`group cursor-pointer outline-none hover:rotate-90 duration-300 inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${dimension}px`}
        height={`${dimension}px`}
        viewBox="0 0 24 24"
        className={`stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-hover:stroke-zinc-800 dark:group-hover:fill-zinc-200 dark:group-hover:stroke-zinc-200 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300 ${iconClassName}`}
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          strokeWidth="1.5"
        />
        <path d="M8 12H16" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 16V8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {label && (
        <span className="ml-2 text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
      )}
    </button>
  );
}
