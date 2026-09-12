import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deriveNullifierHash } from '@/lib/zk-proof';

// In-memory OTP cache for demo simulation
const otpStore = new Map<string, { otp: string; expiresAt: number; phoneMask: string; name: string }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, aadhaarNumber, otp } = body;

    const cleanAadhaar = (aadhaarNumber || '').replace(/\s+/g, '');

    if (action === 'send_otp') {
      if (!cleanAadhaar || cleanAadhaar.length !== 12 || !/^\d{12}$/.test(cleanAadhaar)) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid 12-digit Aadhaar number.' },
          { status: 400 }
        );
      }

      // Generate 6-digit simulated OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const phoneSuffix = cleanAadhaar.slice(-4);
      const phoneMask = `+91 98${cleanAadhaar[0]}${cleanAadhaar[1]} ••${phoneSuffix.slice(0, 2)}`;

      // Derive demo student name based on last digits
      let studentName = 'Pooja Rameshwar Deshmukh';
      if (cleanAadhaar.endsWith('8842') || cleanAadhaar.startsWith('2345')) {
        studentName = 'Ananya Suresh Wankhede';
      } else if (cleanAadhaar.endsWith('7193')) {
        studentName = 'Pranav Mangesh Raut';
      }

      otpStore.set(cleanAadhaar, {
        otp: generatedOtp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        phoneMask,
        name: studentName,
      });

      return NextResponse.json({
        success: true,
        message: `OTP sent successfully to mobile linked with Aadhaar (${phoneMask})`,
        phoneMask,
        demoOtp: generatedOtp, // provided for seamless one-click demo testing
        expiresInSeconds: 300,
      });
    }

    if (action === 'verify_otp') {
      if (!cleanAadhaar || cleanAadhaar.length !== 12) {
        return NextResponse.json(
          { success: false, error: 'Invalid Aadhaar number' },
          { status: 400 }
        );
      }

      if (!otp || otp.length !== 6) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid 6-digit OTP' },
          { status: 400 }
        );
      }

      const cached = otpStore.get(cleanAadhaar);

      // Allow demo OTP '123456' or exact matching OTP
      if (otp !== '123456' && (!cached || cached.otp !== otp)) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired OTP. Use demo OTP 123456 or request a new code.' },
          { status: 401 }
        );
      }

      // Derive the client nullifier hash deterministically (Zero raw Aadhaar stored on server)
      const studentNullifier = deriveNullifierHash(`aadhaar-session-${cleanAadhaar}`);
      
      // Look up if an application exists with related demo nullifiers
      let application = await prisma.grantApplication.findFirst({
        where: {
          OR: [
            { nullifierHash: studentNullifier },
            { refId: 'VDB-2025-8842' },
          ],
        },
      });

      const studentUser = {
        role: 'STUDENT_APPLICANT',
        name: cached?.name || (application ? application.fullName : 'Ananya Suresh Wankhede'),
        maskedAadhaar: `XXXX-XXXX-${cleanAadhaar.slice(-4)}`,
        phoneMask: cached?.phoneMask || '+91 98234 •••••',
        refId: application?.refId || 'VDB-2025-8842',
        status: application?.status || 'APPROVED',
        nullifierHash: application?.nullifierHash || studentNullifier,
        sessionToken: `aadhaar_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      };

      // Clean cached OTP
      otpStore.delete(cleanAadhaar);

      return NextResponse.json({
        success: true,
        user: studentUser,
        message: 'Aadhaar OTP verified successfully via decentralized enclave!',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in aadhaar-otp:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'OTP verification failed' },
      { status: 500 }
    );
  }
}
