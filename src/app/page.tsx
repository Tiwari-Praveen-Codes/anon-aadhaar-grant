'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { ZkVerificationModal } from '@/components/ZkVerificationModal';

export default function LandingPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartApplication = () => {
    setIsStarting(true);
    setTimeout(() => {
      router.push('/apply/verification');
    }, 600);
  };

  return (
    <>
      <Header pageTitle="Grant And Apply" />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-6">
          {/* Top Civic Badge */}
          <div className="flex items-center justify-between gap-2 bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse flex-shrink-0"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate font-medium">
                Nagpur &amp; Vidarbha Student Initiative 2025
              </span>
            </div>
            <span className="font-label-md text-label-md px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-semibold flex-shrink-0">
              ₹15,000 Annual
            </span>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col space-y-3">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed border border-secondary/20">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                verified
              </span>
              <span className="font-label-sm text-label-sm font-semibold tracking-tight">
                Zero Aadhaar Storage Policy
              </span>
            </div>

            <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl text-primary font-bold tracking-tight leading-tight">
              Prove you are eligible.<br />
              <span className="text-secondary">Keep your identity private.</span>
            </h1>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              A ₹15,000 direct educational grant for first-generation college students across Vidarbha. We use client-side zero-knowledge proofs so your Aadhaar number is never requested, uploaded, or stored.
            </p>
          </div>

          {/* Micro-Grant Stats Bento Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-secondary mb-2">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
                <span className="font-label-sm text-label-sm bg-secondary-container/70 text-on-secondary-fixed-variant px-1.5 py-0.5 rounded font-semibold">
                  Direct Bank
                </span>
              </div>
              <div>
                <div className="font-headline text-2xl text-primary font-bold leading-none">
                  ₹15,000
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-medium">
                  Annual Student Aid
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-secondary mb-2">
                <span className="material-symbols-outlined text-[22px]">security</span>
                <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded font-semibold">
                  0 Bytes Logged
                </span>
              </div>
              <div>
                <div className="font-headline text-2xl text-primary font-bold leading-none">
                  0 ID Stored
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-medium">
                  Client-Side ZKP Only
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Workflow Pipeline Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                </div>
                <span className="font-label-lg text-label-lg text-primary font-bold">
                  Cryptographic Workflow
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-semibold">
                Runs on Device
              </span>
            </div>

            <div className="flex flex-col space-y-2 mt-4">
              {/* Step 1 */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary flex-shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                    1. Aadhaar Secure QR
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Read strictly in phone browser RAM
                  </span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[20px]">lock</span>
              </div>

              <div className="flex justify-center -my-1 text-secondary">
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary-container/40 border border-secondary/30">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">memory</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-md text-label-md text-primary font-bold">
                      2. Anon Aadhaar Engine
                    </span>
                    <span className="font-label-sm text-[10px] text-secondary bg-surface-container-lowest px-1.5 py-0.2 rounded font-bold">
                      OFFLINE
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Generates ZK mathematical proof locally
                  </span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
              </div>

              <div className="flex justify-center -my-1 text-secondary">
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary flex-shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">assured_workload</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                    3. Grant Allocation Office
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Receives verified proof: NO Aadhaar data
                  </span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
              </div>
            </div>

            {/* Assurance Banner */}
            <div className="mt-4 flex items-center gap-2.5 p-3 rounded-xl bg-primary text-on-primary shadow-xs">
              <span className="material-symbols-outlined text-secondary-container text-[20px] flex-shrink-0">
                shield_lock
              </span>
              <span className="font-label-sm text-label-sm font-medium">
                Your 12-digit Aadhaar number NEVER leaves this device.
              </span>
            </div>
          </div>

          {/* Key Eligibility Criteria */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">fact_check</span>
              <h2 className="font-headline text-lg text-primary font-bold">Grant Requirements</h2>
            </div>
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5 text-on-secondary-fixed-variant">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-primary font-semibold">
                    College Enrollment
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Enrolled in undergraduate degree or polytechnic diploma across Vidarbha.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5 text-on-secondary-fixed-variant">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-primary font-semibold">
                    First-Generation Learner
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    First in immediate household pursuing a higher degree.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5 text-on-secondary-fixed-variant">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-primary font-semibold">
                    Zero Document Surrender
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    No physical Aadhaar photocopy, no biometric scans, no centralized registration.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Banner / Coordinator Quote */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary-container overflow-hidden flex-shrink-0 ring-2 ring-surface">
                {/* Coordinator Avatar */}
                <div className="w-full h-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[24px]">account_circle</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-primary font-bold">
                  Kavita Deshmukh
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Grant Coordinator • Nagpur Initiative
                </span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface italic leading-relaxed">
              &ldquo;We created this grant so no student ever has to surrender their identity or sensitive biometric records just to receive rightful financial support.&rdquo;
            </p>
          </div>

          {/* Interactive FAQ Section */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-lg text-primary font-bold">Quick Privacy Questions</h2>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Transparency
              </span>
            </div>

            <details className="group cursor-pointer border-b border-outline-variant/20 pb-2">
              <summary className="flex justify-between items-center py-2 list-none font-label-lg text-primary font-medium">
                <span>Will anyone see my 12-digit Aadhaar number?</span>
                <span className="material-symbols-outlined text-outline text-[20px] transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="pt-1 pb-2 font-body-sm text-on-surface-variant">
                <strong className="text-on-surface">Never.</strong> The QR code is parsed strictly inside your smartphone&apos;s WebAssembly memory. Only the mathematical zero-knowledge proof travels over the network.
              </div>
            </details>

            <details className="group cursor-pointer border-b border-outline-variant/20 pb-2">
              <summary className="flex justify-between items-center py-2 list-none font-label-lg text-primary font-medium">
                <span>How are duplicate claims prevented?</span>
                <span className="material-symbols-outlined text-outline text-[20px] transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="pt-1 pb-2 font-body-sm text-on-surface-variant">
                The circuit derives a unique cryptographic <strong className="text-on-surface">nullifier hash</strong> for this specific grant round. If the same Aadhaar creates a second claim, the nullifier flags it instantly without ever revealing who made it.
              </div>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex justify-between items-center py-2 list-none font-label-lg text-primary font-medium">
                <span>How do I receive the grant funds?</span>
                <span className="material-symbols-outlined text-outline text-[20px] transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="pt-1 pb-2 font-body-sm text-on-surface-variant">
                Upon local cryptographic verification, you provide an Indian bank account or UPI ID of your choice for the direct benefit transfer.
              </div>
            </details>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={handleStartApplication}
              disabled={isStarting}
              className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all disabled:opacity-80"
            >
              {isStarting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    progress_activity
                  </span>
                  <span>Initializing Secure RAM Enclave...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                  <span>Start Application (Verify on Device)</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-3 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-secondary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 border border-outline-variant/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                <span>How ZKP Works</span>
              </button>

              <Link
                href="/how-privacy-works"
                className="py-3 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 border border-outline-variant/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                <span>Deep Dive Guide</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-center pt-1">
              <span className="material-symbols-outlined text-secondary text-[16px]">lock_reset</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Audited zero-knowledge cryptography. Powered by Anon Aadhaar.
              </span>
            </div>
          </div>
        </div>

        <ZkVerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </>
  );
}
