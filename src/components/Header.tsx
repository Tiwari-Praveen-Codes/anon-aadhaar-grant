'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  pageTitle?: string;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle = 'Grant And Apply',
  showBackButton = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check saved user session
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('sovereign_grant_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      } else {
        // Default demo session for volunteer routes
        if (pathname.startsWith('/volunteer')) {
          const defaultMentor = {
            name: 'Kavita Deshmukh',
            email: 'kavita.deshmukh@vidarbhagrants.org',
            role: 'Lead Grant Mentor & Reviewer',
            division: 'Nagpur Initiative',
          };
          setUser(defaultMentor);
          localStorage.setItem('sovereign_grant_user', JSON.stringify(defaultMentor));
        }
      }
    }

    // Close menu on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pathname]);

  const handleQuickLogin = (mentorName: string, mentorEmail: string, mentorRole: string) => {
    const session = {
      name: mentorName,
      email: mentorEmail,
      role: mentorRole,
      division: 'Nagpur & Vidarbha Cohort 2025',
    };
    localStorage.setItem('sovereign_grant_user', JSON.stringify(session));
    setUser(session);
    setMenuOpen(false);
    router.push('/volunteer/dashboard');
  };

  const handleSignOut = () => {
    localStorage.removeItem('sovereign_grant_user');
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  };

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

        {/* User / Profile & Login Section */}
        <div className="relative flex items-center gap-2 flex-shrink-0" ref={menuRef}>
          <span className="hidden md:inline-block font-label-md text-xs text-on-surface-variant">
            {pageTitle}
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            title={user ? `Signed in as ${user.name}` : 'Sign In / Account'}
            className="w-9 h-9 rounded-full bg-primary hover:bg-primary-container transition-all flex items-center justify-center text-on-primary shadow-xs ring-2 ring-surface relative active:scale-95"
          >
            {user ? (
              <span className="text-xs font-bold font-mono">
                {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
              </span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">person</span>
            )}

            {user && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary rounded-full border-2 border-surface"></span>
            )}
          </button>

          {/* Dropdown Menu Modal */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-72 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col space-y-3">
              {user ? (
                <>
                  {/* Logged in header */}
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-outline-variant/20">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                      {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-primary truncate">{user.name}</span>
                      <span className="text-[11px] text-on-surface-variant truncate">{user.email}</span>
                      <span className="text-[10px] text-secondary font-semibold">{user.role}</span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-col space-y-1 text-xs">
                    <Link
                      href="/volunteer/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="p-2 rounded-xl hover:bg-surface-container flex items-center gap-2 text-on-surface font-semibold transition-colors"
                    >
                      <span className="material-symbols-outlined text-secondary text-[18px]">dashboard</span>
                      <span>Volunteer Dashboard</span>
                    </Link>

                    <Link
                      href="/volunteer/queue"
                      onClick={() => setMenuOpen(false)}
                      className="p-2 rounded-xl hover:bg-surface-container flex items-center gap-2 text-on-surface font-semibold transition-colors"
                    >
                      <span className="material-symbols-outlined text-secondary text-[18px]">inbox</span>
                      <span>Applicant Queue (89)</span>
                    </Link>

                    <Link
                      href="/status"
                      onClick={() => setMenuOpen(false)}
                      className="p-2 rounded-xl hover:bg-surface-container flex items-center gap-2 text-on-surface font-semibold transition-colors"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px]">search</span>
                      <span>Track Application Status</span>
                    </Link>
                  </div>

                  {/* Sign out */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-2 px-3 rounded-xl bg-surface-container-low hover:bg-error-container hover:text-error text-on-surface-variant text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-1 pb-2 border-b border-outline-variant/20">
                    <span className="text-xs font-bold text-primary block">Sign In to Portal</span>
                    <span className="text-[11px] text-on-surface-variant block leading-tight">
                      Access the Vidarbha Reviewer Dashboard &amp; Allocation Queue.
                    </span>
                  </div>

                  {/* 1-Click Quick Demo Login options */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                      Quick Demo Mentor Login:
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuickLogin(
                          'Kavita Deshmukh',
                          'kavita.deshmukh@vidarbhagrants.org',
                          'Lead Grant Mentor & Reviewer'
                        )
                      }
                      className="w-full p-2 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center gap-2 text-left transition-colors border border-outline-variant/20"
                    >
                      <div className="w-7 h-7 rounded-full bg-secondary-container text-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
                        KD
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-primary truncate">Kavita Deshmukh</span>
                        <span className="text-[10px] text-on-surface-variant truncate">Lead Mentor • Nagpur</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuickLogin(
                          'Dr. Rajeshwar Patil',
                          'rajeshwar.patil@vidarbhagrants.org',
                          'Academic Verification Officer'
                        )
                      }
                      className="w-full p-2 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center gap-2 text-left transition-colors border border-outline-variant/20"
                    >
                      <div className="w-7 h-7 rounded-full bg-surface-container text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                        RP
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-primary truncate">Dr. Rajeshwar Patil</span>
                        <span className="text-[10px] text-on-surface-variant truncate">Verifier • Amravati</span>
                      </div>
                    </button>
                  </div>

                  {/* Dedicated Login Link */}
                  <Link
                    href="/volunteer/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">key</span>
                    <span>Sign In with Email / Passcode</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
