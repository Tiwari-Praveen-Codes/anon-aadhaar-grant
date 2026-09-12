import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyZkProof } from '@/lib/zk-proof';
import { ZkProofPayload } from '@/lib/types';

// POST /api/verify-proof - Verify ZK proof and check duplicate nullifier in SQLite DB
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const zkPayload = body.zkProof as ZkProofPayload;

    if (!zkPayload) {
      return NextResponse.json(
        { success: false, error: 'No ZK proof payload supplied' },
        { status: 400 }
      );
    }

    const verificationResult = verifyZkProof(zkPayload);

    if (!verificationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'PROOF_VERIFICATION_FAILED',
          reason: verificationResult.reason,
        },
        { status: 422 }
      );
    }

    // Check if this nullifier has already been used in this grant cycle
    const existing = await prisma.grantApplication.findUnique({
      where: { nullifierHash: zkPayload.nullifier },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        isValid: true,
        isDuplicate: true,
        nullifierHash: zkPayload.nullifier,
        existingRefId: existing.refId,
        message: 'Valid ZK Proof, but nullifier hash was already claimed for Vidarbha Grant 2025 cohort.',
      });
    }

    return NextResponse.json({
      success: true,
      isValid: true,
      isDuplicate: false,
      nullifierHash: zkPayload.nullifier,
      circuitClaim: 'Age >= 18 & District = Vidarbha',
      message: 'Zero-Knowledge Proof verified successfully. Nullifier is available for allocation.',
    });
  } catch (error: any) {
    console.error('Error in proof verification:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal verification error' },
      { status: 500 }
    );
  }
}
