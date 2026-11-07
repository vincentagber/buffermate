import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Tailwind Heroicons Credit Card Icon (outline stroke style)
 * Official Tailwind Heroicons credit-card
 */
export function TailwindCreditCardIcon({ className = 'w-5 h-5', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
      />
    </svg>
  );
}

/**
 * FontAwesome Credit Card Icon (solid fill style)
 * Official FontAwesome 6 Free fa-credit-card
 */
export function FontAwesomeCreditCardIcon({ className = 'w-5 h-5', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm96 0h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H208c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
    </svg>
  );
}

/**
 * Google Fonts Material Symbols Payments / Hosted Gateway Icon
 */
export function GooglePaymentsIcon({ className = 'w-5 h-5', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </svg>
  );
}

/**
 * Tailwind Heroicons Document Chart / Analytics PDF Report Icon
 * Official Tailwind Heroicons document-chart-bar
 */
export function TailwindDocumentChartIcon({ className = 'w-6 h-6', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm-1.5 12.75h.008v.008H9.75v-.008Zm3-3h.008v.008h-.008v-.008Zm3-3h.008v.008h-.008v-.008Z"
      />
    </svg>
  );
}

/**
 * FontAwesome Chart Pie / Analytics Icon (solid)
 * Official FontAwesome fa-chart-pie
 */
export function FontAwesomeChartPieIcon({ className = 'w-6 h-6', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path d="M304 240V16.7c0-9 7-16.7 16-16.7 141.4 0 256 114.6 256 256 0 9-7.7 16-16.7 16H320c-8.8 0-16-7.2-16-16zm-48 32v223.3c0 9-7.7 16.7-16.7 16.7C105.8 512 0 406.2 0 274.7c0-9 7-16.7 16-16.7h224c8.8 0 16 7.2 16 16zm-16-64H16.7c-9 0-16.7-7-16.7-16C0 105.8 105.8 0 237.3 0c9 0 16.7 7.7 16.7 16.7V224c0 8.8-7.2 16-16 16z" />
    </svg>
  );
}

/**
 * Tailwind Heroicons Check Badge Icon
 * Official Tailwind Heroicons check-badge
 */
export function TailwindCheckBadgeIcon({ className = 'w-7 h-7', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    </svg>
  );
}

/**
 * Tailwind Heroicons Lock Closed / Token Encryption Icon
 * Official Tailwind Heroicons lock-closed
 */
export function TailwindLockClosedIcon({ className = 'w-7 h-7', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}

