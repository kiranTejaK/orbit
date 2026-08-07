"use client";

import React from "react";

interface LogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textSize?: string;
}

export function OrbitIcon({ size = 32, className = "" }: { size?: number | string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="orbit-grad-core" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="orbit-grad-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
        </linearGradient>
        <filter id="orbit-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer elliptical orbit ring */}
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="8"
        transform="rotate(-28 24 24)"
        stroke="url(#orbit-grad-ring)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="90 20"
      />

      {/* Secondary accent ring */}
      <ellipse
        cx="24"
        cy="24"
        rx="21"
        ry="9"
        transform="rotate(35 24 24)"
        stroke="url(#orbit-grad-core)"
        strokeWidth="1.2"
        strokeOpacity="0.4"
        strokeDasharray="4 6"
      />

      {/* Central Planet Core */}
      <circle
        cx="24"
        cy="24"
        r="7.5"
        fill="url(#orbit-grad-core)"
        filter="url(#orbit-glow)"
      />

      {/* Orbiting Satellite Node */}
      <circle
        cx="37"
        cy="17"
        r="3"
        fill="#38bdf8"
      />
    </svg>
  );
}

export function OrbitLogo({ size = 32, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center flex-shrink-0">
        <OrbitIcon size={size} />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            Orbit
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 tracking-wider">
              PRO
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

export function OrbitLogoCompact({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <OrbitIcon size={size} />
      <span className="font-bold tracking-tight text-base text-slate-900 dark:text-slate-100">
        Orbit
      </span>
    </div>
  );
}
