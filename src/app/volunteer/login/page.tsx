'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

export default function VolunteerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('kavita.deshmukh@vidarbhagrants.org');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/volunteer/dashboard');
    }, 600);
  };

  return (
    <>
      <Header pageTitle="Volunteer Login" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-sm mx-auto space-y-5 my-auto">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-[28px]">handshake</span>
            </div>
            <h1 className="font-headline text-2xl text-primary font-bold">
              Volunteer Secure Portal
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Vidarbha District Education Grant Committee 2025
            </p>
          </div>

          <form onSubmit={handleLogin} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Volunteer Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mentor@vidarbhagrants.org"
                className="w-full p-2.5 rounded-xl bg-surface-container-low text-sm font-medium border border-outline-variant/30 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Security Passcode / OTP</label>
              <input
                type="password"
                required
                defaultValue="••••••••"
                placeholder="Enter 6-digit access code"
                className="w-full p-2.5 rounded-xl bg-surface-container-low text-sm font-medium border border-outline-variant/30 focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-center text-xs text-on-surface-variant">
            <span>Demo Mode Active: Click Sign In to enter as Kavita Deshmukh (Lead Mentor).</span>
          </div>
        </div>
      </main>
    </>
  );
}
