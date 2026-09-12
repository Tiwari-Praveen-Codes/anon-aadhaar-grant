'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  pageTitle?: string;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle = 'Grant And Apply',
  showBackButton = false,
}) => {
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 px-4 max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {showBackButton && (
            <button
              aria-label="Go back"
              onClick={() => router.back()}
              className="w-10 h-10 -ml-2 flex items-center justify-center text-primary rounded-full hover:bg-surface-container-low transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity">
            {/* Custom Shield Emblem SVG */}
            <div className="w-9 h-9 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center flex-shrink-0 shadow-xs ring-1 ring-secondary/30">
              <span className="material-symbols-outlined text-[20px] material-symbols-filled">
                shield_with_heart
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm font-bold text-[15px] sm:text-[17px] text-primary truncate leading-tight">
                  Nobody Needs Your Aadhaar Number
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant leading-none font-medium">
                  Vidarbha Grant 2025
                </span>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                  <span className="material-symbols-outlined text-[13px] text-secondary">
                    shield
                  </span>
                  <span className="font-label-sm text-[11px] font-semibold tracking-tight">
                    Zero Aadhaar Stored
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden md:inline-block font-label-md text-label-md text-on-surface-variant">
            {pageTitle}
          </span>
          <Link
            href="/volunteer/dashboard"
            title="Volunteer Portal"
            className="w-8 h-8 rounded-full bg-primary hover:bg-primary-container transition-colors flex items-center justify-center text-on-primary shadow-xs ring-2 ring-surface"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
