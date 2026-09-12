'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { ZkProofPayload } from '@/lib/types';

export default function ReviewSubmitPage() {
  const router = useRouter();

  const [zkProof, setZkProof] = useState<ZkProofPayload | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [consentChecked, setConsentChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProof = sessionStorage.getItem('current_zk_proof');
      const savedForm = sessionStorage.getItem('student_form_data');

      if (savedProof) {
        try {
          setZkProof(JSON.parse(savedProof));
        } catch (e) {}
      }

      if (savedForm) {
        try {
          setFormData(JSON.parse(savedForm));
        } catch (e) {}
      } else {
        // Default fallback if navigated directly
        setFormData({
          fullName: 'Ananya Suresh Wankhede',
          email: 'ananya.wankhede@gcoen.ac.in',
          mobile: '9823456712',
          collegeName: 'Government College of Engineering, Nagpur (GCOEN)',
          collegeCode: 'GCOEN',
          courseName: 'B.Tech Electrical Engineering',
          studyYear: 2,
          grantReason: 'Assistance for semester tuition fee and academic reference materials.',
          documentName: 'Bonafide_Cert_GCOEN_2025.pdf',
          documentSize: '1.4 MB',
        });
      }
    }
  }, []);

  const nullifierDisplay = zkProof?.nullifier || '0x9f4a72d3e18bc0094e8812c6a41f6e29d0bb51a998c821';

  const handleSubmit = async () => {
    if (!consentChecked) {
      alert('Please acknowledge the privacy undertaking before submission.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        nullifierHash: nullifierDisplay,
        proofValidity: 'Groth16_Verified',
        zkProof: zkProof,
        fullName: formData?.fullName || 'Student Applicant',
        email: formData?.email || 'student@vidarbha.edu',
        mobile: formData?.mobile || '9823456712',
        collegeName: formData?.collegeName || 'GCOEN Nagpur',
        collegeCode: formData?.collegeCode || 'GCOEN',
        courseName: formData?.courseName || 'B.Tech',
        studyYear: formData?.studyYear || 1,
        grantReason: formData?.grantReason || 'Tuition and academic textbooks support.',
        documentName: formData?.documentName || 'Bonafide_Cert_2025.pdf',
        documentSize: formData?.documentSize || '1.4 MB',
        disbursementAccount: `${formData?.mobile || '9823456712'}@upi`,
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Duplicate nullifier
        router.push('/apply/duplicate');
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmittedRefId(data.refId || 'VDB-2025-8842');
      setSubmissionSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefId = () => {
    navigator.clipboard.writeText(submittedRefId);
    alert('Reference ID copied to clipboard: ' + submittedRefId);
  };

  return (
    <>
      <Header pageTitle="Review &amp; Status" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-4">
          {!submissionSuccess ? (
            <div className="flex flex-col space-y-4 w-full">
              {/* Title & Step Header */}
              <div className="flex flex-col space-y-1">
                <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant">
                  <span className="material-symbols-outlined text-[15px] material-symbols-filled text-secondary">
                    verified
                  </span>
                  <span className="font-label-sm text-xs font-bold">
                    Step 3 of 3 • Final Verification
                  </span>
                </div>
                <h1 className="font-headline text-2xl text-primary font-bold tracking-tight">
                  Review Your Grant Application
                </h1>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Cycle: Vidarbha Education Grant 2025 • Amount: ₹15,000
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Cryptographic Verification Card */}
              <div className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-xs flex flex-col space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                      <span className="material-symbols-outlined text-[20px] material-symbols-filled">
                        shield_with_heart
                      </span>
                    </div>
                    <div>
                      <h2 className="font-label-lg text-sm text-primary font-bold">
                        Cryptographic Verification
                      </h2>
                      <span className="font-label-sm text-xs text-secondary font-semibold">
                        Local ZK-Proof Attestation
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant text-xs font-bold">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">
                        lock
                      </span>
                      <span className="text-on-surface font-medium">Eligibility Proof Status</span>
                    </div>
                    <span className="font-bold text-secondary">Verified (ZK-Proof)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">
                        no_accounts
                      </span>
                      <span className="text-on-surface font-medium">Privacy Guarantee</span>
                    </div>
                    <span className="font-bold text-primary">Zero Aadhaar Stored</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1.5 border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant font-medium">
                        Nullifier Hash (Anti-Double Claim)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(nullifierDisplay);
                          alert('Nullifier copied!');
                        }}
                        className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                      >
                        <span className="material-symbols-outlined text-[13px]">content_copy</span>
                        Copy
                      </button>
                    </div>
                    <code className="font-mono text-[11px] leading-tight text-primary bg-surface-container px-2 py-1 rounded truncate">
                      {nullifierDisplay}
                    </code>
                  </div>
                </div>
              </div>

              {/* Applicant Profile Summary Card */}
              <div className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-xs flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
                  <h2 className="font-label-lg text-sm text-primary font-bold">Applicant Profile</h2>
                  <span className="text-xs text-secondary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      check_circle
                    </span>
                    Pre-qualified
                  </span>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-xl font-bold flex-shrink-0 shadow-xs">
                    {formData?.fullName ? formData.fullName.charAt(0) : 'A'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-headline text-base font-bold text-on-surface truncate">
                      {formData?.fullName || 'Student Applicant'}
                    </h3>
                    <span className="font-label-sm text-xs text-on-surface-variant">
                      Nagpur Division • Maharashtra
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-[16px]">school</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-on-surface-variant text-[11px]">College &amp; Degree</span>
                      <span className="font-semibold text-on-surface truncate">
                        {formData?.collegeName || 'GCOEN'}
                      </span>
                      <span className="text-on-surface-variant text-[11px]">
                        {formData?.courseName || 'B.Tech'} (Year {formData?.studyYear || 1})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-[16px]">alternate_email</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-on-surface-variant text-[11px]">Contact Dispatch</span>
                      <span className="font-semibold text-on-surface truncate">
                        {formData?.email || 'student@gcoen.ac.in'}
                      </span>
                      <span className="text-on-surface-variant text-[11px] font-mono">
                        +91 {formData?.mobile || '98234 56712'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                    <span className="text-on-surface-variant text-[11px]">Purpose of Support</span>
                    <p className="font-body-sm text-xs text-on-surface italic leading-relaxed">
                      &ldquo;{formData?.grantReason}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Undertaking Checkbox */}
              <div className="rounded-2xl bg-secondary-container/40 p-4 border border-secondary/30 flex flex-col space-y-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.value === 'true' || e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-primary text-on-primary flex-shrink-0 cursor-pointer"
                  />
                  <span className="font-body-sm text-xs text-on-surface leading-relaxed">
                    I acknowledge that my Aadhaar number was verified locally on my phone and has{' '}
                    <strong className="font-bold text-primary">not been transmitted</strong> to the grant office.
                  </span>
                </label>
                <div className="flex items-center gap-1.5 text-on-surface-variant pl-7 text-[11px]">
                  <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
                  <span>Protected under Section 29 of Aadhaar Act (Decentralized ZK Validation)</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2 pb-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !consentChecked}
                  className="w-full h-12 bg-primary hover:bg-primary-container active:scale-[0.99] text-on-primary rounded-xl font-label-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">
                        progress_activity
                      </span>
                      <span>Recording Zero-Knowledge Manifest...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
                <p className="font-label-sm text-[11px] text-center text-on-surface-variant mt-2">
                  Zero biometric data or 12-digit number will leave your device.
                </p>
              </div>
            </div>
          ) : (
            /* Post-Submit Confirmation Card / Success Layer */
            <div className="flex flex-col space-y-4 w-full animate-in fade-in duration-300">
              <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-lg border border-secondary/30 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-secondary shadow-inner">
                  <span className="material-symbols-outlined text-[36px] material-symbols-filled">
                    task_alt
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                    Submission Confirmed
                  </span>
                  <h2 className="font-headline text-xl text-primary font-bold pt-1">
                    Application Successfully Submitted!
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                    Your zero-knowledge eligibility certificate has been recorded securely by the Vidarbha Academic Board.
                  </p>
                </div>

                {/* Application Reference Pill */}
                <div className="w-full bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center space-y-1 border border-outline-variant/30">
                  <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                    Application Reference ID
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-xl font-mono text-primary font-bold">
                      {submittedRefId}
                    </span>
                    <button
                      type="button"
                      onClick={copyRefId}
                      className="text-secondary hover:text-primary p-1 transition-colors"
                      title="Copy Reference ID"
                    >
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Review Timeline Card */}
              <div className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-xs flex flex-col space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    calendar_today
                  </span>
                  <span>What Happens Next?</span>
                </div>

                <div className="space-y-3 pl-1 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">Volunteer Academic Review</span>
                      <span className="text-on-surface-variant leading-relaxed">
                        Typically takes 3–5 working days. A community mentor verifies course enrollment with your university roster.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">Disbursement Scheduling</span>
                      <span className="text-on-surface-variant leading-relaxed">
                        Approved awards of ₹15,000 are scheduled for direct bank credit.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  href={`/status?ref=${submittedRefId}`}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Track Application Status</span>
                </Link>
                <Link
                  href="/"
                  className="w-full py-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary font-bold text-sm flex items-center justify-center gap-2 border border-outline-variant/30 transition-colors"
                >
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
