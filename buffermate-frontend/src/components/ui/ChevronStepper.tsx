'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export type StepStatus = 'current' | 'completed' | 'upcoming' | 'disabled';

export interface ChevronStepItem {
  id: string | number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode; // alias for subtitle
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  badge?: React.ReactNode;
  badgeColor?: string;
  status?: StepStatus;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export type ChevronStepperVariant =
  | 'blue'     // Royal blue matching the modal reference screenshot
  | 'dark'     // Obsidian luxury (#0F172A / #161616)
  | 'brand'    // Indigo / Violet theme
  | 'emerald'  // Emerald success theme
  | 'purple'   // AI studio purple
  | 'slate';   // Subtle neutral slate

export type ChevronStepperSize = 'sm' | 'md' | 'lg';

export interface ChevronStepperProps {
  steps: ChevronStepItem[];
  currentStep?: string | number;
  activeId?: string | number;
  onChange?: (stepId: string | number, index: number) => void;
  variant?: ChevronStepperVariant;
  size?: ChevronStepperSize;
  className?: string;
  containerClassName?: string;
  itemClassName?: string;
  showNumbers?: boolean;
  showIcons?: boolean;
  clickable?: boolean;
  gap?: number; // Gap between chevrons in px (default 4)
  fullWidth?: boolean;
}

export default function ChevronStepper({
  steps,
  currentStep,
  activeId,
  onChange,
  variant = 'blue',
  size = 'md',
  className = '',
  containerClassName = '',
  itemClassName = '',
  showNumbers = true,
  showIcons = true,
  clickable = true,
  gap = 4,
  fullWidth = true,
}: ChevronStepperProps) {
  const activeStepIdentifier = currentStep ?? activeId;

  // Find active index
  let activeIndex = -1;
  if (activeStepIdentifier !== undefined) {
    activeIndex = steps.findIndex(
      (s, idx) => s.id === activeStepIdentifier || idx === activeStepIdentifier
    );
  }

  // Geometry dimensions based on size
  const config = {
    sm: {
      height: 'h-10 min-h-[40px]',
      cutWidth: 12,
      badgeSize: 'w-5 h-5 text-[11px]',
      titleClass: 'text-xs font-semibold',
      subClass: 'text-[10px] hidden sm:block',
      paddingFirst: 'pl-3.5 pr-4',
      paddingMiddle: 'pl-5 pr-4',
      paddingLast: 'pl-5 pr-3.5',
      paddingSingle: 'px-3.5',
      iconSize: 'w-3.5 h-3.5',
      checkSize: 'w-3 h-3 stroke-[3]',
    },
    md: {
      height: 'h-14 min-h-[56px]',
      cutWidth: 16,
      badgeSize: 'w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm',
      titleClass: 'text-xs sm:text-sm font-bold',
      subClass: 'text-[10px] sm:text-xs font-normal mt-0.5',
      paddingFirst: 'pl-4 sm:pl-5 pr-6 sm:pr-7',
      paddingMiddle: 'pl-6 sm:pl-8 pr-6 sm:pr-7',
      paddingLast: 'pl-6 sm:pl-8 pr-4 sm:pr-5',
      paddingSingle: 'px-5',
      iconSize: 'w-4 h-4',
      checkSize: 'w-3.5 h-3.5 stroke-[3]',
    },
    lg: {
      height: 'h-16 min-h-[64px]',
      cutWidth: 20,
      badgeSize: 'w-9 h-9 text-sm font-bold',
      titleClass: 'text-sm sm:text-base font-bold',
      subClass: 'text-xs font-normal mt-0.5',
      paddingFirst: 'pl-6 pr-9',
      paddingMiddle: 'pl-9 pr-9',
      paddingLast: 'pl-9 pr-6',
      paddingSingle: 'px-6',
      iconSize: 'w-5 h-5',
      checkSize: 'w-4 h-4 stroke-[3]',
    },
  }[size];

  const cutWidth = config.cutWidth;
  const negativeMargin = -(cutWidth - gap);

  // Variant color mappings
  const variantStyles = {
    blue: {
      activeBg: 'bg-[#1D4ED8]', // Exact Royal Blue matching reference screenshot
      activeText: 'text-white',
      activeSubText: 'text-blue-100/90',
      activeBadgeBg: 'bg-white text-[#1D4ED8] shadow-xs',
      completedBg: 'bg-blue-50/90 hover:bg-blue-100/80',
      completedText: 'text-blue-900',
      completedSubText: 'text-blue-600',
      completedBadgeBg: 'bg-emerald-600 text-white shadow-xs',
      upcomingBg: 'bg-[#F1F5F9] hover:bg-slate-200/70',
      upcomingText: 'text-slate-700',
      upcomingSubText: 'text-slate-400',
      upcomingBadgeBg: 'bg-white border border-slate-200/90 text-slate-500 shadow-2xs',
    },
    dark: {
      activeBg: 'bg-[#0F172A]',
      activeText: 'text-white',
      activeSubText: 'text-slate-300',
      activeBadgeBg: 'bg-white text-[#0F172A] shadow-xs',
      completedBg: 'bg-slate-100 hover:bg-slate-200/70',
      completedText: 'text-slate-900',
      completedSubText: 'text-slate-500',
      completedBadgeBg: 'bg-emerald-600 text-white shadow-xs',
      upcomingBg: 'bg-slate-50 hover:bg-slate-100',
      upcomingText: 'text-slate-600',
      upcomingSubText: 'text-slate-400',
      upcomingBadgeBg: 'bg-white border border-slate-200 text-slate-400',
    },
    brand: {
      activeBg: 'bg-[#4F46E5]',
      activeText: 'text-white',
      activeSubText: 'text-indigo-100',
      activeBadgeBg: 'bg-white text-[#4F46E5] shadow-xs',
      completedBg: 'bg-indigo-50 hover:bg-indigo-100/80',
      completedText: 'text-indigo-900',
      completedSubText: 'text-indigo-600',
      completedBadgeBg: 'bg-emerald-600 text-white shadow-xs',
      upcomingBg: 'bg-slate-100 hover:bg-slate-200/60',
      upcomingText: 'text-slate-700',
      upcomingSubText: 'text-slate-400',
      upcomingBadgeBg: 'bg-white border border-slate-200 text-slate-500',
    },
    emerald: {
      activeBg: 'bg-[#059669]',
      activeText: 'text-white',
      activeSubText: 'text-emerald-100',
      activeBadgeBg: 'bg-white text-[#059669] shadow-xs',
      completedBg: 'bg-emerald-50 hover:bg-emerald-100/80',
      completedText: 'text-emerald-900',
      completedSubText: 'text-emerald-600',
      completedBadgeBg: 'bg-emerald-600 text-white shadow-xs',
      upcomingBg: 'bg-slate-100 hover:bg-slate-200/60',
      upcomingText: 'text-slate-700',
      upcomingSubText: 'text-slate-400',
      upcomingBadgeBg: 'bg-white border border-slate-200 text-slate-500',
    },
    purple: {
      activeBg: 'bg-[#7C3AED]',
      activeText: 'text-white',
      activeSubText: 'text-purple-100',
      activeBadgeBg: 'bg-white text-[#7C3AED] shadow-xs',
      completedBg: 'bg-purple-50 hover:bg-purple-100/80',
      completedText: 'text-purple-900',
      completedSubText: 'text-purple-600',
      completedBadgeBg: 'bg-emerald-600 text-white shadow-xs',
      upcomingBg: 'bg-slate-100 hover:bg-slate-200/60',
      upcomingText: 'text-slate-700',
      upcomingSubText: 'text-slate-400',
      upcomingBadgeBg: 'bg-white border border-slate-200 text-slate-500',
    },
    slate: {
      activeBg: 'bg-slate-800',
      activeText: 'text-white',
      activeSubText: 'text-slate-300',
      activeBadgeBg: 'bg-white text-slate-800 shadow-xs',
      completedBg: 'bg-slate-100 hover:bg-slate-200/70',
      completedText: 'text-slate-800',
      completedSubText: 'text-slate-500',
      completedBadgeBg: 'bg-emerald-600 text-white shadow-xs',
      upcomingBg: 'bg-slate-50 hover:bg-slate-100',
      upcomingText: 'text-slate-600',
      upcomingSubText: 'text-slate-400',
      upcomingBadgeBg: 'bg-white border border-slate-200 text-slate-400',
    },
  }[variant];

  return (
    <nav
      aria-label="Progress Stepper"
      className={`relative w-full ${className}`}
    >
      <div
        className={`flex items-stretch overflow-x-auto no-scrollbar scroll-smooth rounded-2xl ${
          fullWidth ? 'w-full' : 'w-fit'
        } ${containerClassName}`}
      >
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          const isSingle = steps.length === 1;

          // Compute resolved status
          let status: StepStatus = step.status || 'upcoming';
          if (!step.status && activeIndex !== -1) {
            if (index < activeIndex) status = 'completed';
            else if (index === activeIndex) status = 'current';
            else status = 'upcoming';
          } else if (!step.status && step.id === activeStepIdentifier) {
            status = 'current';
          }

          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';
          const isDisabled = step.disabled || status === 'disabled';

          // Clip path polygon computation for pixel-perfect chevron arrows
          let clipPath = 'none';
          if (!isSingle) {
            if (isFirst) {
              clipPath = `polygon(0% 0%, calc(100% - ${cutWidth}px) 0%, 100% 50%, calc(100% - ${cutWidth}px) 100%, 0% 100%)`;
            } else if (isLast) {
              clipPath = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, ${cutWidth}px 50%)`;
            } else {
              clipPath = `polygon(0% 0%, calc(100% - ${cutWidth}px) 0%, 100% 50%, calc(100% - ${cutWidth}px) 100%, 0% 100%, ${cutWidth}px 50%)`;
            }
          }

          // Padding per position
          let paddingClass = config.paddingMiddle;
          if (isSingle) paddingClass = config.paddingSingle;
          else if (isFirst) paddingClass = config.paddingFirst;
          else if (isLast) paddingClass = config.paddingLast;

          // Theme styling based on status
          let bgClass = variantStyles.upcomingBg;
          let textClass = variantStyles.upcomingText;
          let subTextClass = variantStyles.upcomingSubText;
          let badgeBgClass = variantStyles.upcomingBadgeBg;

          if (isCurrent) {
            bgClass = variantStyles.activeBg;
            textClass = variantStyles.activeText;
            subTextClass = variantStyles.activeSubText;
            badgeBgClass = variantStyles.activeBadgeBg;
          } else if (isCompleted) {
            bgClass = variantStyles.completedBg;
            textClass = variantStyles.completedText;
            subTextClass = variantStyles.completedSubText;
            badgeBgClass = variantStyles.completedBadgeBg;
          }

          // Render icon or number
          const renderIndicator = () => {
            if (isCompleted) {
              return (
                <div
                  className={`${config.badgeSize} rounded-full ${badgeBgClass} flex items-center justify-center font-bold shrink-0 transition-transform`}
                >
                  <Check className={config.checkSize} />
                </div>
              );
            }

            if (showIcons && step.icon) {
              return (
                <div
                  className={`${config.badgeSize} rounded-full ${badgeBgClass} flex items-center justify-center shrink-0 transition-transform`}
                >
                  {React.isValidElement(step.icon)
                    ? step.icon
                    : React.createElement(step.icon as React.ComponentType<{ className?: string }>, {
                        className: config.iconSize,
                      })}
                </div>
              );
            }

            if (showNumbers) {
              return (
                <div
                  className={`${config.badgeSize} rounded-full ${badgeBgClass} flex items-center justify-center font-bold shrink-0 transition-transform`}
                >
                  {index + 1}
                </div>
              );
            }

            return null;
          };

          const subtitleContent = step.subtitle || step.description;

          const isItemClickable =
            clickable && !isDisabled && (Boolean(onChange) || Boolean(step.onClick) || Boolean(step.href));

          const handleClick = () => {
            if (isDisabled) return;
            if (step.onClick) step.onClick();
            if (onChange) onChange(step.id, index);
          };

          const innerContent = (
            <div
              className={`relative flex items-center gap-2.5 sm:gap-3.5 h-full w-full select-none ${paddingClass}`}
            >
              {renderIndicator()}

              <div className="flex flex-col min-w-0 justify-center text-left">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`${config.titleClass} ${textClass} leading-tight truncate`}
                  >
                    {step.title}
                  </span>

                  {step.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full leading-none shrink-0 ${
                        step.badgeColor ||
                        (isCurrent
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/80 text-slate-700')
                      }`}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>

                {subtitleContent && (
                  <span
                    className={`${config.subClass} ${subTextClass} leading-tight truncate`}
                  >
                    {subtitleContent}
                  </span>
                )}
              </div>
            </div>
          );

          const stepStyle: React.CSSProperties = {
            clipPath,
            WebkitClipPath: clipPath,
            marginLeft: !isFirst ? `${negativeMargin}px` : undefined,
            zIndex: isCurrent ? 10 : steps.length - index,
          };

          const sharedClasses = `relative group flex-1 ${config.height} flex items-center transition-all duration-200 ${bgClass} ${
            isItemClickable ? 'cursor-pointer hover:brightness-105 active:scale-[0.995]' : ''
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${
            isFirst ? 'rounded-l-2xl' : ''
          } ${isLast ? 'rounded-r-2xl' : ''} ${itemClassName}`;

          if (step.href && !isDisabled) {
            return (
              <Link
                key={step.id}
                href={step.href}
                onClick={handleClick}
                style={stepStyle}
                className={sharedClasses}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {innerContent}
              </Link>
            );
          }

          return (
            <div
              key={step.id}
              role={isItemClickable ? 'button' : undefined}
              tabIndex={isItemClickable ? 0 : undefined}
              onClick={isItemClickable ? handleClick : undefined}
              onKeyDown={(e) => {
                if (isItemClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleClick();
                }
              }}
              style={stepStyle}
              className={sharedClasses}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {innerContent}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
