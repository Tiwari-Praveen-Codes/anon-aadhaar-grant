'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';

export default function GracefulRecoveryPage() {
  return (
    <>
      <Header pageTitle="Verification Recovery" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-4">
          <div className="rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/30 shadow-xs flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[28px]">build</span>
              </div>
              <div>
                <h1 className="font-headline text-lg font-bold text-primary">
                  Graceful Verification Recovery
                </h1>
                <p className="text-xs text-on-surface-variant">
                  Troubleshoot local browser zero-knowledge proof issues
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-on-surface-variant">
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-1">
                <span className="font-bold text-primary block">1. Ensure high QR contrast</span>
                <p>
                  High-density Aadhaar QRs contain 2,048 bits of RSA signature data. Ensure good lighting and hold the camera steady.
                </p>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-1">
                <span className="font-bold text-primary block">2. WebAssembly Memory Support</span>
                <p>
                  The Groth16 circuit evaluates arithmetic gates entirely on device. Ensure private browsing mode does not block WebAssembly.
                </p>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-1">
                <span className="font-bold text-primary block">3. Use Built-in Test Profiles</span>
                <p>
                  For demonstration and academic testing, select one of the pre-loaded Vidarbha student test profiles on the verification page.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/apply/verification"
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-xs text-center"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Retry Local Verification</span>
              </Link>

              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-surface-container text-primary font-bold text-sm flex items-center justify-center gap-2 text-center"
              >
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
