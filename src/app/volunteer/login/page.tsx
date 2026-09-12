'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

export default function VolunteerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('kavita.deshmukh@vidarbhagrants.org');
  const [passcode, setPasscode] = useState('123456');
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Fetch registered mentors from database
    fetch('/api/auth/volunteers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.volunteers) {
          setVolunteers(data.volunteers);
        }
      })
      .catch((err) => console.error('Error fetching volunteers:', err));
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passcode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store authenticated session
      if (typeof window !== 'undefined') {
        localStorage.setItem('sovereign_grant_user', JSON.stringify(data.user));
      }

      setSuccessMsg(`Authenticated as ${data.user.name}! Redirecting to dashboard...`);

      setTimeout(() => {
        router.push('/volunteer/dashboard');
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectMentor = (mentor: any) => {
    setEmail(mentor.email);
    setPasscode('123456');
  };

  return (
    <>
      <Header pageTitle="Volunteer Login" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-md mx-auto space-y-5 my-auto">
          {/* Header Icon & Intro */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary text-secondary-container flex items-center justify-center mx-auto shadow-md ring-4 ring-secondary/20">
              <span className="material-symbols-outlined text-[28px] material-symbols-filled">
                handshake
              </span>
            </div>
            <h1 className="font-headline text-2xl text-primary font-bold">
              Volunteer Secure Portal
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant max-w-xs mx-auto">
              Vidarbha District Education Grant Committee 2025 • Reviewer &amp; Mentor Sign In
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-error-container text-on-error-container rounded-xl text-xs font-semibold flex items-center gap-2 border border-error/30 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-secondary-container text-on-secondary-fixed-variant rounded-xl text-xs font-bold flex items-center gap-2 border border-secondary/30 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Mentor Profile Switcher */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs space-y-2.5">
            <span className="text-[11px] font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[16px]">account_circle</span>
              Select Mentor Account:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  selectMentor({
                    name: 'Kavita Deshmukh',
                    email: 'kavita.deshmukh@vidarbhagrants.org',
                  })
                }
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  email === 'kavita.deshmukh@vidarbhagrants.org'
                    ? 'bg-secondary-container/50 border-secondary shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  KD
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-primary truncate">Kavita Deshmukh</span>
                  <span className="text-[10px] text-on-surface-variant truncate">Lead Mentor</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  selectMentor({
                    name: 'Dr. Rajeshwar Patil',
                    email: 'rajeshwar.patil@vidarbhagrants.org',
                  })
                }
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  email === 'rajeshwar.patil@vidarbhagrants.org'
                    ? 'bg-secondary-container/50 border-secondary shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  RP
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-primary truncate">Dr. Rajeshwar Patil</span>
                  <span className="text-[10px] text-on-surface-variant truncate">Verifier • Amravati</span>
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Volunteer Email</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mentor@vidarbhagrants.org"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface">Security Access Passcode</label>
                <span className="text-[11px] text-secondary font-semibold">Demo: 123456</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter 6-digit passcode"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:border-primary focus:outline-none tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-sm transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-80"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Sign In to Dashboard</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy Security Footnote */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-center text-xs text-on-surface-variant flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
            <span>Zero biometric logs • Protected Reviewer Session</span>
          </div>
        </div>
      </main>
    </>
  );
}
