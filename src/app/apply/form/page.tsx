'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { SAMPLE_AADHAAR_PROFILES } from '@/lib/zk-proof';

export default function ApplicationFormPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('Pooja Rameshwar Deshmukh');
  const [email, setEmail] = useState('pooja.deshmukh24@gcoen.ac.in');
  const [mobile, setMobile] = useState('9823456712');
  const [collegeCode, setCollegeCode] = useState('GCOEN');
  const [collegeName, setCollegeName] = useState('Government College of Engineering, Nagpur (GCOEN)');
  const [courseName, setCourseName] = useState('B.Tech Electrical Engg.');
  const [studyYear, setStudyYear] = useState(3);
  const [grantReason, setGrantReason] = useState(
    'I travel 38 km daily from Katol to Nagpur for college. This grant will directly cover my semester bus concession pass and essential reference textbooks for power systems analysis.'
  );
  const [documentAttached, setDocumentAttached] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from session storage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = sessionStorage.getItem('selected_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          setFullName(p.name || fullName);
          setEmail(p.email || email);
          setMobile(p.mobile || mobile);
          setCollegeName(p.collegeName || collegeName);
          setCollegeCode(p.collegeCode || collegeCode);
          setCourseName(p.courseName || courseName);
          setStudyYear(p.studyYear || studyYear);
        } catch (e) {}
      }
    }
  }, []);

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCollegeCode(val);
    const names: Record<string, string> = {
      GCOEN: 'Government College of Engineering, Nagpur (GCOEN)',
      GPN: 'Government Polytechnic, Sadar Nagpur',
      RCOEM: 'Shri Ramdeobaba College of Engg & Management (RCOEM)',
      VNIT: 'Visvesvaraya National Institute of Technology (VNIT)',
      PDKV: 'Dr. Panjabrao Deshmukh Krishi Vidyapeeth, Akola',
      OTHER: 'Other Vidarbha Accredited University / College',
    };
    setCollegeName(names[val] || val);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      fullName,
      email,
      mobile,
      collegeCode,
      collegeName,
      courseName,
      studyYear,
      grantReason,
      documentName: documentAttached ? 'Bonafide_Cert_GCOEN_2025.pdf' : null,
      documentSize: documentAttached ? '1.4 MB' : null,
      documentUrl: documentAttached
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Ikzry8RFPsBYhEQiQERWCaNe_E-EjRJJxnoq3fC496cQ_TWzMJ-iJm9fNqhlLOC41X-AdIC0ZKN-b9mebxQzzg2mi--YszKKF6XyDU12X3Zt1Wun46Rl6ANd4VpvGH3diwtK3qgTq0o9qG5Iv6s6xa8j9eLQOkaa1b8nEEjM2MV0wSnwlno5cOvJw8if7sPygDiN9CIVl7Nyw6StOnLpihwgeB1wEU9p4mqigJWAAs0gi_7w_3taYA'
        : null,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('student_form_data', JSON.stringify(formData));
    }

    setTimeout(() => {
      router.push('/apply/review');
    }, 500);
  };

  return (
    <>
      <Header pageTitle="Application Form" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-xl mx-auto space-y-4">
          {/* Privacy Proof Micro-Ticker Pill */}
          <div className="px-4 py-2.5 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/30 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span className="font-label-sm text-xs text-secondary tracking-wide uppercase font-semibold">
                Client-Side Enclave Active
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary-container px-2.5 py-0.5 rounded-full text-on-secondary-container">
              <span className="material-symbols-outlined text-[14px] material-symbols-filled text-secondary">
                verified_user
              </span>
              <span className="font-label-sm text-[11px] font-bold">Proof #ZK-7894-VID</span>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-xs text-on-surface-variant font-semibold">
                Step 2 of 3
              </span>
              <span className="font-label-sm text-xs text-secondary font-bold">
                Identity Detached &amp; Verified
              </span>
            </div>

            {/* Stepper Track */}
            <div className="grid grid-cols-3 gap-2 relative items-center">
              {/* Step 1 Done */}
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-full rounded-full bg-secondary"></div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[14px] material-symbols-filled">
                    check_circle
                  </span>
                  <span className="font-label-sm text-xs text-on-surface font-semibold truncate">
                    ZK Proof
                  </span>
                </div>
              </div>

              {/* Step 2 Active */}
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-full rounded-full bg-primary"></div>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center text-on-primary text-[9px] font-bold">
                    2
                  </span>
                  <span className="font-label-sm text-xs text-primary font-bold truncate">
                    Student Info
                  </span>
                </div>
              </div>

              {/* Step 3 Pending */}
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-full rounded-full bg-surface-container"></div>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-outline-variant flex items-center justify-center text-surface-container-lowest text-[9px]">
                    3
                  </span>
                  <span className="font-label-sm text-xs text-outline font-medium truncate">
                    Submit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badge Card */}
          <div className="bg-secondary-container text-on-secondary-container p-4 rounded-2xl shadow-xs flex items-start gap-3 relative overflow-hidden border border-secondary/30">
            <div className="w-10 h-10 rounded-xl bg-on-secondary flex items-center justify-center flex-shrink-0 shadow-xs text-secondary">
              <span className="material-symbols-outlined text-[24px] material-symbols-filled">
                verified
              </span>
            </div>
            <div className="flex flex-col min-w-0 pr-2">
              <span className="font-headline text-base font-bold leading-tight text-on-secondary-fixed-variant">
                Eligibility Verified
              </span>
              <p className="font-body-sm text-xs text-on-secondary-container mt-0.5 leading-relaxed">
                Zero-Knowledge Proof successfully certified resident &amp; age criteria in local browser memory.
              </p>
            </div>
          </div>

          {/* Notice Banner: Aadhaar Zero Storage Pledge */}
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/30 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">no_accounts</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-lg text-xs font-bold text-primary">
                Your Aadhaar number is NEVER requested
              </span>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                We never ask for, process, or retain your 12-digit UIDAI number. The academic grant team receives solely your enrollment claims and disbursement wallet token.
              </p>
            </div>
          </div>

          {/* Grant Applicant Profile Section Form */}
          <form onSubmit={handleContinue} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div>
                <h2 className="font-headline text-lg text-primary font-bold">
                  Academic &amp; Personal Details
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Used solely by Vidarbha Trust reviewers to award funds.
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">school</span>
              </div>
            </div>

            {/* Input: Full Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="fullName" className="text-xs font-semibold text-on-surface flex items-center gap-1">
                Full Name <span className="text-secondary font-normal">(As on College ID)</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                  badge
                </span>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Pooja R. Deshmukh"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Input: Email Address */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-semibold text-on-surface">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institute.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Input: Mobile / WhatsApp */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="mobile" className="text-xs font-semibold text-on-surface">
                  WhatsApp / Mobile
                </label>
                <span className="text-[11px] text-on-surface-variant">Disbursement status alerts only</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                  chat
                </span>
                <span className="absolute left-10 text-on-surface-variant text-sm font-semibold pl-1 select-none">
                  +91
                </span>
                <input
                  id="mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-20 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Input: College Selection */}
            <div className="flex flex-col gap-1">
              <label htmlFor="college" className="text-xs font-semibold text-on-surface">
                College / Institution
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                  account_balance
                </span>
                <select
                  id="college"
                  value={collegeCode}
                  onChange={handleCollegeChange}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none appearance-none transition-all"
                >
                  <option value="GCOEN">Government College of Engineering, Nagpur (GCOEN)</option>
                  <option value="GPN">Government Polytechnic, Sadar Nagpur</option>
                  <option value="RCOEM">Shri Ramdeobaba College of Engg &amp; Management (RCOEM)</option>
                  <option value="VNIT">Visvesvaraya National Institute of Technology (VNIT)</option>
                  <option value="PDKV">Dr. Panjabrao Deshmukh Krishi Vidyapeeth, Akola</option>
                  <option value="OTHER">Other Vidarbha Accredited University / College</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Input: Course & Year Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="course" className="text-xs font-semibold text-on-surface">
                  Course &amp; Branch
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    menu_book
                  </span>
                  <input
                    id="course"
                    type="text"
                    required
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. B.Sc Agriculture"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="year" className="text-xs font-semibold text-on-surface">
                  Current Academic Year
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    event_note
                  </span>
                  <select
                    id="year"
                    value={studyYear}
                    onChange={(e) => setStudyYear(parseInt(e.target.value))}
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none appearance-none transition-all"
                  >
                    <option value={1}>1st Year (Fresher)</option>
                    <option value={2}>2nd Year (Sophomore)</option>
                    <option value={3}>3rd Year (Pre-Final)</option>
                    <option value={4}>4th Year (Final Year)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Input: Statement of Need */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="reason" className="text-xs font-semibold text-on-surface">
                  Why do you need this grant?
                </label>
                <span className="text-xs font-bold text-secondary">Grant pool: ₹15,000</span>
              </div>
              <textarea
                id="reason"
                rows={4}
                required
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                maxLength={500}
                placeholder="Describe how this ₹15,000 will assist your tuition, hostel, bus pass, or laboratory textbook expenses..."
                className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all resize-none leading-relaxed"
              />
              <div className="flex justify-between items-center px-1 text-[11px] text-on-surface-variant">
                <span>Reviewers prefer brief, practical details.</span>
                <span className={grantReason.length > 450 ? 'text-error font-bold' : ''}>
                  {grantReason.length} / 500
                </span>
              </div>
            </div>

            {/* Supporting Document Card */}
            <div className="flex flex-col gap-2 pt-1 border-t border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">
                  Supporting Verification Document
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Upload College Bonafide, Current Semester Fee Receipt, or Department HOD Note.
              </p>

              {documentAttached ? (
                <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between gap-3 border border-outline-variant/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                      <span className="material-symbols-outlined text-[24px]">description</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-on-surface truncate">
                        Bonafide_Cert_GCOEN_2025.pdf
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                        <span className="text-secondary font-bold">1.4 MB</span>
                        <span className="text-outline">•</span>
                        <span className="text-on-surface-variant flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px] text-secondary">
                            check
                          </span>
                          Ready
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocumentAttached(false)}
                    aria-label="Remove document"
                    className="w-8 h-8 rounded-full bg-surface-container hover:bg-error-container hover:text-error flex items-center justify-center text-outline transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDocumentAttached(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-dashed border-outline/40"
                >
                  <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                  <span>Attach Document (Max 5MB)</span>
                </button>
              )}
            </div>

            {/* Decoupled Privacy Sandbox Micro-Explainer */}
            <div className="bg-surface-container-low p-3.5 rounded-xl flex items-start gap-3 border border-outline-variant/20">
              <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-[16px]">lock_clock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs text-primary font-bold">
                  Decoupled Privacy Sandbox
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  This academic profile is shared strictly with grant reviewers for disbursement determination. It is structurally detached from your cryptographic proof, ensuring zero trace back to national biometric registries.
                </p>
              </div>
            </div>

            {/* Sticky Submit Button */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all disabled:opacity-80"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">
                      progress_activity
                    </span>
                    <span>Assembling Privacy Manifest...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Review &amp; Submit</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-center text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-secondary">security</span>
                <span>End-to-End Encrypted Peer Review Payload</span>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
