import React from 'react';

interface StatusBadgeProps {
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'DUPLICATE_FLAGGED' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          Approved ✓
        </span>
      );
    case 'DISBURSED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
          <span className="material-symbols-outlined text-[14px]">payments</span>
          Aid Transferred
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-xs font-semibold">
          <span className="material-symbols-outlined text-[14px]">cancel</span>
          Not Eligible
        </span>
      );
    case 'DUPLICATE_FLAGGED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-xs font-semibold">
          <span className="material-symbols-outlined text-[14px]">gpp_maybe</span>
          Duplicate Nullifier
        </span>
      );
    case 'PENDING_REVIEW':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Pending Review
        </span>
      );
  }
};
