import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/applications/[id] - Get application by ID or refId
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const application = await prisma.grantApplication.findFirst({
      where: {
        OR: [
          { id: id },
          { refId: id },
          { nullifierHash: id },
        ],
      },
      include: { cycle: true },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error('Error fetching single application:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PATCH /api/applications/[id] - Update review status and notes
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { status, volunteerNotes, reviewedBy } = body;

    const existing = await prisma.grantApplication.findFirst({
      where: {
        OR: [
          { id: id },
          { refId: id },
        ],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.grantApplication.update({
      where: { id: existing.id },
      data: {
        status: status || existing.status,
        volunteerNotes: volunteerNotes !== undefined ? volunteerNotes : existing.volunteerNotes,
        reviewedBy: reviewedBy || existing.reviewedBy || 'Kavita Deshmukh',
        reviewedAt: new Date(),
      },
    });

    // If approved, update cycle allocated count
    if (status === 'APPROVED' && existing.status !== 'APPROVED') {
      await prisma.grantCycle.update({
        where: { cycleNumber: existing.cycleId },
        data: {
          allocatedSlots: { increment: 1 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      application: updated,
      message: `Application status updated to ${updated.status}`,
    });
  } catch (error: any) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update application' },
      { status: 500 }
    );
  }
}
