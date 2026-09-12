import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/auth/login - Authenticate volunteer/mentor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, passcode } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Look up volunteer in SQLite database
    let volunteer = await prisma.volunteer.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!volunteer) {
      // If not in DB, create new guest mentor session or check default
      volunteer = await prisma.volunteer.create({
        data: {
          name: email.split('@')[0].replace('.', ' '),
          email: email.trim().toLowerCase(),
          role: 'Grant Mentor & Reviewer',
          division: 'Vidarbha Region',
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: volunteer.id,
        name: volunteer.name,
        email: volunteer.email,
        role: volunteer.role,
        division: volunteer.division,
        avatarUrl: volunteer.avatarUrl,
        sessionToken: `vdb_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      },
      message: `Welcome back, ${volunteer.name}!`,
    });
  } catch (error: any) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
