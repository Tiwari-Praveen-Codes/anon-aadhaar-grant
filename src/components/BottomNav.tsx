'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Grant & Apply',
      href: '/',
      icon: 'school',
      match: (p: string) => p === '/' || p.startsWith('/how-privacy-works'),
    },
    {
      label: 'Verification',
      href: '/apply/verification',
      icon: 'verified_user',
      match: (p: string) => p.startsWith('/apply'),
    },
    {
      label: 'Review & Status',
      href: '/status',
      icon: 'assignment_turned_in',
      match: (p: string) => p.startsWith('/status'),
    },
    {
      label: 'Volunteer',
      href: '/volunteer/dashboard',
      icon: 'handshake',
      match: (p: string) => p.startsWith('/volunteer'),
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/92 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-md md:max-w-xl mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[68px] min-h-[44px] py-1 transition-colors rounded-lg ${
                isActive
                  ? 'text-primary font-bold bg-surface-container/50'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low/60'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'material-symbols-filled text-secondary' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-[11px] mt-0.5 text-center leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
