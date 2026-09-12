import { NextResponse } from 'next/server';
import { SAMPLE_AADHAAR_PROFILES } from '@/lib/zk-proof';

export async function GET() {
  return NextResponse.json({
    success: true,
    profiles: SAMPLE_AADHAAR_PROFILES,
  });
}
