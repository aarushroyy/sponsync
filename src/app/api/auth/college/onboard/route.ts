// import { NextResponse } from 'next/server';
// import prisma from '@/app/lib/prisma';
// import { verifyToken } from '@/app/lib/jwt';
// import { Region, PackageTier, MetricType, FeatureType } from '@prisma/client';
// import { uploadPoster } from '@/app/lib/supabase';

// interface MetricConfig {
//   enabled: boolean;
//   min: string;
//   max: string;
// }

// interface PackageConfigData {
//   metrics: Record<MetricType, MetricConfig>;
//   features: Record<FeatureType, boolean>;
//   estimatedAmount: string; // New field for sponsorship amount
// }

// interface PackageConfigs {
//   [key: string]: PackageConfigData;
// }

// export async function POST(request: Request): Promise<NextResponse> {
//   // Verify JWT from Authorization header
//   const authHeader = request.headers.get('Authorization');
//   if (!authHeader) {
//     return new NextResponse(JSON.stringify({ message: 'Unauthorized: No token provided' }), { status: 401 });
//   }
//   const token = authHeader.split(' ')[1];
//   let decoded: { userId: string; role: string };
//   try {
//     decoded = verifyToken(token) as { userId: string; role: string };
//   } catch (jwtError: unknown) {
//     console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
//     return new NextResponse(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
//   }

//   try {
//     // Handle FormData
//     const formData = await request.formData();

//     const regionRaw = formData.get('region');
//     const eventType = formData.get('eventType') as string | null;
//     const totalBudgetGoal = formData.get('totalBudgetGoal') as string | null;
//     const posterFile = formData.get('poster') as File | null;

//     // Validate required fields
//     const region =
//       regionRaw && Object.values(Region).includes(regionRaw as Region)
//         ? (regionRaw as Region)
//         : null;

//     if (!region || !eventType) {
//       return new NextResponse(JSON.stringify({ message: 'Missing or invalid required fields' }), { status: 400 });
//     }

//     // Process package configurations
//     const packageConfigsRaw = formData.get('packageConfigs');
//     if (!packageConfigsRaw) {
//       return new NextResponse(JSON.stringify({ message: 'Missing package configurations' }), { status: 400 });
//     }

//     let packageConfigs: PackageConfigs;
    
//     try {
//       packageConfigs = JSON.parse(packageConfigsRaw as string);
//     } catch (jsonError: unknown) {
//       console.error('JSON parsing error:', jsonError instanceof Error ? jsonError.message : 'Unknown parsing error');
//       return new NextResponse(JSON.stringify({ message: 'Invalid JSON in package configurations' }), { status: 400 });
//     }

//     // Upload poster to Supabase if provided
//     let posterUrl: string | null = null;
//     if (posterFile) {
//       console.log('Attempting to upload file:', {
//         name: posterFile.name,
//         type: posterFile.type,
//         size: posterFile.size
//       });
      
//       posterUrl = await uploadPoster(posterFile, decoded.userId);
//       console.log('Upload result:', posterUrl);
      
//       if (!posterUrl) {
//         console.error('Upload failed, but continuing with onboarding');
//         // Instead of failing, we'll continue without the poster
//         // return new NextResponse(JSON.stringify({ message: 'Failed to upload poster' }), { status: 500 });
//       }
//     }

//     // First, create the base onboarding record with the new totalBudgetGoal field
//     const onboarding = await prisma.collegeOnboarding.create({
//       data: {
//         collegeId: decoded.userId,
//         region,
//         eventType,
//         posterUrl,
//         totalBudgetGoal: totalBudgetGoal ? parseInt(totalBudgetGoal) : null,
//       },
//     });

//     // Process and create package configs for all tiers (BRONZE, SILVER, GOLD)
//     for (const [tierKey, config] of Object.entries(packageConfigs)) {
//       const tier = tierKey as PackageTier;
      
//       // Create the package config with estimated amount
//       const packageConfig = await prisma.packageConfig.create({
//         data: {
//           tier,
//           onboardingId: onboarding.id,
//           estimatedAmount: config.estimatedAmount ? parseInt(config.estimatedAmount) : null,
//         },
//       });

//       // Create metrics for this package config
//       for (const [metricTypeKey, metricData] of Object.entries(config.metrics)) {
//         const metricType = metricTypeKey as MetricType;
//         await prisma.packageMetric.create({
//           data: {
//             type: metricType,
//             enabled: metricData.enabled,
//             minValue: metricData.enabled ? parseInt(metricData.min) : null,
//             maxValue: metricData.enabled ? parseInt(metricData.max) : null,
//             packageConfigId: packageConfig.id,
//           },
//         });
//       }

//       // Create features for this package config
//       for (const [featureTypeKey, enabled] of Object.entries(config.features)) {
//         const featureType = featureTypeKey as FeatureType;
//         await prisma.packageFeature.create({
//           data: {
//             type: featureType,
//             enabled: Boolean(enabled),
//             packageConfigId: packageConfig.id,
//           },
//         });
//       }
//     }

//     // Update college user to mark onboarding as complete
//     await prisma.collegeUser.update({
//       where: { id: decoded.userId },
//       data: { onboardingComplete: true },
//     });

//     // Return success response
//     return new NextResponse(
//       JSON.stringify({ 
//         success: true, 
//         id: onboarding.id,
//         message: "College onboarding completed successfully" 
//       }), 
//       { status: 201 }
//     );
//   } catch (error: unknown) {
//     // Safe error handling
//     const errorDetails = error instanceof Error ? 
//       { name: error.name, message: error.message } : 
//       { message: 'Unknown error occurred' };
    
//     console.error('College onboarding creation error:', errorDetails);
    
//     const errorMessage = error instanceof Error ? 
//       error.message : 'Onboarding failed';
      
//     return new NextResponse(JSON.stringify({ message: errorMessage }), { status: 500 });
//   }
// }

// app/api/auth/college/onboard/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';
import { Region, PackageTier, MetricType, FeatureType } from '@prisma/client';
import { uploadPoster } from '@/app/lib/supabase';

interface MetricConfig {
  enabled: boolean;
  min: string;
  max: string;
  rangeOption?: string;
}

interface FeatureConfig {
  enabled: boolean;
  valueOption?: string;
}

interface PackageConfigData {
  metrics: Record<MetricType, MetricConfig>;
  features: Record<FeatureType, FeatureConfig>;
  estimatedAmount: string;
}

interface PackageConfigs {
  [key: string]: PackageConfigData;
}

export async function POST(request: Request): Promise<NextResponse> {
  // Verify JWT from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized: No token provided' }), { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  let decoded: { userId: string; role: string };
  try {
    decoded = verifyToken(token) as { userId: string; role: string };
  } catch (jwtError: unknown) {
    console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
    return new NextResponse(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
  }

  try {
    // Handle FormData
    const formData = await request.formData();

    const regionRaw = formData.get('region');
    const eventType = formData.get('eventType') as string | null;
    const totalBudgetGoal = formData.get('totalBudgetGoal') as string | null;
    const posterFile = formData.get('poster') as File | null;

    // Validate required fields
    const region =
      regionRaw && Object.values(Region).includes(regionRaw as Region)
        ? (regionRaw as Region)
        : null;

    if (!region || !eventType) {
      return new NextResponse(JSON.stringify({ message: 'Missing or invalid required fields' }), { status: 400 });
    }

    // Process package configurations
    const packageConfigsRaw = formData.get('packageConfigs');
    if (!packageConfigsRaw) {
      return new NextResponse(JSON.stringify({ message: 'Missing package configurations' }), { status: 400 });
    }

    let packageConfigs: PackageConfigs;
    
    try {
      packageConfigs = JSON.parse(packageConfigsRaw as string);
    } catch (jsonError: unknown) {
      console.error('JSON parsing error:', jsonError instanceof Error ? jsonError.message : 'Unknown parsing error');
      return new NextResponse(JSON.stringify({ message: 'Invalid JSON in package configurations' }), { status: 400 });
    }

    // Upload poster to Supabase if provided
    let posterUrl: string | null = null;
    if (posterFile) {
      console.log('Attempting to upload file:', {
        name: posterFile.name,
        type: posterFile.type,
        size: posterFile.size
      });
      
      posterUrl = await uploadPoster(posterFile, decoded.userId);
      console.log('Upload result:', posterUrl);
      
      if (!posterUrl) {
        console.error('Upload failed, but continuing with onboarding');
      }
    }

    // First, create the base onboarding record with the new totalBudgetGoal field
    const onboarding = await prisma.collegeOnboarding.create({
      data: {
        collegeId: decoded.userId,
        region,
        eventType,
        posterUrl,
        totalBudgetGoal: totalBudgetGoal ? parseInt(totalBudgetGoal) : null,
      },
    });

    // Process and create package configs for all tiers (BRONZE, SILVER, GOLD)
    for (const [tierKey, config] of Object.entries(packageConfigs)) {
      const tier = tierKey as PackageTier;
      
      // Create the package config with estimated amount
      const packageConfig = await prisma.packageConfig.create({
        data: {
          tier,
          onboardingId: onboarding.id,
          estimatedAmount: config.estimatedAmount ? parseInt(config.estimatedAmount) : null,
        },
      });

      // Create metrics for this package config
      for (const [metricTypeKey, metricData] of Object.entries(config.metrics)) {
        const metricType = metricTypeKey as MetricType;
        if (metricData.enabled) {
          // Convert min/max values based on range option if present
          let minValue: number | null = null;
          let maxValue: number | null = null;
          
          if (metricData.min) minValue = parseInt(metricData.min);
          if (metricData.max) maxValue = parseInt(metricData.max);
          
          await prisma.packageMetric.create({
            data: {
              type: metricType,
              enabled: metricData.enabled,
              minValue,
              maxValue,
              rangeOption: metricData.rangeOption || null,
              packageConfigId: packageConfig.id,
            },
          });
        } else {
          // Create disabled metric record
          await prisma.packageMetric.create({
            data: {
              type: metricType,
              enabled: false,
              minValue: null,
              maxValue: null,
              rangeOption: null,
              packageConfigId: packageConfig.id,
            },
          });
        }
      }

      // Create features for this package config
      for (const [featureTypeKey, featureData] of Object.entries(config.features)) {
        const featureType = featureTypeKey as FeatureType;
        await prisma.packageFeature.create({
          data: {
            type: featureType,
            enabled: featureData.enabled,
            valueOption: featureData.valueOption || null,
            packageConfigId: packageConfig.id,
          },
        });
      }
    }

    // Update college user to mark onboarding as complete
    await prisma.collegeUser.update({
      where: { id: decoded.userId },
      data: { onboardingComplete: true },
    });

    // Return success response
    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        id: onboarding.id,
        message: "College onboarding completed successfully" 
      }), 
      { status: 201 }
    );
  } catch (error: unknown) {
    // Safe error handling
    const errorDetails = error instanceof Error ? 
      { name: error.name, message: error.message } : 
      { message: 'Unknown error occurred' };
    
    console.error('College onboarding creation error:', errorDetails);
    
    const errorMessage = error instanceof Error ? 
      error.message : 'Onboarding failed';
      
    return new NextResponse(JSON.stringify({ message: errorMessage }), { status: 500 });
  }
}