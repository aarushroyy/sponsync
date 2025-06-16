import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ 
        message: 'Name, email and message are required' 
      }, { status: 400 });
    }

    // Create contact query
    const contactQuery = await prisma.contactQuery.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json({ 
      message: 'Contact query submitted successfully',
      data: contactQuery 
    });
  } catch (error) {
    console.error('Error submitting contact query:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to submit contact query'
    }, { status: 500 });
  }
}
