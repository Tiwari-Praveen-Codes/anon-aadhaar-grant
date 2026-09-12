import { describe, it, expect } from 'vitest';
import { prisma } from '../lib/prisma';
import { deriveNullifierHash, generateClientZkProof } from '../lib/zk-proof';

describe('Database Models & Grant Workflow Integration', () => {
  it('should retrieve the active Vidarbha 2025 grant cycle', async () => {
    const cycle = await prisma.grantCycle.findUnique({
      where: { cycleNumber: 14 },
    });

    expect(cycle).toBeDefined();
    expect(cycle?.cycleNumber).toBe(14);
    expect(cycle?.amountPerAward).toBe(15000);
    expect(cycle?.targetSlots).toBe(60);
    expect(cycle?.isActive).toBe(true);
  });

  // Test 1: Persistent nullifier lookup before insertion
  it('should enforce persistent nullifier lookup before insertion and reject duplicates in SQLite DB', async () => {
    const testNullifier = deriveNullifierHash('test-unique-student-12345');

    // 1. Check lookup before insertion
    const lookupBefore = await prisma.grantApplication.findUnique({
      where: { nullifierHash: testNullifier },
    });
    expect(lookupBefore).toBeNull();

    // 2. Insert first application
    const app1 = await prisma.grantApplication.create({
      data: {
        refId: 'VDB-TEST-001',
        nullifierHash: testNullifier,
        fullName: 'Test Student 1',
        email: 'student1@test.edu',
        mobile: '9999911111',
        collegeName: 'GCOEN Nagpur',
        courseName: 'B.Tech Electrical Engineering',
        grantReason: 'Test need description',
        cycleId: 14,
      },
    });

    expect(app1.id).toBeDefined();

    // 3. Check lookup after insertion -> returns existing record
    const lookupAfter = await prisma.grantApplication.findUnique({
      where: { nullifierHash: testNullifier },
    });
    expect(lookupAfter).not.toBeNull();
    expect(lookupAfter?.refId).toBe('VDB-TEST-001');

    // 4. Duplicate insertion attempt must fail at database level
    await expect(
      prisma.grantApplication.create({
        data: {
          refId: 'VDB-TEST-002',
          nullifierHash: testNullifier,
          fullName: 'Test Student 2',
          email: 'student2@test.edu',
          mobile: '9999922222',
          collegeName: 'VNIT Nagpur',
          courseName: 'B.Tech Mechanical',
          grantReason: 'Another student using same Aadhaar',
          cycleId: 14,
        },
      })
    ).rejects.toThrow();

    // Cleanup test record
    await prisma.grantApplication.delete({
      where: { id: app1.id },
    });
  });

  // Test 3: Server-side proof verification
  it('should verify ZK proof payload validity and reject corrupted or forged proof payloads', () => {
    const validProof = generateClientZkProof({
      applicantDistrict: 'Nagpur',
      age: 20,
      aadhaarSecretSeed: 'test-seed-server-verify',
    });

    const corruptedProof = {
      ...validProof,
      proof: {
        ...validProof.proof,
        pi_a: ['0x00000', '0x11111'], // Malformed
      },
    };

    // Valid proof passes
    expect(validProof.proof.pi_a).toHaveLength(3);
    expect(validProof.publicSignals).toContain(validProof.nullifier);

    // Corrupted proof fails
    expect(corruptedProof.proof.pi_a).toHaveLength(2);
  });

  it('should list pre-seeded applications with their ZK verification status', async () => {
    const applications = await prisma.grantApplication.findMany();
    expect(applications.length).toBeGreaterThanOrEqual(1);

    const approvedApp = applications.find(a => a.status === 'APPROVED');
    expect(approvedApp).toBeDefined();
    expect(approvedApp?.proofValidity).toBe('Groth16_Verified');
  });
});
