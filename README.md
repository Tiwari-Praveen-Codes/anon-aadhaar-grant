# Nobody Needs Your Aadhaar Number (Sovereign Grant System)
live on :- https://anon-aadhaar-grant.vercel.app/
> **Vidarbha Student Initiative 2025** — Privacy-Preserving Education Grant Platform powered by client-side Zero-Knowledge Proofs (Anon Aadhaar principles).

---

## 🌟 Overview

The **Sovereign Grant System** enables first-generation undergraduate and diploma students across Vidarbha to apply for a ₹15,000 annual education grant without ever uploading, transmitting, or storing their 12-digit Aadhaar number or biometric data.

### 🛡️ Privacy Guarantees
- **0 Bytes of Aadhaar Stored**: Client-side WebAssembly SNARK circuits verify UIDAI RSA signatures and eligibility claims directly in the applicant's browser.
- **Anti-Double Claim Nullifiers**: Enforces single-claim rules per grant cycle via one-way cryptographic nullifiers (`SHA-256(cycle_id + secret)`).
- **Decoupled Application Review**: Student profile and disbursement tokens are strictly separated from identity proofs.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom civic forest/emerald theme)
- **Zero-Knowledge Architecture**: Anon Aadhaar Groth16 SNARK prover & verifier
- **Database & ORM**: SQLite (`dev.db`) & Prisma ORM
- **Test Runner**: Vitest (12 unit & integration tests)

---

## 📦 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup SQLite Database & Seed
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
# or for production server:
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) (or your configured port).

### 4. Run Test Suite
```bash
npm test
```

---

## 🗺️ Key Routes

- `/` — Landing Page & Zero Aadhaar Storage Guarantee
- `/how-privacy-works` — Deep-Dive ZK Explainer & Live Interactive Circuit Simulator
- `/apply/verification` — Client-side QR scan and ZK-SNARK computation
- `/apply/form` — Student Academic Details & Bonafide Attachment
- `/apply/review` — Review & Submit Application with Nullifier Hash
- `/apply/duplicate` — Duplicate Nullifier Notice & Prevention
- `/apply/recovery` — Verification Recovery & Troubleshooting
- `/status` — Real-Time Application Status Tracker by Reference ID
- `/volunteer/dashboard` — Volunteer Quorum Metrics & KPI Dashboard
- `/volunteer/queue` — Filterable Applications Queue
- `/volunteer/review/[id]` — Application Review & One-Click Approval Center
