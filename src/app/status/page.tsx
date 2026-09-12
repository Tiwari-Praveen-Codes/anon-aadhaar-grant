'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';

function StatusContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || 'VDB-2025-8842';

  const [searchQuery, setSearchQuery] = useState(initialRef);
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRef) {
      handleSearch(initialRef);
    }
  }, [initialRef]);

  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!q) return;

    setIsLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(`/api/applications/${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setApplication(null);
        setError('No application found matching reference ID or nullifier.');
      } else {
        setApplication(data.application);
      }
    } catch (err: any) {
      setError('Failed to retrieve status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header pageTitle="Application Status" />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-4">
          <div className="flex flex-col space-y-1">
            <h1 className="font-headline text-2xl text-primary font-bold tracking-tight">
              Application Status Tracker
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Track real-time Vidarbha 2025 grant allocations using your Reference ID.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. VDB-2025-8842 or 0x9f4a..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[16px]">
                    progress_activity
                  </span>
                ) : (
                  <span>Track</span>
                )}
              </button>
            </form>

            {/* Quick Demo Pre-sets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
              <span className="text-on-surface-variant font-medium">Try demo IDs:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('VDB-2025-8842');
                  handleSearch('VDB-2025-8842');
                }}
                className="px-2 py-0.5 rounded-md bg-surface-container text-primary hover:bg-surface-container-high font-mono transition-colors"
              >
                VDB-2025-8842 (Approved)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('VDB-2025-7193');
                  handleSearch('VDB-2025-7193');
                }}
                className="px-2 py-0.5 rounded-md bg-surface-container text-primary hover:bg-surface-container-high font-mono transition-colors"
              >
                VDB-2025-7193 (Pending)
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-xs flex items-center gap-2 border border-error/20">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <span>{error}</span>
            </div>
          )}

          {application && (
            <div className="flex flex-col space-y-4 animate-in fade-in duration-200">
              {/* Application Details Bento Card */}
              <div className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-outline-variant/20">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                      Reference Code
                    </span>
                    <span className="font-headline text-xl font-mono text-primary font-bold">
                      {application.refId}
                    </span>
                  </div>
                  <StatusBadge status={application.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-surface-container-low rounded-xl">
                    <span className="text-on-surface-variant block text-[11px]">Applicant</span>
                    <span className="font-bold text-primary text-sm truncate block mt-0.5">
                      {application.fullName}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl">
                    <span className="text-on-surface-variant block text-[11px]">Award Amount</span>
                    <span className="font-bold text-secondary text-sm truncate block mt-0.5">
                      ₹15,000 / Annual
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
                    <span className="text-on-surface-variant">College</span>
                    <span className="font-semibold text-primary text-right truncate max-w-[200px]">
                      {application.collegeName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
                    <span className="text-on-surface-variant">Course &amp; Year</span>
                    <span className="font-semibold text-primary">
                      {application.courseName} (Year {application.studyYear})
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
                    <span className="text-on-surface-variant">Nullifier Hash</span>
                    <span className="font-mono text-[10px] text-primary bg-surface-container px-2 py-0.5 rounded truncate max-w-[150px]">
                      {application.nullifierHash}
                    </span>
                  </div>
                </div>

                {/* Volunteer Notes if Reviewed */}
                {application.volunteerNotes && (
                  <div className="p-3.5 bg-secondary-container/40 rounded-xl border border-secondary/30 space-y-1 text-xs">
                    <span className="font-bold text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">rate_review</span>
                      Volunteer Reviewer Note:
                    </span>
                    <p className="text-on-surface-variant italic leading-relaxed">
                      &ldquo;{application.volunteerNotes}&rdquo;
                    </p>
                    {application.reviewedBy && (
                      <span className="text-[10px] text-secondary font-bold block pt-1">
                        — Reviewed by {application.reviewedBy}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Progress Stepper Stages */}
              <div className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-xs space-y-3">
                <h3 className="font-headline text-sm font-bold text-primary">
                  Allocation Milestones
                </h3>

                <div className="space-y-3 pl-1 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">ZK Proof Verified</span>
                      <span className="text-on-surface-variant text-[11px]">
                        Certified on client device via Anon Aadhaar SNARK.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5 ${
                        application.status === 'APPROVED' || application.status === 'DISBURSED'
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-amber-400 text-amber-950 animate-pulse'
                      }`}
                    >
                      {application.status === 'APPROVED' || application.status === 'DISBURSED' ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      ) : (
                        '2'
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">Volunteer Quorum Evaluation</span>
                      <span className="text-on-surface-variant text-[11px]">
                        {application.status === 'APPROVED'
                          ? 'Approved by Vidarbha Education Committee.'
                          : 'In queue for mentor review.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5 ${
                        application.status === 'DISBURSED'
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container-high text-outline'
                      }`}
                    >
                      3
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">Direct Bank Transfer (₹15,000)</span>
                      <span className="text-on-surface-variant text-[11px]">
                        {application.status === 'APPROVED'
                          ? 'Scheduled for direct benefit transfer to verified account.'
                          : 'Pending final review quorum.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading application status...</div>}>
      <StatusContent />
    </Suspense>
  );
}
