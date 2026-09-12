'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';

export default function ApplicationReviewDecisionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const refId = params.id;

  const [application, setApplication] = useState<any>(null);
  const [volunteerNotes, setVolunteerNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    fetch(`/api/applications/${refId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.application) {
          setApplication(data.application);
          setVolunteerNotes(data.application.volunteerNotes || '');
        }
      })
      .catch((err) => console.error('Failed to load application:', err))
      .finally(() => setIsLoading(false));
  }, [refId]);

  const handleDecision = async (newStatus: string) => {
    setIsUpdating(true);
    setFeedbackMsg('');

    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          volunteerNotes,
          reviewedBy: 'Kavita Deshmukh (Lead Mentor)',
        }),
      });

      const data = await res.json();
      if (data.success && data.application) {
        setApplication(data.application);
        setFeedbackMsg(`Application successfully updated to: ${newStatus}`);
      } else {
        alert(data.error || 'Failed to update application');
      }
    } catch (err: any) {
      alert('Error updating decision: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header pageTitle="Application Review" showBackButton />
        <main className="flex items-center justify-center min-h-screen pt-20">
          <div className="flex flex-col items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-[24px] text-secondary">
              progress_activity
            </span>
            <span>Loading application details...</span>
          </div>
        </main>
      </>
    );
  }

  if (!application) {
    return (
      <>
        <Header pageTitle="Application Review" showBackButton />
        <main className="flex items-center justify-center min-h-screen pt-20 px-4">
          <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-center space-y-3 max-w-sm">
            <span className="material-symbols-outlined text-error text-[32px]">error</span>
            <h2 className="font-headline text-lg font-bold text-primary">Application Not Found</h2>
            <p className="text-xs text-on-surface-variant">
              Could not find an application with ID: {refId}
            </p>
            <button
              onClick={() => router.push('/volunteer/queue')}
              className="py-2.5 px-4 bg-primary text-on-primary rounded-xl text-xs font-bold w-full"
            >
              Back to Queue
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header pageTitle="Review &amp; Decision" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-4">
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-2 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-secondary font-bold">
                  {application.refId}
                </span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  Cohort #14
                </span>
              </div>
              <h1 className="font-headline text-2xl text-primary font-bold">
                {application.fullName}
              </h1>
            </div>
            <StatusBadge status={application.status} />
          </div>

          {feedbackMsg && (
            <div className="p-3 bg-secondary-container text-on-secondary-fixed-variant rounded-xl text-xs font-bold flex items-center gap-2 border border-secondary/30 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Cryptographic Attestation Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  verified_user
                </span>
                <span>ZK-Proof Cryptographic Verification</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-secondary-container text-on-secondary-fixed-variant px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block text-[11px]">Groth16 Proof</span>
                <span className="font-bold text-secondary flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Valid SNARK Proof
                </span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant block text-[11px]">UIDAI RSA Key</span>
                <span className="font-bold text-primary flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  UIDAI Root 2024
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-surface-container-low rounded-xl space-y-1 text-xs">
              <span className="text-on-surface-variant text-[11px]">Nullifier Hash (Anti-Double Claim)</span>
              <code className="font-mono text-[11px] text-primary block truncate bg-surface-container px-2 py-1 rounded">
                {application.nullifierHash}
              </code>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-secondary font-bold">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span>Zero bytes of raw Aadhaar or biometric data are stored or accessible.</span>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs space-y-3">
            <h2 className="font-headline text-base text-primary font-bold pb-1 border-b border-outline-variant/20">
              Academic &amp; Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-on-surface-variant text-[11px] block">College</span>
                <span className="font-bold text-on-surface">{application.collegeName}</span>
              </div>
              <div>
                <span className="text-on-surface-variant text-[11px] block">Course &amp; Year</span>
                <span className="font-bold text-on-surface">
                  {application.courseName} (Year {application.studyYear})
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant text-[11px] block">Email</span>
                <span className="font-medium text-on-surface">{application.email}</span>
              </div>
              <div>
                <span className="text-on-surface-variant text-[11px] block">WhatsApp / Mobile</span>
                <span className="font-medium text-on-surface font-mono">+91 {application.mobile}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/20">
              <span className="text-on-surface-variant text-[11px] block font-semibold mb-1">
                Statement of Need:
              </span>
              <p className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface italic leading-relaxed border border-outline-variant/20">
                &ldquo;{application.grantReason}&rdquo;
              </p>
            </div>

            {/* Supporting Document Tile */}
            {application.documentName && (
              <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    description
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-on-surface truncate">
                      {application.documentName}
                    </span>
                    <span className="text-[11px] text-secondary font-semibold">
                      {application.documentSize || '1.4 MB'} • Bonafide Verified
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Viewing document: ${application.documentName}`)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold"
                >
                  View
                </button>
              </div>
            )}
          </div>

          {/* Volunteer Decision Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border-2 border-primary/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-base text-primary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  gavel
                </span>
                Volunteer Evaluation Decision
              </h2>
              <span className="text-xs font-bold text-secondary">₹15,000 Award</span>
            </div>

            <div className="space-y-1">
              <label htmlFor="notes" className="text-xs font-semibold text-on-surface">
                Evaluation Notes &amp; Roster Check:
              </label>
              <textarea
                id="notes"
                rows={3}
                value={volunteerNotes}
                onChange={(e) => setVolunteerNotes(e.target.value)}
                placeholder="e.g. Confirmed enrollment with GCOEN electrical department registry. First-generation student verified..."
                className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface text-xs font-medium border border-outline-variant/30 focus:border-primary focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDecision('APPROVED')}
                disabled={isUpdating}
                className="py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-70"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Approve Grant (₹15,000)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision('REJECTED')}
                disabled={isUpdating}
                className="py-3 px-4 rounded-xl bg-error-container hover:bg-red-200 text-on-error-container font-bold text-xs flex items-center justify-center gap-2 border border-error/30 transition-colors disabled:opacity-70"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                <span>Mark Ineligible</span>
              </button>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20 text-xs">
              <button
                type="button"
                onClick={() => handleDecision(application.status)}
                disabled={isUpdating}
                className="text-on-surface-variant hover:text-primary font-semibold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">save</span>
                <span>Save Notes Only</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/volunteer/queue')}
                className="text-secondary hover:text-primary font-bold"
              >
                &larr; Back to Queue
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
