import { NextResponse } from 'next/server';
import { collegeAuthService } from '@/app/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, collegeName, eventName, phone } = body;
    
    if (!email || !password || !name || !collegeName || !eventName || !phone) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const user = await collegeAuthService.register(body);
    
    return NextResponse.json({ 
      message: 'College user registered successfully',
      userId: user.id 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    // If error has a code property (like from Prisma), we can check it:
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ 
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

