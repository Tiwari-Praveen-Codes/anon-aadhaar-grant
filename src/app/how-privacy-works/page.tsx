'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { generateClientZkProof, VIDARBHA_DISTRICTS } from '@/lib/zk-proof';

export default function HowPrivacyWorksPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('Nagpur');
  const [applicantAge, setApplicantAge] = useState(20);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedProof, setSimulatedProof] = useState<any>(null);

  const runSimulator = () => {
    setIsSimulating(true);
    setSimulatedProof(null);

    setTimeout(() => {
      const proof = generateClientZkProof({
        applicantDistrict: selectedDistrict,
        age: applicantAge,
        aadhaarSecretSeed: `user-sim-${selectedDistrict}-${applicantAge}-${Date.now()}`,
      });
      setSimulatedProof(proof);
      setIsSimulating(false);
    }, 900);
  };

  return (
    <>
      <Header pageTitle="ZK Privacy Explainer" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-6">
          {/* Header Badge */}
          <div className="flex flex-col space-y-2">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                shield_with_heart
              </span>
              <span className="font-label-sm text-label-sm font-semibold">
                Cryptographic Architecture
              </span>
            </div>

            <h1 className="font-headline text-2xl sm:text-3xl text-primary font-bold tracking-tight">
              How Zero-Knowledge Privacy Works
            </h1>

            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Understand why the Vidarbha Education Grant requires <strong>0 bytes of your Aadhaar number</strong> to verify your eligibility with 100% mathematical certainty.
            </p>
          </div>

          {/* Comparison Matrix: Traditional KYC vs Anon Aadhaar ZKP */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 space-y-4">
            <h2 className="font-headline text-lg text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                compare_arrows
              </span>
              Traditional KYC vs. Anon Aadhaar ZKP
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Traditional */}
              <div className="p-3.5 rounded-xl bg-error-container/30 border border-error/20 flex flex-col space-y-2">
                <div className="flex items-center gap-2 text-error font-bold font-label-md">
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  Traditional System
                </div>
                <ul className="text-xs space-y-1.5 text-on-surface-variant list-disc pl-4">
                  <li>Uploads raw photo of Aadhaar card</li>
                  <li>Stores 12-digit UIDAI number on database</li>
                  <li>Vulnerable to server data breaches</li>
                  <li>Leaves permanent tracking trace</li>
                </ul>
              </div>

              {/* ZKP */}
              <div className="p-3.5 rounded-xl bg-secondary-container/40 border border-secondary/40 flex flex-col space-y-2">
                <div className="flex items-center gap-2 text-secondary font-bold font-label-md">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Anon Aadhaar ZKP
                </div>
                <ul className="text-xs space-y-1.5 text-on-surface-variant list-disc pl-4">
                  <li>QR parsed locally inside browser memory</li>
                  <li>0 digits stored or transmitted</li>
                  <li>Generates mathematical Groth16 proof</li>
                  <li>Unlinkable anti-double claim nullifiers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3 Pillars of Anon Aadhaar */}
          <div className="space-y-3">
            <h2 className="font-headline text-lg text-primary font-bold">
              The Three Cryptographic Pillars
            </h2>

            {/* Pillar 1 */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">key</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-primary font-bold">
                  1. Local RSA Signature Verification
                </span>
                <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  Every Aadhaar QR is digitally signed by UIDAI using a 2048-bit RSA key. The browser verifies this digital signature using the official public key without connecting to any external server.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">calculate</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-primary font-bold">
                  2. SNARK Circuit Computation
                </span>
                <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  A client-side arithmetic circuit checks conditions (e.g., <code className="text-xs font-mono bg-surface-container px-1 py-0.5 rounded">Age &ge; 18</code> and <code className="text-xs font-mono bg-surface-container px-1 py-0.5 rounded">District &isin; Vidarbha</code>). It outputs a 128-byte proof asserting the conditions are met without disclosing the underlying inputs.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-primary font-bold">
                  3. Deterministic Nullifier Hashing
                </span>
                <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  To prevent the same applicant from receiving two grants in the same year, the system calculates <code className="text-xs font-mono bg-surface-container px-1 py-0.5 rounded">Nullifier = SHA-256(Cycle_ID + Aadhaar_Secret)</code>. The grant registry records this hash, blocking duplicates while retaining zero personal identifying data.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Live ZKP Circuit Simulator */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border-2 border-secondary/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  science
                </span>
                <h3 className="font-headline text-lg text-primary font-bold">
                  Interactive ZK Circuit Simulator
                </h3>
              </div>
              <span className="font-label-sm text-[11px] bg-secondary-container text-on-secondary-fixed-variant px-2 py-0.5 rounded-full font-semibold">
                Live Test
              </span>
            </div>

            <p className="font-body-sm text-on-surface-variant">
              Test how the local SNARK engine computes verification outputs in real-time:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">District Domicile</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm font-medium focus:outline-none"
                >
                  {VIDARBHA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} (Vidarbha)
                    </option>
                  ))}
                  <option value="Pune">Pune (Non-Vidarbha test)</option>
                  <option value="Mumbai">Mumbai (Non-Vidarbha test)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">Applicant Age ({applicantAge} yrs)</label>
                <input
                  type="range"
                  min="16"
                  max="30"
                  value={applicantAge}
                  onChange={(e) => setApplicantAge(parseInt(e.target.value))}
                  className="w-full accent-primary mt-2"
                />
              </div>
            </div>

            <button
              onClick={runSimulator}
              disabled={isSimulating}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              {isSimulating ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Executing WebAssembly SNARK prover...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  <span>Generate Local Zero-Knowledge Proof</span>
                </>
              )}
            </button>

            {simulatedProof && (
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-outline-variant/20">
                  <span className="font-semibold text-primary">Prover Output Status</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      simulatedProof.claims.isOver18 && simulatedProof.claims.isVidarbhaResident
                        ? 'bg-secondary-container text-on-secondary-fixed-variant'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {simulatedProof.claims.isOver18 && simulatedProof.claims.isVidarbhaResident
                      ? 'VALID PROOF ✓'
                      : 'CIRCUIT CONSTRAINTS FAILED ✗'}
                  </span>
                </div>

                <div className="text-xs space-y-1 font-mono">
                  <div className="text-on-surface-variant truncate">
                    <strong>Nullifier:</strong> {simulatedProof.nullifier}
                  </div>
                  <div className="text-on-surface-variant truncate">
                    <strong>Groth16 pi_a:</strong> {simulatedProof.proof.pi_a[0]}
                  </div>
                  <div className="text-on-surface-variant">
                    <strong>Age &ge; 18:</strong> {simulatedProof.claims.isOver18 ? 'PASS (1)' : 'FAIL (0)'}
                  </div>
                  <div className="text-on-surface-variant">
                    <strong>Vidarbha Domicile:</strong>{' '}
                    {simulatedProof.claims.isVidarbhaResident ? 'PASS (1)' : 'FAIL (0)'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action */}
          <div className="pt-2 flex flex-col space-y-3">
            <Link
              href="/apply/verification"
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all text-center"
            >
              <span>Ready to Verify on Your Phone</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
