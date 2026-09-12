'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';

export default function VolunteerDashboardPage() {
  const [stats, setStats] = useState<any>({
    cycleNumber: 14,
    cycleName: 'Nagpur & Vidarbha First-Generation Cohort',
    amountPerAward: 15000,
    targetSlots: 60,
    allocatedSlots: 12,
    remainingSlots: 48,
    totalApplications: 5,
    pendingReviewCount: 89,
    verifiedProofsCount: 137,
    duplicatesBlockedCount: 23,
    remainingDays: 19,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const progressPercentage = Math.round(
    (stats.allocatedSlots / (stats.targetSlots || 60)) * 100
  );

  return (
    <>
      <Header pageTitle="Volunteer Portal" />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-4">
          {/* Top Context Header & Volunteer Welcome */}
          <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary text-xl font-bold shadow-xs">
                  KD
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-secondary rounded-full flex items-center justify-center border-2 border-surface">
                  <span className="material-symbols-outlined text-on-secondary text-[10px]">
                    check
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-bold">
                    Vidarbha Grant 2025
                  </span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                    Volunteer Mentor
                  </span>
                </div>
                <div className="font-headline text-base sm:text-lg font-bold text-on-surface flex items-center gap-1">
                  Namaste, Kavita
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    verified
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/volunteer/queue"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface border border-outline-variant/30"
              title="Open Queue"
            >
              <span className="material-symbols-outlined text-[20px]">inbox</span>
            </Link>
          </div>

          {/* Active Cycle Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-primary text-on-primary p-5 shadow-md">
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1 max-w-[82%]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  Cycle #{stats.cycleNumber} Active
                </div>
                <h2 className="font-headline text-lg sm:text-xl text-on-primary font-bold leading-tight">
                  {stats.cycleName}
                </h2>
                <p className="font-body-sm text-xs text-primary-fixed flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  Active until 15 Feb 2025 • {stats.remainingDays} days remaining
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-primary-fixed">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-1.5">
              <div className="flex justify-between font-label-sm text-xs text-primary-fixed">
                <span>Target: {stats.targetSlots} Slots</span>
                <span className="font-bold text-on-primary">
                  {stats.allocatedSlots} Allocated ({progressPercentage}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-secondary-container rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, progressPercentage)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Privacy Assurance Bar */}
          <div className="rounded-2xl bg-tertiary-fixed p-4 shadow-xs flex items-start gap-3 border border-secondary/20">
            <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center flex-shrink-0 text-secondary shadow-xs">
              <span className="material-symbols-outlined text-[22px] material-symbols-filled">
                shield
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-xs text-on-tertiary-fixed font-bold tracking-tight">
                  ZK Cryptographic Sovereignty
                </span>
                <span className="font-label-sm text-[10px] px-1.5 py-0.2 rounded bg-secondary text-on-secondary uppercase font-bold">
                  Zero-Leak
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-tertiary-fixed-variant leading-snug">
                All {stats.verifiedProofsCount} applicants verified via client-side Anon Aadhaar SNARKs. 0 Aadhaar numbers saved in database.
              </p>
            </div>
          </div>

          {/* Key KPI Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Review Queue Priority */}
            <div className="col-span-2 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                  <span className="font-label-sm text-[11px] font-bold uppercase text-error">
                    Requires Attention
                  </span>
                </div>
                <div className="font-headline text-3xl text-on-surface font-bold leading-none">
                  {stats.pendingReviewCount}
                </div>
                <div className="font-body-sm text-xs text-on-surface-variant">
                  Awaiting Review • <span className="text-on-surface font-bold">Volunteer Quorum</span>
                </div>
              </div>
              <Link
                href="/volunteer/queue"
                className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-lg text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
              >
                <span>Open Queue</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {/* Card 2: Verified Applications */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-secondary">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span className="font-label-sm text-[10px] bg-secondary-container text-on-secondary-fixed-variant px-1.5 py-0.5 rounded font-bold">
                  ZK Valid
                </span>
              </div>
              <div className="font-headline text-2xl text-on-surface font-bold">
                {stats.verifiedProofsCount}
              </div>
              <div className="font-label-md text-xs text-on-surface-variant font-medium leading-tight">
                Verified Proofs
              </div>
              <div className="font-label-sm text-[10px] text-secondary font-bold">
                Anon Aadhaar SNARKs
              </div>
            </div>

            {/* Card 3: Duplicates Blocked */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] text-error">gpp_maybe</span>
                <span className="font-label-sm text-[10px] bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-bold">
                  Nullifier
                </span>
              </div>
              <div className="font-headline text-2xl text-on-surface font-bold">
                {stats.duplicatesBlockedCount}
              </div>
              <div className="font-label-md text-xs text-on-surface-variant font-medium leading-tight">
                Duplicates Blocked
              </div>
              <div className="font-label-sm text-[10px] text-on-surface-variant">
                Zero ID data stored
              </div>
            </div>

            {/* Card 4: Target Slots */}
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant font-bold">
                  Cycle Cap
                </span>
              </div>
              <div className="font-headline text-2xl text-on-surface font-bold">
                {stats.targetSlots}
              </div>
              <div className="font-label-md text-xs text-on-surface-variant leading-tight">
                Target Grant Slots
              </div>
              <div className="font-label-sm text-[10px] text-on-surface-variant">
                ₹15,000 allowance/award
              </div>
            </div>

            {/* Card 5: Available Capacity */}
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-secondary">
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                <span className="font-label-sm text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded font-bold">
                  Remaining
                </span>
              </div>
              <div className="font-headline text-2xl text-secondary font-bold">
                {stats.remainingSlots}
              </div>
              <div className="font-label-md text-xs text-on-surface-variant leading-tight">
                Available Capacity
              </div>
              <div className="font-label-sm text-[10px] text-secondary font-bold">
                80% unallocated
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="pt-2 flex flex-col space-y-2">
            <Link
              href="/volunteer/queue"
              className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center"
            >
              <span className="material-symbols-outlined text-[20px]">assignment</span>
              <span>Review Applicant Queue</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
