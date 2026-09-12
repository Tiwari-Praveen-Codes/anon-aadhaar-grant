'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { SAMPLE_AADHAAR_PROFILES, generateClientZkProof } from '@/lib/zk-proof';
import { ZkProofPayload } from '@/lib/types';

export default function VerificationPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'qr' | 'zk' | 'grant'>('zk');
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [progress, setProgress] = useState(78);
  const [isComputing, setIsComputing] = useState(false);
  const [zkProof, setZkProof] = useState<ZkProofPayload | null>(null);
  const [stepStates, setStepStates] = useState({
    step1: true,
    step2: true,
    step3: 'active', // 'active' | 'done' | 'pending'
    step4: 'pending',
  });

  // Run proof generation on mount or when profile changes
  useEffect(() => {
    runLocalZkProof();
  }, [selectedProfileIndex]);

  const runLocalZkProof = () => {
    const profile = SAMPLE_AADHAAR_PROFILES[selectedProfileIndex];
    setIsComputing(true);
    setProgress(15);
    setStepStates({
      step1: true,
      step2: false,
      step3: 'pending',
      step4: 'pending',
    });

    setTimeout(() => {
      setProgress(45);
      setStepStates({
        step1: true,
        step2: true,
        step3: 'active',
        step4: 'pending',
      });
    }, 600);

    setTimeout(() => {
      setProgress(78);
      setStepStates({
        step1: true,
        step2: true,
        step3: 'active',
        step4: 'active',
      });
    }, 1200);

    setTimeout(() => {
      const generated = generateClientZkProof({
        rawQrPayload: profile.qrPayload,
        applicantDistrict: profile.district,
        age: profile.age,
        aadhaarSecretSeed: profile.qrPayload,
      });

      setZkProof(generated);
      // Store in sessionStorage for the subsequent form step
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('current_zk_proof', JSON.stringify(generated));
        sessionStorage.setItem('selected_profile', JSON.stringify(profile));
      }

      setProgress(100);
      setStepStates({
        step1: true,
        step2: true,
        step3: 'done',
        step4: 'done',
      });
      setIsComputing(false);
    }, 1800);
  };

  const handleProceedToForm = () => {
    // Check if duplicate profile was selected
    if (selectedProfileIndex === 3) {
      router.push('/apply/duplicate');
      return;
    }
    router.push('/apply/form');
  };

  const cancelVerification = () => {
    if (confirm('Purge temporary memory buffer and abort local verification?')) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('current_zk_proof');
        sessionStorage.removeItem('selected_profile');
      }
      router.push('/');
    }
  };

  return (
    <>
      <Header pageTitle="Verification Flow" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 py-2 space-y-4 max-w-xl mx-auto">
          {/* Privacy Guarantee Ambient Banner */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse flex-shrink-0"></div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-primary tracking-tight truncate font-bold">
                  {progress < 100
                    ? 'Active State: Generating Zero-Knowledge Proof locally'
                    : 'ZK-Proof Generated & Verified Locally'}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  RAM Sandbox • Zero Network Packets Transmitted
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary text-[22px] flex-shrink-0 material-symbols-filled">
              verified
            </span>
          </div>

          {/* Test Profile Selector Bar */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  tune
                </span>
                Test Aadhaar QR Profile:
              </span>
              <span className="text-[10px] uppercase font-bold text-secondary bg-surface-container-lowest px-1.5 py-0.5 rounded">
                Simulated Sandbox
              </span>
            </div>
            <select
              value={selectedProfileIndex}
              onChange={(e) => {
                setSelectedProfileIndex(parseInt(e.target.value));
              }}
              className="w-full p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs font-medium text-on-surface focus:outline-none"
            >
              {SAMPLE_AADHAAR_PROFILES.map((p, idx) => (
                <option key={p.id} value={idx}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* State Preview Switcher Tabs */}
          <div className="flex items-center p-1 bg-surface-container-high rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-1.5 px-2 text-center rounded-lg font-label-sm text-xs transition-all ${
                activeTab === 'qr'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-primary font-medium'
              }`}
            >
              1. QR Scan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('zk')}
              className={`flex-1 py-1.5 px-2 text-center rounded-lg font-label-sm text-xs transition-all ${
                activeTab === 'zk'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-primary font-medium'
              }`}
            >
              2. Local ZK Proof
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('grant')}
              className={`flex-1 py-1.5 px-2 text-center rounded-lg font-label-sm text-xs transition-all ${
                activeTab === 'grant'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-primary font-medium'
              }`}
            >
              3. Attestation Receipt
            </button>
          </div>

          {/* VIEW 1: QR Scan State */}
          {activeTab === 'qr' && (
            <div className="flex flex-col space-y-3 animate-in fade-in duration-200">
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">
                      qr_code_scanner
                    </span>
                    <h2 className="font-headline text-lg text-primary font-bold">
                      Scan Aadhaar Secure QR
                    </h2>
                  </div>
                  <span className="font-label-sm text-xs px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-semibold">
                    Local Wasm Only
                  </span>
                </div>

                {/* Camera / QR Sandbox Mock */}
                <div className="relative w-full aspect-video rounded-xl bg-surface-container flex flex-col items-center justify-center overflow-hidden border border-dashed border-outline/40">
                  <div className="absolute inset-4 rounded-lg bg-surface-container-low/85 flex flex-col items-center justify-center p-4 text-center">
                    <span className="material-symbols-outlined text-secondary text-[48px] animate-pulse">
                      document_scanner
                    </span>
                    <p className="font-body-sm text-on-surface-variant mt-2 max-w-xs text-xs">
                      Align the high-density printed QR code from your e-Aadhaar or mAadhaar app
                    </p>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 bg-surface-container-lowest/95 rounded-md border border-outline-variant/20 shadow-xs">
                    <span className="font-label-sm text-[11px] text-secondary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">videocam_off</span>
                      Frame buffer kept strictly in browser RAM
                    </span>
                    <span className="font-label-sm text-[11px] text-on-surface-variant">30 FPS Wasm</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl space-y-1 text-xs text-on-surface-variant">
                  <p className="font-semibold text-primary">Instructions for Vidarbha Applicants</p>
                  <p className="leading-relaxed">
                    You may present a printed sheet, mAadhaar app, or select a pre-loaded test profile. Only the cryptographic signature is decoded to verify domicile and age eligibility.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('zk');
                    runLocalZkProof();
                  }}
                  className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-lg font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>Simulate QR Capture &amp; Compute Proof</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: Active Local ZK Proof Processing Card (Main Required View) */}
          {activeTab === 'zk' && (
            <div className="flex flex-col space-y-3.5 animate-in fade-in duration-200">
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 relative overflow-hidden">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

                {/* Header with Local Badge */}
                <div className="flex items-start justify-between gap-2 pt-1">
                  <div>
                    <h2 className="font-headline text-lg text-primary font-bold block leading-tight">
                      Client-Side ZK Cryptography
                    </h2>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Vidarbha Grant Allocation Engine 2025
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-xs font-bold flex items-center gap-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    Offline Safe
                  </span>
                </div>

                {/* Verification Progress Ring */}
                <div className="flex flex-col items-center text-center py-4 my-1">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Progress Ring SVG */}
                    <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-surface-container-high"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="7"
                      />
                      <circle
                        className="text-secondary transition-all duration-700 ease-out"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="42"
                        stroke="currentColor"
                        strokeDasharray="263.89"
                        strokeDashoffset={(263.89 * (1 - progress / 100)).toString()}
                        strokeLinecap="round"
                        strokeWidth="7"
                      />
                    </svg>
                    {/* Center Metric */}
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-headline text-2xl text-primary font-bold leading-none">
                        {progress}%
                      </span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant tracking-wider uppercase mt-0.5 font-semibold">
                        SNARK
                      </span>
                    </div>
                  </div>

                  <h3 className="font-label-lg text-primary mt-3 mb-1 font-bold">
                    {progress === 100
                      ? 'Proof Generation Completed Successfully!'
                      : 'Generating Zero-Knowledge Proof on your device...'}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant max-w-sm leading-relaxed px-1">
                    Extracting digital signature from Aadhaar secure QR code. Your 12-digit Aadhaar number remains strictly inside temporary browser RAM.
                  </p>
                </div>

                {/* Step Progress Checklist */}
                <div className="space-y-2.5 pt-2">
                  {/* Step 1 */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-xs text-primary truncate font-semibold">
                          1. Read Aadhaar QR code
                        </span>
                        <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                          Parsed 2,048-bit payload from image buffer
                        </span>
                      </div>
                    </div>
                    <span className="font-label-sm text-xs text-secondary font-bold flex-shrink-0">
                      Completed ✓
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          stepStates.step2
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-surface-container-high text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-xs text-primary truncate font-semibold">
                          2. Validate UIDAI RSA signature locally
                        </span>
                        <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                          Public key match: UIDAI Root 2024
                        </span>
                      </div>
                    </div>
                    <span className="font-label-sm text-xs text-secondary font-bold flex-shrink-0">
                      Completed ✓
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      stepStates.step3 === 'done'
                        ? 'bg-surface-container-low border border-outline-variant/20'
                        : 'bg-secondary-fixed/40 ring-1 ring-secondary/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          stepStates.step3 === 'done'
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-primary text-on-primary animate-spin'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {stepStates.step3 === 'done' ? 'check' : 'progress_activity'}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-xs text-primary font-bold truncate">
                          3. Generate client-side ZK SNARK proof
                        </span>
                        <span className="font-label-sm text-[11px] text-secondary truncate">
                          Proving: Age &ge; 18 &amp; District = {SAMPLE_AADHAAR_PROFILES[selectedProfileIndex].district}
                        </span>
                      </div>
                    </div>
                    <span className="font-label-sm text-xs text-secondary font-bold flex-shrink-0">
                      {stepStates.step3 === 'done' ? 'Completed ✓' : `In Progress (${progress}%)`}
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          stepStates.step4 === 'done'
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-surface-container-high text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {stepStates.step4 === 'done' ? 'check' : 'lock_clock'}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-xs text-primary truncate font-semibold">
                          4. Compute cycle nullifier
                        </span>
                        <span className="font-label-sm text-[10px] text-outline truncate font-mono">
                          {zkProof?.nullifier
                            ? zkProof.nullifier.substring(0, 18) + '...'
                            : 'hash(grant-cycle-vidarbha-2025 + secret)'}
                        </span>
                      </div>
                    </div>
                    <span className="font-label-sm text-xs text-secondary font-bold flex-shrink-0">
                      {stepStates.step4 === 'done' ? 'Completed ✓' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Continue Action Button */}
                {progress === 100 && (
                  <div className="mt-4 pt-3 border-t border-outline-variant/20 flex flex-col space-y-2 animate-in fade-in duration-300">
                    <button
                      type="button"
                      onClick={handleProceedToForm}
                      className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <span>Proceed to Student Information (Step 2)</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: Attestation Receipt */}
          {activeTab === 'grant' && (
            <div className="flex flex-col space-y-3 animate-in fade-in duration-200">
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">account_balance</span>
                  </div>
                  <div>
                    <h2 className="font-headline text-lg text-primary font-bold leading-tight">
                      Verification Attestation
                    </h2>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Cryptographic attestation ready for allocation
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low space-y-3 border border-outline-variant/20 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Proof Validity</span>
                    <span className="text-secondary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Valid Groth16 Proof
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Nullifier Hash</span>
                    <span className="text-primary font-mono bg-surface-container px-2 py-0.5 rounded truncate max-w-[170px]">
                      {zkProof?.nullifier || '0x8f2d...99b1'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant">Grant Cohort</span>
                    <span className="text-primary font-bold">Vidarbha Student Aid 2025</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed text-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0">
                    mark_email_read
                  </span>
                  <p className="leading-snug">
                    The district disbursement committee will see confirmation of eligibility without access to your identity credentials.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToForm}
                  className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Continue to Step 2</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Prominent Privacy Status Panel (Transparency Ledger) */}
          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">security</span>
                <span className="font-label-lg text-primary font-bold text-sm">
                  Client-Side Privacy Ledger
                </span>
              </div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Live Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
              <div className="flex items-center justify-between px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    cloud_off
                  </span>
                  <span className="text-on-surface">Data uploaded to server:</span>
                </div>
                <span className="text-secondary font-bold bg-secondary-fixed/50 px-2 py-0.5 rounded-full flex-shrink-0">
                  0 bytes of Aadhaar
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">memory</span>
                  <span className="text-on-surface">Camera / QR feed:</span>
                </div>
                <span className="text-primary font-medium bg-surface-container px-2 py-0.5 rounded flex-shrink-0">
                  Processed in WebAssembly
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    visibility_off
                  </span>
                  <span className="text-on-surface">Aadhaar number displayed:</span>
                </div>
                <span className="text-secondary font-bold flex-shrink-0">Never</span>
              </div>
            </div>
          </div>

          {/* Educational Trust Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center flex-shrink-0 text-secondary">
              <span className="material-symbols-outlined text-[24px]">policy</span>
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="font-label-md text-primary font-bold text-sm">
                Zero-Knowledge Nullifier Principle
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                The cryptographic nullifier uniquely registers your single submission for Vidarbha 2025 so no person can claim twice, while mathematically assuring nobody can derive your name, biometric record, or Aadhaar identity.
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-col gap-2 pt-1 pb-4">
            <button
              type="button"
              onClick={cancelVerification}
              className="w-full py-3 px-4 rounded-xl bg-surface-container-lowest text-error font-label-md text-sm font-semibold hover:bg-error-container/40 transition-colors flex items-center justify-center gap-2 border border-outline-variant/30 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              <span>Cancel verification &amp; purge local RAM</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 text-center py-1 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span>Compliant with Section 29, Aadhaar Act (Zero Raw ID Storage)</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
