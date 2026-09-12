'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';

export default function DuplicateNoticePage() {
  return (
    <>
      <Header pageTitle="Application Notice" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-4">
          {/* Duplicate Warning Card */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 border border-amber-300 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">gpp_maybe</span>
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                Duplicate Nullifier Detected
              </span>
              <h1 className="font-headline text-xl sm:text-2xl text-primary font-bold pt-1">
                Application Already Submitted
              </h1>
              <p className="font-body-sm text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Our client-side zero-knowledge verification engine identified that the cryptographic nullifier for this Aadhaar credential has already been recorded for the <strong>Vidarbha 2025 Grant Cycle</strong>.
              </p>
            </div>

            {/* Privacy Assurance Box */}
            <div className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-secondary text-[18px]">security</span>
                <span>Why am I seeing this?</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                To guarantee fairness and prevent double allocation, each citizen is restricted to a single ₹15,000 grant per year. Because zero Aadhaar data is stored, this is enforced purely through a mathematical one-way nullifier hash.
              </p>
            </div>
          </div>

          {/* Action Options Grid */}
          <div className="space-y-2.5">
            <Link
              href="/status"
              className="w-full p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 shadow-xs flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-container text-secondary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                    Check Existing Application Status
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Look up with your reference ID or student email
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/apply/verification"
              className="w-full p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 shadow-xs flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                    Scan Different Aadhaar QR
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Try another test profile or household member
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-secondary hover:text-primary font-bold inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
