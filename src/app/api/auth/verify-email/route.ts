// app/api/auth/verify-email/route.ts
import { NextResponse } from 'next/server';
import { verificationService } from '@/app/services/auth.service';

export async function GET(request: Request): Promise<NextResponse> {
  // Extract the token from the query parameters
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 });
  }
  
  try {
    await verificationService.verifyEmail(token);
    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error: unknown) {
    console.error('Email verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}
