import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/auth/volunteers - Returns registered volunteers from database
export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      volunteers,
    });
  } catch (error: any) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
}
