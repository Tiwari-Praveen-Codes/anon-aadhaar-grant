'use client';

import React from 'react';

interface ZkVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZkVerificationModal: React.FC<ZkVerificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-5 shadow-2xl flex flex-col space-y-4 border border-outline-variant/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              auto_awesome
            </span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              How ZKP Works
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Zero-Knowledge cryptography allows your phone&apos;s WebAssembly engine to construct a mathematical proof stating:{' '}
          <em className="text-on-surface font-medium">
            &ldquo;This applicant is a verified resident of Vidarbha aged 18+&rdquo;
          </em>{' '}
          without ever revealing your identity or your 12-digit UIDAI number.
        </p>

        <div className="p-3.5 bg-surface-container-low rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-[24px] flex-shrink-0 mt-0.5">
            verified
          </span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-primary font-bold">
              Math replaces surveillance
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              Your credentials never leave client RAM. The grant office only receives a cryptographic boolean attestation and an anti-double-claim nullifier.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-surface-container flex flex-col">
            <span className="font-semibold text-primary">UIDAI RSA Key</span>
            <span className="text-on-surface-variant mt-0.5">Checked locally in browser</span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-container flex flex-col">
            <span className="font-semibold text-secondary">Anti-Double Spend</span>
            <span className="text-on-surface-variant mt-0.5">SHA-256 Nullifier Hash</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-colors shadow-sm"
        >
          Understood &amp; Return
        </button>
      </div>
    </div>
  );
};
