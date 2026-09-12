'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

export default function UnifiedLoginPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'student' | 'volunteer'>('student');

  // Student Aadhaar & OTP States
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState('');
  const [phoneMask, setPhoneMask] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Volunteer States
  const [volunteerEmail, setVolunteerEmail] = useState('kavita.deshmukh@vidarbhagrants.org');
  const [volunteerPasscode, setVolunteerPasscode] = useState('123456');

  // Common States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Format Aadhaar with spaces: "XXXX XXXX XXXX"
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 12);
    const parts = raw.match(/.{1,4}/g) || [];
    setAadhaarInput(parts.join(' '));
  };

  const fillDemoAadhaar = () => {
    setAadhaarInput('2345 6789 8842');
    setErrorMsg('');
  };

  const handleSendOtp = async () => {
    const cleanNumber = aadhaarInput.replace(/\s+/g, '');
    if (cleanNumber.length !== 12) {
      setErrorMsg('Please enter a full 12-digit Aadhaar number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/aadhaar-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_otp',
          aadhaarNumber: cleanNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate OTP');
      }

      setOtpSent(true);
      setDemoOtpCode(data.demoOtp);
      setPhoneMask(data.phoneMask);
      setCountdown(60);
      setSuccessMsg(`OTP sent to registered mobile (${data.phoneMask})`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAadhaarOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = aadhaarInput.replace(/\s+/g, '');
    const cleanOtp = otpInput.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/aadhaar-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          aadhaarNumber: cleanNumber,
          otp: cleanOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'OTP verification failed');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('sovereign_grant_user', JSON.stringify(data.user));
      }

      setSuccessMsg(`Welcome, ${data.user.name}! Redirecting to your grant status...`);

      setTimeout(() => {
        router.push(`/status?ref=${data.user.refId}`);
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolunteerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: volunteerEmail,
          passcode: volunteerPasscode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('sovereign_grant_user', JSON.stringify(data.user));
      }

      setSuccessMsg(`Authenticated as ${data.user.name}! Redirecting...`);

      setTimeout(() => {
        router.push('/volunteer/dashboard');
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header pageTitle="Sign In Portal" showBackButton />

      <main className="flex flex-col relative w-full pt-24 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-4 max-w-md mx-auto space-y-5 my-auto">
          {/* Header Branding */}
          <div className="text-center space-y-1.5">
            <div className="w-14 h-14 rounded-2xl bg-primary text-secondary-container flex items-center justify-center mx-auto shadow-md ring-4 ring-secondary/20">
              <span className="material-symbols-outlined text-[28px] material-symbols-filled">
                fingerprint
              </span>
            </div>
            <h1 className="font-headline text-2xl text-primary font-bold">
              Grant System Portal
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Vidarbha Education Grant 2025 • Student &amp; Reviewer Authentication
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex items-center p-1.5 bg-surface-container-high rounded-xl gap-1 border border-outline-variant/20">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 px-3 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'student'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Student (Aadhaar OTP)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('volunteer');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 px-3 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'volunteer'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">handshake</span>
              <span>Volunteer Reviewer</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-error-container text-on-error-container rounded-xl text-xs font-semibold flex items-center gap-2 border border-error/30 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-secondary-container text-on-secondary-fixed-variant rounded-xl text-xs font-bold flex items-center gap-2 border border-secondary/30 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: Student Login with Aadhaar & OTP */}
          {activeTab === 'student' && (
            <div className="flex flex-col space-y-4 animate-in fade-in duration-200">
              {/* Demo Helper Pill */}
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="font-semibold text-primary">Need a demo number?</span>
                <button
                  type="button"
                  onClick={fillDemoAadhaar}
                  className="px-2.5 py-1 bg-surface-container-lowest hover:bg-surface-container text-secondary font-bold rounded-lg border border-outline-variant/30 transition-colors"
                >
                  Auto-Fill Demo Aadhaar
                </button>
              </div>

              <form
                onSubmit={handleVerifyAadhaarOtp}
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4"
              >
                {/* Aadhaar Number Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-on-surface">
                      12-Digit Aadhaar Number
                    </label>
                    <span className="text-[10px] uppercase font-bold text-secondary bg-secondary-container px-1.5 py-0.5 rounded">
                      Local Enclave
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                      badge
                    </span>
                    <input
                      type="text"
                      required
                      value={aadhaarInput}
                      onChange={handleAadhaarChange}
                      placeholder="e.g. 2345 6789 8842"
                      maxLength={14}
                      className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-mono font-bold tracking-wider border border-outline-variant/30 focus:border-primary focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading || aadhaarInput.replace(/\s+/g, '').length !== 12}
                      className="absolute right-1.5 py-1.5 px-3 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
                    >
                      {otpSent ? 'Resend' : 'Get OTP'}
                    </button>
                  </div>
                  <span className="text-[11px] text-on-surface-variant block">
                    Zero raw numbers stored on server • Validated via ephemeral token
                  </span>
                </div>

                {/* Simulated SMS Alert Banner */}
                {otpSent && (
                  <div className="p-3.5 bg-tertiary-fixed rounded-xl border border-secondary/30 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-on-tertiary-fixed font-bold">
                        <span className="material-symbols-outlined text-secondary text-[16px]">
                          sms
                        </span>
                        <span>UIDAI OTP Dispatch</span>
                      </div>
                      <span className="text-[10px] text-secondary font-mono">Mobile: {phoneMask}</span>
                    </div>
                    <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-on-surface-variant">Simulated OTP:</span>
                        <span className="font-mono text-primary font-bold tracking-widest text-sm">
                          {demoOtpCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpInput(demoOtpCode)}
                        className="text-[11px] font-bold text-secondary hover:text-primary px-2 py-0.5 rounded bg-secondary-container"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Input Field */}
                {otpSent && (
                  <div className="space-y-1 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-on-surface">
                        Enter 6-Digit OTP
                      </label>
                      <span className="text-[11px] text-on-surface-variant font-mono">Demo: 123456</span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                        pin
                      </span>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        placeholder="••••••"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-base font-mono font-bold tracking-widest border border-outline-variant/30 focus:border-primary focus:outline-none text-center"
                      />
                    </div>
                  </div>
                )}

                {/* Verification Action Button */}
                <button
                  type="submit"
                  disabled={isLoading || !otpSent || otpInput.length !== 6}
                  className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-sm transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      <span>Verifying Cryptographic OTP...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      <span>Verify OTP &amp; Access Portal</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Volunteer Reviewer Login */}
          {activeTab === 'volunteer' && (
            <div className="flex flex-col space-y-4 animate-in fade-in duration-200">
              {/* Quick 1-Click Mentor Account Picker */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs space-y-2.5">
                <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[16px]">account_circle</span>
                  Select Mentor Account:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVolunteerEmail('kavita.deshmukh@vidarbhagrants.org');
                      setVolunteerPasscode('123456');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      volunteerEmail === 'kavita.deshmukh@vidarbhagrants.org'
                        ? 'bg-secondary-container/50 border-secondary shadow-xs'
                        : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      KD
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-primary truncate">Kavita Deshmukh</span>
                      <span className="text-[10px] text-on-surface-variant truncate">Lead Mentor</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVolunteerEmail('rajeshwar.patil@vidarbhagrants.org');
                      setVolunteerPasscode('123456');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      volunteerEmail === 'rajeshwar.patil@vidarbhagrants.org'
                        ? 'bg-secondary-container/50 border-secondary shadow-xs'
                        : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      RP
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-primary truncate">Dr. Rajeshwar Patil</span>
                      <span className="text-[10px] text-on-surface-variant truncate">Verifier • Amravati</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Volunteer Form */}
              <form
                onSubmit={handleVolunteerLogin}
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface">Volunteer Email</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      value={volunteerEmail}
                      onChange={(e) => setVolunteerEmail(e.target.value)}
                      placeholder="mentor@vidarbhagrants.org"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-on-surface">Security Access Passcode</label>
                    <span className="text-[11px] text-secondary font-semibold">Demo: 123456</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                      lock
                    </span>
                    <input
                      type="password"
                      required
                      value={volunteerPasscode}
                      onChange={(e) => setVolunteerPasscode(e.target.value)}
                      placeholder="Enter 6-digit passcode"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/30 focus:border-primary focus:outline-none tracking-widest"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-sm transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-80"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">login</span>
                      <span>Sign In to Dashboard</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Privacy Security Footnote */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-center text-xs text-on-surface-variant flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
            <span>Zero raw Aadhaar data stored • Ephemeral ZK Authentication Enclave</span>
          </div>
        </div>
      </main>
    </>
  );
}
