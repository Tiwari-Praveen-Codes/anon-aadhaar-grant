'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';

export default function VolunteerQueuePage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      let url = '/api/applications';
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  return (
    <>
      <Header pageTitle="Applications Queue" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-headline text-2xl text-primary font-bold tracking-tight">
                Volunteer Queue
              </h1>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Cycle #14 • Vidarbha District Merit Evaluation
              </p>
            </div>
            <span className="font-label-sm text-xs px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-bold">
              {applications.length} Total
            </span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, ref ID, or college..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-sm font-medium border border-outline-variant/30 focus:border-primary focus:outline-none shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              Filter
            </button>
          </form>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { label: 'All', value: 'ALL' },
              { label: 'Pending Review', value: 'PENDING_REVIEW' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Rejected', value: 'REJECTED' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  statusFilter === tab.value
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Applications List */}
          {isLoading ? (
            <div className="p-8 text-center text-on-surface-variant text-xs flex flex-col items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[24px] text-secondary">
                progress_activity
              </span>
              <span>Loading applications from SQLite database...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-center space-y-2">
              <span className="material-symbols-outlined text-outline text-[32px]">
                inbox_customize
              </span>
              <p className="text-xs text-on-surface-variant font-medium">
                No applications found for this filter.
              </p>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/volunteer/review/${app.refId}`}
                  className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container/50 border border-outline-variant/30 shadow-xs flex flex-col space-y-2.5 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-primary font-bold group-hover:text-secondary transition-colors">
                        {app.refId}
                      </span>
                      <h3 className="font-headline text-base font-bold text-on-surface mt-0.5">
                        {app.fullName}
                      </h3>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="flex flex-col text-xs text-on-surface-variant space-y-0.5">
                    <span className="font-semibold text-primary truncate">{app.collegeName}</span>
                    <span>
                      {app.courseName} • Year {app.studyYear}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface line-clamp-2 italic leading-relaxed bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
                    &ldquo;{app.grantReason}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[11px]">
                    <span className="text-secondary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      ZK-Proof Certified (0 ID Stored)
                    </span>
                    <span className="text-outline group-hover:text-primary font-semibold flex items-center gap-0.5 transition-colors">
                      Review &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
