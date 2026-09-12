export interface GrantApplicationData {
  id?: string;
  refId?: string;
  nullifierHash: string;
  proofValidity: string;
  zkTimestamp?: string | Date;
  cycleId?: number;
  fullName: string;
  email: string;
  mobile: string;
  collegeName: string;
  collegeCode?: string;
  courseName: string;
  studyYear: number;
  grantReason: string;
  documentName?: string | null;
  documentUrl?: string | null;
  documentSize?: string | null;
  status?: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'DUPLICATE_FLAGGED';
  volunteerNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | Date | null;
  disbursementAccount?: string | null;
  createdAt?: string | Date;
}

export interface ZkProofPayload {
  nullifier: string;
  timestamp: number;
  circuit: string;
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
  };
  publicSignals: string[];
  claims: {
    isOver18: boolean;
    isVidarbhaResident: boolean;
    isEnrolledStudent: boolean;
  };
}

export interface GrantCycleStats {
  cycleNumber: number;
  cycleName: string;
  amountPerAward: number;
  targetSlots: number;
  allocatedSlots: number;
  pendingReviewCount: number;
  verifiedProofsCount: number;
  duplicatesBlockedCount: number;
  remainingDays: number;
  deadlineDate: string;
}
