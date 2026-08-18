'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  color?: string;
}

export function Logo({ size = 28, className = '', color }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      role="img"
      style={color ? { color } : undefined}
    >
      {/* Top-left finder: complete square */}
      <rect x="4" y="4" width="20" height="20" rx="3" fill="currentColor" />
      <rect x="7.5" y="7.5" width="13" height="13" rx="1.5" fill="var(--color-bg, #FAF8F4)" />
      <rect x="10" y="10" width="8" height="8" rx="1" fill="currentColor" />

      {/* Top-right finder: complete square */}
      <rect x="40" y="4" width="20" height="20" rx="3" fill="currentColor" />
      <rect x="43.5" y="7.5" width="13" height="13" rx="1.5" fill="var(--color-bg, #FAF8F4)" />
      <rect x="46" y="10" width="8" height="8" rx="1" fill="currentColor" />

      {/* Bottom-left finder: broken into a Q */}
      <rect x="4" y="40" width="20" height="20" rx="3" fill="currentColor" />
      <rect x="7.5" y="43.5" width="13" height="13" rx="1.5" fill="var(--color-bg, #FAF8F4)" />
      {/* Q arc */}
      <path
        d="M11 51 a3 3 0 0 1 6 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Q tail - more refined angle */}
      <path d="M16.2 53.5 L19.5 57.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

      {/* Scattered data modules for visual texture */}
      <rect x="28" y="4" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.25" />
      <rect x="34" y="10" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.15" />
      <rect x="28" y="28" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.2" />
      <rect x="34" y="34" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.12" />
      <rect x="10" y="28" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.18" />
      <rect x="46" y="34" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.2" />
      <rect x="52" y="46" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.15" />
      <rect x="40" y="52" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.22" />
      <rect x="50" y="28" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.13" />
    </svg>
  );
}
