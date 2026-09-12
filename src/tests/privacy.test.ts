import { describe, it, expect } from 'vitest';
import { Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';

describe('Privacy Invariant Verification (Zero Raw ID Storage & No Secrets)', () => {
  // Test 6: Absence of raw Aadhaar data from all tracked code paths
  it('should verify that GrantApplication schema contains zero Aadhaar number or biometric fields', () => {
    const fields = Object.values(Prisma.GrantApplicationScalarFieldEnum);

    expect(fields).not.toContain('aadhaarNumber');
    expect(fields).not.toContain('aadhaar');
    expect(fields).not.toContain('uidaiNumber');
    expect(fields).not.toContain('rawAadhaar');
    expect(fields).not.toContain('biometricHash');
    expect(fields).not.toContain('fingerprint');
    expect(fields).not.toContain('iris');

    expect(fields).toContain('nullifierHash');
    expect(fields).toContain('proofValidity');
    expect(fields).toContain('refId');
    expect(fields).toContain('fullName');
    expect(fields).toContain('collegeName');
  });

  it('should verify that ZkVerificationAudit only records nullifier hashes and boolean status', () => {
    const auditFields = Object.values(Prisma.ZkVerificationAuditScalarFieldEnum);

    expect(auditFields).toContain('nullifierHash');
    expect(auditFields).toContain('isVerified');
    expect(auditFields).not.toContain('aadhaarNumber');
  });

  // Test 8: Absence of credentials / secrets in tracked code
  it('should verify absence of hardcoded API secrets, private keys, or passwords across source code', () => {
    const srcDir = path.resolve(__dirname, '../');
    const filesToScan: string[] = [];

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
          scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          filesToScan.push(fullPath);
        }
      }
    }

    scanDir(srcDir);

    const secretPatterns = [
      /BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY/,
      /AIza[0-9A-Za-z-_]{35}/,
      /ghp_[0-9a-zA-Z]{36}/,
      /sk_live_[0-9a-zA-Z]{24}/,
      /password\s*=\s*['"][^'"]{8,}['"]/i,
    ];

    for (const file of filesToScan) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const pattern of secretPatterns) {
        expect(pattern.test(content)).toBe(false);
      }
    }
  });
});
