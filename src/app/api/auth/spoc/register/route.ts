import { NextResponse } from 'next/server';
import { spocAuthService } from '@/app/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;
    
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const user = await spocAuthService.register(body);
    
    return NextResponse.json({ 
      message: 'SPOC user registered successfully',
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
