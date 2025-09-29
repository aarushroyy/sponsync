import { NextResponse } from 'next/server';
import { companyAuthService } from '@/app/services/auth.service';
import { normalizeLinkedInUrl } from '@/app/lib/authValidation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, personName, position, companyName, phone, workEmail, linkedIn } = body;
    if (!email || !password || !personName || !position || !companyName || !phone || !workEmail || !linkedIn) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Normalize LinkedIn URL to handle trailing slashes and protocol variations
    const normalizedLinkedIn = normalizeLinkedInUrl(linkedIn);

    // Validate normalized LinkedIn format
    const linkedInRegex = /^linkedin\.com\/in\/[\w-]+$/;
    if (!linkedInRegex.test(normalizedLinkedIn)) {
      return NextResponse.json({ message: 'Invalid LinkedIn URL format. Please provide a valid LinkedIn profile URL (linkedin.com/in/username).' }, { status: 400 });
    }

    console.log('Registration request body:', body);
    
    // Pass the normalized LinkedIn URL to the service
    const registrationData = {
      ...body,
      linkedIn: normalizedLinkedIn
    };
    
    const user = await companyAuthService.register(registrationData);
    console.log('User created successfully:', user.id);
    
    return NextResponse.json({ 
      message: 'Company user registered successfully',
      userId: user.id 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    if (error instanceof Error && error.message === 'Invalid LinkedIn URL or email format') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    
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
