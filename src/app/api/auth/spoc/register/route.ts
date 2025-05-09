// // src/app/api/auth/spoc/register/route.ts
// import { NextResponse } from 'next/server';
// import { spocAuthService } from '@/app/services/auth.service';
// //import { uploadIDCard } from '@/app/lib/supabase';

// export async function POST(request: Request) {
//   try {
//     console.log('Processing SPOC registration request');
    
//     // Handle form data with file upload
//     const formData = await request.formData();
    
//     // Extract text data
//     const email = formData.get('email') as string;
//     const password = formData.get('password') as string;
//     const firstName = formData.get('firstName') as string;
//     const lastName = formData.get('lastName') as string;
//     const phone = formData.get('phone') as string;
//     const collegeRollNumber = formData.get('collegeRollNumber') as string;
    
//     // Extract ID card file
//     const idCard = formData.get('idCard') as File | null;
    
//     // Debug logging
//     console.log('Received form data:', {
//       email,
//       firstName,
//       lastName,
//       phone,
//       collegeRollNumber,
//       idCard: idCard ? `${idCard.name} (${idCard.type}, ${idCard.size} bytes)` : 'No file'
//     });
    
//     // Validate required fields
//     if (!email || !password || !firstName || !lastName || !phone || !collegeRollNumber) {
//       console.error('Missing required fields');
//       return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
//     }
    
//     if (!idCard) {
//       console.error('ID card file is required');
//       return NextResponse.json({ message: 'ID card file is required' }, { status: 400 });
//     }
    
//     // Validate file type (only images)
//     if (!idCard.type.startsWith('image/')) {
//       console.error('Invalid file type:', idCard.type);
//       return NextResponse.json({ message: 'ID card must be an image file' }, { status: 400 });
//     }
    
//     // Validate file size (max 5MB)
//     const fileSize = idCard.size / 1024 / 1024; // size in MB
//     if (fileSize > 5) {
//       console.error('File too large:', fileSize, 'MB');
//       return NextResponse.json({ message: 'ID card file size should not exceed 5MB' }, { status: 400 });
//     }
    
//     // // Upload ID card to Supabase and get URL
//     // console.log('Uploading ID card to Supabase...');
    
//     // // Generate a unique ID for the file
//     // const uniqueID = crypto.randomUUID();
    
//     // const idCardUrl = await uploadIDCard(idCard, uniqueID);

//     // Generate a unique ID for the file
// const uniqueID = crypto.randomUUID();

// let idCardUrl;
// try {
//   // Convert file to buffer for server-side upload
//   const arrayBuffer = await idCard.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
  
//   // Use direct fetch to Supabase API
//   const fileName = uniqueID + '-' + idCard.name;
//   const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/spoc-id-cards/${fileName}`, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
//       'Content-Type': idCard.type,
//       'x-upsert': 'true'
//     },
//     body: buffer
//   });
  
//   const result = await response.json();
  
//   if (!response.ok) {
//     console.error('Direct upload error:', result);
//     throw new Error('Upload failed: ' + JSON.stringify(result));
//   }
  
//   // Construct the URL manually
//   idCardUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/spoc-id-cards/${fileName}`;
//   console.log('Uploaded successfully, URL:', idCardUrl);
// } catch (uploadError) {
//   console.error('Upload process error:', uploadError);
  
//   // For testing purposes, use a placeholder URL
//   idCardUrl = "https://placehold.co/400x300?text=ID+Card";
//   console.log('Using placeholder URL instead:', idCardUrl);
// }
    
//     if (!idCardUrl) {
//       console.error('Failed to upload ID card');
//       return NextResponse.json({ message: 'Failed to upload ID card' }, { status: 500 });
//     }
    
//     console.log('ID card uploaded successfully:', idCardUrl);
    
//     // Register the SPOC with the ID card URL
//     const user = await spocAuthService.register({
//       email,
//       password,
//       firstName,
//       lastName,
//       phone,
//       collegeRollNumber,
//       idCardUrl
//     });
    
//     console.log('SPOC registered successfully with ID:', user.id);
    
//     return NextResponse.json({ 
//       message: 'SPOC user registered successfully',
//       userId: user.id 
//     }, { status: 201 });
//   } catch (error: unknown) {
//     console.error('SPOC Registration error:', error);
    
//     // If error has a code property (like from Prisma), check for duplicate email
//     if (
//       typeof error === 'object' &&
//       error !== null &&
//       'code' in error &&
//       (error as { code: string }).code === 'P2002'
//     ) {
//       return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
//     }
    
//     // Handle other errors
//     return NextResponse.json({ 
//       message: 'Registration failed',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     }, { status: 500 });
//   }
// }
//latest




// src/app/api/auth/spoc/register/route.ts
import { NextResponse } from 'next/server';
import { spocAuthService } from '@/app/services/auth.service';
import { uploadIDCard } from '@/app/lib/supabase';

export async function POST(request: Request) {
  try {
    console.log('Processing SPOC registration request');
    
    // Handle form data with file upload
    const formData = await request.formData();
    
    // Extract text data
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const collegeRollNumber = formData.get('collegeRollNumber') as string;
    
    // Extract ID card file
    const idCard = formData.get('idCard') as File | null;
    
    // Debug logging
    console.log('Received form data:', {
      email,
      firstName,
      lastName,
      phone,
      collegeRollNumber,
      idCard: idCard ? `${idCard.name} (${idCard.type}, ${idCard.size} bytes)` : 'No file'
    });
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !collegeRollNumber) {
      console.error('Missing required fields');
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    if (!idCard) {
      console.error('ID card file is required');
      return NextResponse.json({ message: 'ID card file is required' }, { status: 400 });
    }
    
    // Validate file type (only images)
    if (!idCard.type.startsWith('image/')) {
      console.error('Invalid file type:', idCard.type);
      return NextResponse.json({ message: 'ID card must be an image file' }, { status: 400 });
    }
    
    // Validate file size (max 5MB)
    const fileSize = idCard.size / 1024 / 1024; // size in MB
    if (fileSize > 5) {
      console.error('File too large:', fileSize, 'MB');
      return NextResponse.json({ message: 'ID card file size should not exceed 5MB' }, { status: 400 });
    }
    
    // Generate a unique ID for the file
    const uniqueID = crypto.randomUUID();
    
    // Use the uploadIDCard function from supabase.ts
    console.log('Uploading ID card to Supabase...');
    const idCardUrl = await uploadIDCard(idCard, uniqueID);
    
    if (!idCardUrl) {
      console.error('Failed to upload ID card');
      return NextResponse.json({ message: 'Failed to upload ID card to storage' }, { status: 500 });
    }
    
    console.log('ID card uploaded successfully:', idCardUrl);
    
    // Register the SPOC with the ID card URL
    const user = await spocAuthService.register({
      email,
      password,
      firstName,
      lastName,
      phone,
      collegeRollNumber,
      idCardUrl
    });
    
    console.log('SPOC registered successfully with ID:', user.id);
    
    return NextResponse.json({ 
      message: 'SPOC user registered successfully',
      userId: user.id 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('SPOC Registration error:', error);
    
    // If error has a code property (like from Prisma), check for duplicate email
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }
    
    // Handle other errors
    return NextResponse.json({ 
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}