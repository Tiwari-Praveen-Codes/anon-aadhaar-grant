import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function deriveSeedNullifier(seed: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(`vidarbha-grant-cycle-14-2025:${seed}:zkp-nullifier-domain`);
  return '0x' + hash.digest('hex');
}

async function main() {
  console.log('🌱 Seeding Sovereign Grant Database for Vidarbha Grant 2025...');

  // Clean existing records if any
  await prisma.zkVerificationAudit.deleteMany({});
  await prisma.grantApplication.deleteMany({});
  await prisma.grantCycle.deleteMany({});
  await prisma.volunteer.deleteMany({});

  // 1. Create Grant Cycle #14
  const cycle = await prisma.grantCycle.create({
    data: {
      cycleNumber: 14,
      title: 'Nagpur & Vidarbha First-Generation Cohort',
      year: 2025,
      amountPerAward: 15000,
      targetSlots: 60,
      allocatedSlots: 12,
      isActive: true,
      deadline: new Date('2025-02-15T23:59:59Z'),
    },
  });

  // 2. Create Volunteers
  await prisma.volunteer.createMany({
    data: [
      {
        id: 'vol-kavita-1',
        name: 'Kavita Deshmukh',
        email: 'kavita.deshmukh@vidarbhagrants.org',
        role: 'Lead Grant Mentor & Reviewer',
        division: 'Nagpur Initiative',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAsKcqj4p-4k2gSnaTbocOzlzoGCXGdWzu19JhZyZKPdhuGy66TRHh5i72rGe6zbf83Wjc-db8-HIC0oNpkZ08K41BFVWAztwnxeUA4XUMl3r28aFA5VBHdf9-GFbzWxq8re7c8NQfhfdXa3hPlVvYUYlIxz061bwG-zStErcQLpcgHYzkXa8GqKsfBuiQg3iexMg1IY9MjRtXdeI2o_YFe6svCy6EeG1UyV6uqNJkjU5nsJk1oTCD2Zw',
      },
      {
        id: 'vol-patil-2',
        name: 'Dr. Rajeshwar Patil',
        email: 'rajeshwar.patil@vidarbhagrants.org',
        role: 'Academic Verification Officer',
        division: 'Amravati Division',
      },
    ],
  });

  // 3. Create Seed Applications
  const applications = [
    {
      refId: 'VDB-2025-8842',
      nullifierHash: deriveSeedNullifier('student-ananya-wankhede-seed-01'),
      proofValidity: 'Groth16_Verified',
      cycleId: 14,
      fullName: 'Ananya Suresh Wankhede',
      email: 'ananya.wankhede@gcoen.ac.in',
      mobile: '9823456712',
      collegeName: 'Government College of Engineering, Nagpur (GCOEN)',
      collegeCode: 'GCOEN',
      courseName: 'B.Tech Electrical Engineering',
      studyYear: 2,
      grantReason:
        'Assistance for semester tuition fee and academic reference materials. I travel 38 km daily from Katol to Nagpur for college.',
      documentName: 'Bonafide_Cert_GCOEN_2025.pdf',
      documentUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Ikzry8RFPsBYhEQiQERWCaNe_E-EjRJJxnoq3fC496cQ_TWzMJ-iJm9fNqhlLOC41X-AdIC0ZKN-b9mebxQzzg2mi--YszKKF6XyDU12X3Zt1Wun46Rl6ANd4VpvGH3diwtK3qgTq0o9qG5Iv6s6xa8j9eLQOkaa1b8nEEjM2MV0wSnwlno5cOvJw8if7sPygDiN9CIVl7Nyw6StOnLpihwgeB1wEU9p4mqigJWAAs0gi_7w_3taYA',
      documentSize: '1.4 MB',
      status: 'APPROVED',
      volunteerNotes:
        'Confirmed enrollment with GCOEN electrical department registry. First generation college student from Katol.',
      reviewedBy: 'Kavita Deshmukh',
      reviewedAt: new Date('2025-01-20T10:30:00Z'),
      disbursementAccount: 'ananya@oksbi',
    },
    {
      refId: 'VDB-2025-7193',
      nullifierHash: deriveSeedNullifier('student-pranav-raut-seed-02'),
      proofValidity: 'Groth16_Verified',
      cycleId: 14,
      fullName: 'Pranav Mangesh Raut',
      email: 'pranav.raut@vnit.ac.in',
      mobile: '9765432101',
      collegeName: 'Visvesvaraya National Institute of Technology (VNIT)',
      collegeCode: 'VNIT',
      courseName: 'B.Tech Metallurgy & Materials',
      studyYear: 3,
      grantReason:
        'Need support for hostel mess charges and specialized metallurgy textbooks.',
      documentName: 'VNIT_FeeReceipt_Sem5.pdf',
      documentUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Ikzry8RFPsBYhEQiQERWCaNe_E-EjRJJxnoq3fC496cQ_TWzMJ-iJm9fNqhlLOC41X-AdIC0ZKN-b9mebxQzzg2mi--YszKKF6XyDU12X3Zt1Wun46Rl6ANd4VpvGH3diwtK3qgTq0o9qG5Iv6s6xa8j9eLQOkaa1b8nEEjM2MV0wSnwlno5cOvJw8if7sPygDiN9CIVl7Nyw6StOnLpihwgeB1wEU9p4mqigJWAAs0gi_7w_3taYA',
      documentSize: '890 KB',
      status: 'PENDING_REVIEW',
      volunteerNotes: null,
      reviewedBy: null,
      reviewedAt: null,
      disbursementAccount: '9765432101@paytm',
    },
    {
      refId: 'VDB-2025-5421',
      nullifierHash: deriveSeedNullifier('student-shreya-khobragade-seed-03'),
      proofValidity: 'Groth16_Verified',
      cycleId: 14,
      fullName: 'Shreya Vinod Khobragade',
      email: 'shreya.k@rknec.edu',
      mobile: '9890123456',
      collegeName: 'Shri Ramdeobaba College of Engg & Management (RCOEM)',
      collegeCode: 'RCOEM',
      courseName: 'B.Tech Information Technology',
      studyYear: 1,
      grantReason:
        'First generation girl student from Bhandara district. Family works in handloom weaving. Grant will cover bus pass and laptop fund.',
      documentName: 'Bonafide_RCOEM_Shreya.pdf',
      documentUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Ikzry8RFPsBYhEQiQERWCaNe_E-EjRJJxnoq3fC496cQ_TWzMJ-iJm9fNqhlLOC41X-AdIC0ZKN-b9mebxQzzg2mi--YszKKF6XyDU12X3Zt1Wun46Rl6ANd4VpvGH3diwtK3qgTq0o9qG5Iv6s6xa8j9eLQOkaa1b8nEEjM2MV0wSnwlno5cOvJw8if7sPygDiN9CIVl7Nyw6StOnLpihwgeB1wEU9p4mqigJWAAs0gi_7w_3taYA',
      documentSize: '2.1 MB',
      status: 'PENDING_REVIEW',
      volunteerNotes: null,
      reviewedBy: null,
      reviewedAt: null,
      disbursementAccount: 'shreya.khobragade@icici',
    },
    {
      refId: 'VDB-2025-3910',
      nullifierHash: deriveSeedNullifier('student-tanmay-borkar-seed-04'),
      proofValidity: 'Groth16_Verified',
      cycleId: 14,
      fullName: 'Tanmay Ramesh Borkar',
      email: 'tanmay.borkar@gpn.ac.in',
      mobile: '9422114477',
      collegeName: 'Government Polytechnic, Sadar Nagpur',
      collegeCode: 'GPN',
      courseName: 'Diploma in Civil Engineering',
      studyYear: 2,
      grantReason:
        'Assistance needed for surveying kit, drawing instruments, and daily bus commute from Kamptee.',
      documentName: 'GPN_Bonafide_2025.pdf',
      documentSize: '1.1 MB',
      status: 'PENDING_REVIEW',
      volunteerNotes: null,
      reviewedBy: null,
      reviewedAt: null,
      disbursementAccount: '9422114477@upi',
    },
    {
      refId: 'VDB-2025-1082',
      nullifierHash: deriveSeedNullifier('UIDAI_SECURE_QR_V2_ENCLAVE_DUPLICATE_NULLIFIER_RECORD_2025'),
      proofValidity: 'Groth16_Verified',
      cycleId: 14,
      fullName: 'Gaurav Ashok Ingle',
      email: 'gaurav.ingle@pdkv.ac.in',
      mobile: '9834567890',
      collegeName: 'Dr. Panjabrao Deshmukh Krishi Vidyapeeth, Akola',
      collegeCode: 'PDKV',
      courseName: 'B.Sc Agriculture',
      studyYear: 3,
      grantReason: 'Support for farm equipment practicals and semester exam registration.',
      documentName: 'PDKV_Registration.pdf',
      documentSize: '950 KB',
      status: 'APPROVED',
      volunteerNotes: 'Approved during quorum review #3.',
      reviewedBy: 'Dr. Rajeshwar Patil',
      reviewedAt: new Date('2025-01-18T14:00:00Z'),
      disbursementAccount: 'gaurav.ingle@ybl',
    },
  ];

  for (const app of applications) {
    await prisma.grantApplication.create({
      data: app,
    });
    // Create audit log
    await prisma.zkVerificationAudit.create({
      data: {
        nullifierHash: app.nullifierHash,
        proofType: 'AnonAadhaar_SNARK_Groth16',
        circuitClaim: 'Age >= 18 & District = Vidarbha',
        isVerified: true,
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
