import { describe, it, expect } from 'vitest';
import {
  deriveNullifierHash,
  generateClientZkProof,
  verifyZkProof,
  VIDARBHA_DISTRICTS,
  GRANT_CYCLE_SALT,
  CURRENT_CYCLE_ID,
} from '../lib/zk-proof';

describe('Anon Aadhaar ZK Proof & Nullifier Engine', () => {
  // Test 2: Fixed server-side nullifier seed
  it('should use fixed server-side nullifier seed (GRANT_CYCLE_SALT) for deterministic hashing', () => {
    expect(GRANT_CYCLE_SALT).toBe('vidarbha-grant-cycle-14-2025');
    const seed = 'test-aadhaar-qr-payload-1234';
    const hash1 = deriveNullifierHash(seed);
    const hash2 = deriveNullifierHash(seed, GRANT_CYCLE_SALT);

    expect(hash1).toBe(hash2);
    expect(hash1.startsWith('0x')).toBe(true);
    expect(hash1.length).toBe(66);
  });

  // Test 7: Genuine Anon Aadhaar proof generation in the applicant flow
  it('should generate genuine Anon Aadhaar Groth16 proof coordinates with protocol and public signals', () => {
    const proofPayload = generateClientZkProof({
      rawQrPayload: 'UIDAI_SAMPLE_QR_NAGPUR_2004',
      applicantDistrict: 'Nagpur',
      age: 20,
    });

    expect(proofPayload.nullifier).toBeDefined();
    expect(proofPayload.proof.protocol).toBe('groth16');
    expect(proofPayload.proof.pi_a).toHaveLength(3);
    expect(proofPayload.proof.pi_b).toHaveLength(2);
    expect(proofPayload.proof.pi_c).toHaveLength(3);
    expect(proofPayload.publicSignals).toHaveLength(5);
  });

  // Test 4: Proof-derived eligibility
  it('should derive eligibility directly from the cryptographic proof claims', () => {
    const validProof = generateClientZkProof({
      rawQrPayload: 'UIDAI_SAMPLE_QR_NAGPUR_2004',
      applicantDistrict: 'Nagpur',
      age: 20,
    });

    const verification = verifyZkProof(validProof);
    expect(verification.isValid).toBe(true);

    // Underage
    const underAgeProof = generateClientZkProof({
      rawQrPayload: 'UIDAI_SAMPLE_QR_UNDERAGE',
      applicantDistrict: 'Nagpur',
      age: 16,
    });
    expect(verifyZkProof(underAgeProof).isValid).toBe(false);

    // Non-Vidarbha
    const outsideVidarbhaProof = generateClientZkProof({
      rawQrPayload: 'UIDAI_SAMPLE_QR_PUNE',
      applicantDistrict: 'Pune',
      age: 20,
    });
    expect(verifyZkProof(outsideVidarbhaProof).isValid).toBe(false);
  });

  // Test 5: Application-specific signal binding
  it('should enforce application-specific signal binding to active cycle ID', () => {
    const validProof = generateClientZkProof({
      rawQrPayload: 'UIDAI_SAMPLE_QR_NAGPUR_2004',
      applicantDistrict: 'Nagpur',
      age: 20,
    });

    // Valid cycle ID '14'
    expect(verifyZkProof(validProof, '14').isValid).toBe(true);

    // Replayed to different cycle ID '15' -> Must fail signal binding
    const invalidCycleCheck = verifyZkProof(validProof, '15');
    expect(invalidCycleCheck.isValid).toBe(false);
    expect(invalidCycleCheck.reason).toContain('Signal binding mismatch');
  });

  it('should recognize all 11 Vidarbha districts', () => {
    expect(VIDARBHA_DISTRICTS).toContain('Nagpur');
    expect(VIDARBHA_DISTRICTS).toContain('Amravati');
    expect(VIDARBHA_DISTRICTS).toContain('Wardha');
    expect(VIDARBHA_DISTRICTS).toContain('Chandrapur');
    expect(VIDARBHA_DISTRICTS).toHaveLength(11);
  });
});
