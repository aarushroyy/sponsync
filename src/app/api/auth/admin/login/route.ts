import { NextResponse } from 'next/server';
import { adminAuthService } from '@/app/services/auth.service';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const result = await adminAuthService.login(email, password);
    
    return NextResponse.json({
      message: 'Login successful',
      ...result
    });
  } catch (error: unknown) {
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Login failed',
      status: 'error'
    }, { status: 401 });
  }
}
