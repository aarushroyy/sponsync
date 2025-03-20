import { NextResponse } from 'next/server';
import { companyAuthService } from '@/app/services/auth.service';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    console.log('Login attempt for email:', email);
    const result = await companyAuthService.login(email, password);
    
    return NextResponse.json({
      message: 'Login successful',
      ...result
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Login failed',
      status: 'error'
    }, { status: 401 });
  }
}
