// app/api/company/campaigns/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';
import { MetricType, FeatureType, Region, CampaignPlan } from '@prisma/client';

interface MetricData {
  type: MetricType;
  minValue?: number;
  maxValue?: number;
}

interface FeatureData {
  type: FeatureType;
  enabled: boolean;
}

interface CampaignData {
  name: string;
  plan: CampaignPlan;
  region: Region;
  eventTypes: string[];
  bundleSize: number;
  metrics: MetricData[];
  features: FeatureData[];
}

export async function POST(request: Request): Promise<NextResponse> {
  // Verify JWT from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }
  
  const token = authHeader.split(' ')[1];
  let decoded: { userId: string; role: string };
  
  try {
    decoded = verifyToken(token) as { userId: string; role: string };
  } catch (jwtError: unknown) {
    console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    console.log("[DEBUG] POST /api/company/campaigns - Starting campaign creation");

    const campaignData: CampaignData = await request.json();
    console.log("[DEBUG] Campaign request data:", JSON.stringify(campaignData, null, 2));

    // Validate required fields
    if (!campaignData.name || !campaignData.plan || !campaignData.region || 
        !campaignData.eventTypes || !campaignData.bundleSize) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create company campaign
    const campaign = await prisma.companyCampaign.create({
      data: {
        companyId: decoded.userId,
        name: campaignData.name,
        plan: campaignData.plan,
        region: campaignData.region,
        eventTypes: campaignData.eventTypes,
        bundleSize: campaignData.bundleSize,
        status: 'DRAFT',
      }
    });

    console.log("[DEBUG] Campaign created:", campaign.id);


    // Create metrics for this campaign
    for (const metric of campaignData.metrics) {
      await prisma.campaignMetric.create({
        data: {
          type: metric.type,
          minValue: metric.minValue || null,
          maxValue: metric.maxValue || null,
          campaignId: campaign.id,
        }
      });
    }

    console.log("[DEBUG] Creating features, count:", campaignData.features.length);

    // Create features for this campaign
    for (const feature of campaignData.features) {
      await prisma.campaignFeature.create({
        data: {
          type: feature.type,
          enabled: feature.enabled,
          campaignId: campaign.id,
        }
      });
    }

    console.log("[DEBUG] Calling generateBundleSuggestions with:", {
      campaignId: campaign.id,
      region: campaign.region,
      eventTypes: campaignData.eventTypes,
      bundleSize: campaignData.bundleSize,
      metricsCount: campaignData.metrics.length
    });

    // Generate bundle suggestions using the matching algorithm
    const suggestedBundles = await generateBundleSuggestions(
      campaign.id,
      campaign.region,
      campaignData.eventTypes,
      campaignData.bundleSize,
      campaignData.metrics
    );

    console.log("[DEBUG] Bundle generation complete, bundles count:", suggestedBundles.length);
    if (suggestedBundles.length === 0) {
      console.log("[DEBUG] No bundles were generated");
    }

    return NextResponse.json({
      message: 'Campaign created successfully',
      campaign: {
        ...campaign,
        metrics: campaignData.metrics,
        features: campaignData.features,
        suggestedBundles,
      }
    });
  } catch (error: unknown) {
    console.error('Campaign creation error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to create campaign', 
      status: 'error' 
    }, { status: 500 });
  }
}

// async function generateBundleSuggestions(
//   campaignId: string,
//   region: Region,
//   eventTypes: string[],
//   bundleSize: number,
//   companyMetrics: MetricData[]
// ) {
//   // Find matching colleges based on region and event types
//   const matchingColleges = await prisma.collegeOnboarding.findMany({
//     where: {
//       region: region,
//       eventType: {
//         in: eventTypes,
//       },
//     },
//     include: {
//       college: {
//         select: {
//           collegeName: true,
//           eventName: true,
//         },
//       },
//       packageConfigs: {
//         include: {
//           metrics: true,
//           features: true,
//         },
//       },
//     },
//   });

//   // Convert company metrics to a more usable format
//   const metricsMap = companyMetrics.reduce((acc, metric) => {
//     acc[metric.type] = {
//       minValue: metric.minValue || 0,
//       maxValue: metric.maxValue || 0,
//     };
//     return acc;
//   }, {} as Record<string, { minValue: number; maxValue: number }>);

//   // Score each college based on how well it matches company requirements
//   const scoredColleges = matchingColleges.map(college => {
//     let score = 0;
    
//     // Start with a base score for region match
//     score += 10;
    
//     // Add score for event type match
//     if (eventTypes.includes(college.eventType)) {
//       score += 10;
//     }
    
//     // Find the best package config (e.g., GOLD, SILVER, BRONZE)
//     // Prioritize by tier: GOLD > SILVER > BRONZE
//     const sortedPackageConfigs = [...college.packageConfigs].sort((a, b) => {
//       const tierOrder = { GOLD: 3, SILVER: 2, BRONZE: 1 };
//       return tierOrder[b.tier] - tierOrder[a.tier];
//     });
    
//     const bestPackage = sortedPackageConfigs[0];
    
//     if (bestPackage) {
//       // Score based on metrics match
//       for (const metric of bestPackage.metrics) {
//         if (metric.enabled && metricsMap[metric.type]) {
//           // Use lower limit of what college provides (as per requirements)
//           const collegeProvides = metric.minValue || 0;
//           // Use upper limit of what company wants
//           const companyWants = metricsMap[metric.type].maxValue || 0;
          
//           // Score based on percentage of fulfillment
//           if (companyWants > 0) {
//             const fulfillmentPercentage = Math.min(100, (collegeProvides / companyWants) * 100);
//             score += fulfillmentPercentage / 10; // Convert to 0-10 scale
//           }
//         }
//       }
//     }
    
//     return {
//       college,
//       score,
//       bestPackage,
//     };
//   });

//   // Sort colleges by score (descending)
//   scoredColleges.sort((a, b) => b.score - a.score);
  
//   // Create bundles based on bundle size
//   const bundles = [];
  
//   // A simple greedy algorithm to create bundles
//   // For a real application, you might want a more sophisticated algorithm
//   for (let i = 0; i < Math.min(3, Math.ceil(scoredColleges.length / bundleSize)); i++) {
//     const startIdx = i * bundleSize;
//     const bundleColleges = scoredColleges.slice(startIdx, startIdx + bundleSize);
    
//     if (bundleColleges.length > 0) {
//       // Calculate total metrics for this bundle
//       const totalMetrics = {} as Record<MetricType, number>;
      
//       for (const { bestPackage } of bundleColleges) {
//         if (bestPackage) {
//           for (const metric of bestPackage.metrics) {
//             if (metric.enabled && metric.minValue) {
//               totalMetrics[metric.type] = (totalMetrics[metric.type] || 0) + metric.minValue;
//             }
//           }
//         }
//       }
      
//       // Create the bundle
//       const bundle = await prisma.campaignBundle.create({
//         data: {
//           name: `Bundle ${i + 1}`,
//           campaignId: campaignId,
//           collegeIds: bundleColleges.map(item => item.college.collegeId),
//           status: 'PENDING',
//         },
//       });
      
//       bundles.push({
//         ...bundle,
//         colleges: bundleColleges.map(item => ({
//           id: item.college.id,
//           collegeName: item.college.college.collegeName,
//           eventName: item.college.college.eventName,
//           eventType: item.college.eventType,
//           posterUrl: item.college.posterUrl,
//           score: item.score,
//         })),
//         totalMetrics,
//       });
//     }
//   }
  
//   return bundles;
// }

// GET endpoint to retrieve campaign details

async function generateBundleSuggestions(
  campaignId: string,
  region: Region,
  eventTypes: string[],
  bundleSize: number,
  companyMetrics: MetricData[]
) {
  console.log("[DEBUG] Starting bundle generation with params:", {
    campaignId,
    region,
    eventTypes,
    bundleSize,
    companyMetrics: companyMetrics.map(m => ({ type: m.type, min: m.minValue, max: m.maxValue }))
  });

  // Find matching colleges based on region and event types
  console.log("[DEBUG] Finding colleges matching region and event types");
  const matchingColleges = await prisma.collegeOnboarding.findMany({
    where: {
      region: region,
      eventType: {
        in: eventTypes,
      },
    },
    include: {
      college: {
        select: {
          collegeName: true,
          eventName: true,
        },
      },
      packageConfigs: {
        include: {
          metrics: true,
          features: true,
        },
      },
    },
  });

  console.log("[DEBUG] Found matching colleges:", matchingColleges.length);
  if (matchingColleges.length === 0) {
    console.log("[DEBUG] No colleges match the region and event types criteria. Returning empty bundle.");
    return [];
  }

  // Log college details for debugging
  console.log("[DEBUG] College details:");
  matchingColleges.forEach((college, index) => {
    console.log(`[DEBUG] College ${index+1}: ${college.college.collegeName}, Event: ${college.eventType}, Packages: ${college.packageConfigs.length}`);
    // Check if packageConfigs exist and have metrics
    if (college.packageConfigs.length === 0) {
      console.log(`[DEBUG] WARNING: College ${college.college.collegeName} has no package configs`);
    } else {
      college.packageConfigs.forEach(pkg => {
        console.log(`[DEBUG]   - Package: ${pkg.tier}, Metrics: ${pkg.metrics.length}, Features: ${pkg.features.length}`);
        if (pkg.metrics.length === 0) {
          console.log(`[DEBUG]   WARNING: Package ${pkg.tier} has no metrics`);
        }
      });
    }
  });

  // Convert company metrics to a more usable format
  const metricsMap = companyMetrics.reduce((acc, metric) => {
    acc[metric.type] = {
      minValue: metric.minValue || 0,
      maxValue: metric.maxValue || 0,
    };
    return acc;
  }, {} as Record<string, { minValue: number; maxValue: number }>);
  console.log("[DEBUG] Company metrics map:", metricsMap);

  // Calculate the total required metrics (sum of max values)
  const totalRequiredMetrics: Record<string, number> = {};
  companyMetrics.forEach(metric => {
    totalRequiredMetrics[metric.type] = metric.maxValue || 0;
  });
  console.log("[DEBUG] Total required metrics:", totalRequiredMetrics);

  // Score each college based on how well it matches company requirements
  console.log("[DEBUG] Scoring colleges based on requirements match");
  const scoredColleges = matchingColleges.map(college => {
    let score = 0;
    
    // Start with a base score for region match
    score += 10;
    console.log(`[DEBUG] College ${college.college.collegeName} - Base region score: 10`);
    
    // Add score for event type match
    if (eventTypes.includes(college.eventType)) {
      score += 15;
      console.log(`[DEBUG] College ${college.college.collegeName} - Event type match: +15`);
    }
    
    // Find the best package config (e.g., GOLD, SILVER, BRONZE)
    // Prioritize by tier: GOLD > SILVER > BRONZE
    const tierOrder = { GOLD: 3, SILVER: 2, BRONZE: 1 };
    const sortedPackageConfigs = [...college.packageConfigs].sort((a, b) => {
      return (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0);
    });
    
    const bestPackage = sortedPackageConfigs.length > 0 ? sortedPackageConfigs[0] : null;
    const collegeMetrics: Record<string, number> = {};
    
    if (bestPackage) {
      console.log(`[DEBUG] College ${college.college.collegeName} - Best package: ${bestPackage.tier}`);
      
      // Score based on metrics match
      for (const metric of bestPackage.metrics) {
        if (metric.enabled && metricsMap[metric.type]) {
          // Use lower limit of what college provides (as per requirements)
          const collegeProvides = metric.minValue || 0;
          collegeMetrics[metric.type] = collegeProvides;
          
          // Use upper limit of what company wants
          const companyWants = metricsMap[metric.type].maxValue || 0;
          
          // Score based on percentage of fulfillment
          if (companyWants > 0) {
            const fulfillmentPercentage = Math.min(100, (collegeProvides / companyWants) * 100);
            const metricScore = fulfillmentPercentage / 5; // Convert to 0-20 scale
            score += metricScore;
            console.log(`[DEBUG] College ${college.college.collegeName} - Metric ${metric.type}: ${collegeProvides}/${companyWants} (${fulfillmentPercentage.toFixed(1)}%) = +${metricScore.toFixed(1)} points`);
          } else {
            console.log(`[DEBUG] College ${college.college.collegeName} - Metric ${metric.type}: Company doesn't require this metric`);
          }
        } else if (!metric.enabled) {
          console.log(`[DEBUG] College ${college.college.collegeName} - Metric ${metric.type}: Not enabled`);
        } else if (!metricsMap[metric.type]) {
          console.log(`[DEBUG] College ${college.college.collegeName} - Metric ${metric.type}: Not requested by company`);
        }
      }
    } else {
      console.log(`[DEBUG] WARNING: College ${college.college.collegeName} has no valid package configs`);
    }
    
    console.log(`[DEBUG] College ${college.college.collegeName} - Final score: ${score.toFixed(1)}`);
    
    return {
      college,
      score,
      bestPackage,
      collegeMetrics,
    };
  });

  // Sort colleges by score (descending)
  scoredColleges.sort((a, b) => b.score - a.score);
  console.log("[DEBUG] Top 3 colleges after scoring:", scoredColleges.slice(0, 3).map(c => 
    `${c.college.college.collegeName} (${c.score.toFixed(1)})`).join(", "));
  
  // Check if we have enough colleges for at least one bundle
  if (scoredColleges.length < bundleSize) {
    console.log(`[DEBUG] Not enough colleges to form a bundle. Need ${bundleSize}, have ${scoredColleges.length}`);
    return [];
  }
  
  // Create bundles
  console.log("[DEBUG] Creating bundles");
  const bundles = [];
  const numBundles = Math.min(3, Math.ceil(scoredColleges.length / bundleSize));
  console.log(`[DEBUG] Will create ${numBundles} bundles with bundle size ${bundleSize}`);
  
  // First bundle: highest scoring colleges
  console.log("[DEBUG] Creating first bundle with highest scoring colleges");
  const firstBundleColleges = scoredColleges.slice(0, bundleSize);
  console.log(`[DEBUG] First bundle colleges: ${firstBundleColleges.map(c => c.college.college.collegeName).join(", ")}`);
  
  // For other bundles, try to optimize for different metrics
  const bundleApproaches = [
    firstBundleColleges, // First bundle: highest overall scores
  ];
  
  // Second bundle: prioritize colleges that are good at metrics the first bundle is weak at
  if (numBundles >= 2 && scoredColleges.length > bundleSize) {
    console.log("[DEBUG] Creating second bundle to complement first bundle's metrics");
    
    // Find metrics that are underrepresented in the first bundle
    const firstBundleMetrics: Record<string, number> = {};
    for (const { collegeMetrics } of firstBundleColleges) {
      Object.entries(collegeMetrics).forEach(([type, value]) => {
        firstBundleMetrics[type] = (firstBundleMetrics[type] || 0) + value;
      });
    }
    console.log("[DEBUG] First bundle total metrics:", firstBundleMetrics);
    
    // Calculate fulfillment percentages
    const metricFulfillment: Record<string, number> = {};
    Object.entries(totalRequiredMetrics).forEach(([type, required]) => {
      if (required > 0) {
        metricFulfillment[type] = ((firstBundleMetrics[type] || 0) / required) * 100;
      }
    });
    console.log("[DEBUG] First bundle metric fulfillment:", metricFulfillment);
    
    // Sort metrics by fulfillment percentage (ascending)
    const prioritizedMetrics = Object.entries(metricFulfillment)
      .sort(([, a], [, b]) => a - b)
      .map(([type]) => type);
    console.log("[DEBUG] Prioritized metrics for second bundle:", prioritizedMetrics);
    
    // Create a special scoring function that prioritizes these metrics
    const remainingColleges = scoredColleges.filter(c => 
      !firstBundleColleges.some(fc => fc.college.id === c.college.id)
    );
    console.log(`[DEBUG] Remaining colleges for second bundle: ${remainingColleges.length}`);
    
    const secondBundleColleges = remainingColleges.map(collegeData => {
      let specialScore = collegeData.score;
      
      // Boost score for colleges that fulfill underrepresented metrics
      prioritizedMetrics.forEach((metricType, index) => {
        const weight = prioritizedMetrics.length - index; // Higher weight for most underrepresented
        const collegeMetricValue = collegeData.collegeMetrics[metricType] || 0;
        if (collegeMetricValue > 0) {
          const boost = collegeMetricValue * weight * 0.1;
          specialScore += boost;
          console.log(`[DEBUG] Boosting ${collegeData.college.college.collegeName} score for ${metricType}: +${boost.toFixed(1)} (now ${specialScore.toFixed(1)})`);
        }
      });
      
      return { ...collegeData, specialScore };
    })
    .sort((a, b) => b.specialScore - a.specialScore)
    .slice(0, bundleSize);
    
    console.log(`[DEBUG] Second bundle colleges: ${secondBundleColleges.map(c => c.college.college.collegeName).join(", ")}`);
    bundleApproaches.push(secondBundleColleges);
  }
  
  // Third bundle: try to maximize diversity of event types
  if (numBundles >= 3 && scoredColleges.length > bundleSize * 2) {
    console.log("[DEBUG] Creating third bundle to maximize event type diversity");
    
    const usedColleges = [...firstBundleColleges];
    if (bundleApproaches.length > 1) {
      usedColleges.push(...bundleApproaches[1]);
    }
    
    // Count event types in used bundles
    const eventTypeCounts: Record<string, number> = {};
    usedColleges.forEach(c => {
      const eventType = c.college.eventType;
      eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;
    });
    console.log("[DEBUG] Event type counts from previous bundles:", eventTypeCounts);
    
    const remainingColleges = scoredColleges.filter(c => 
      !usedColleges.some(uc => uc.college.id === c.college.id)
    );
    console.log(`[DEBUG] Remaining colleges for third bundle: ${remainingColleges.length}`);
    
    // Create a special scoring function that prioritizes diverse event types
    const thirdBundleColleges = remainingColleges.map(collegeData => {
      let diversityScore = collegeData.score;
      
      // Boost score for colleges with less represented event types
      const eventType = collegeData.college.eventType;
      const eventTypeCount = eventTypeCounts[eventType] || 0;
      const boost = (10 - eventTypeCount) * 5;
      diversityScore += boost;
      console.log(`[DEBUG] Boosting ${collegeData.college.college.collegeName} score for diversity of ${eventType}: +${boost} (now ${diversityScore})`);
      
      return { ...collegeData, diversityScore };
    })
    .sort((a, b) => b.diversityScore - a.diversityScore)
    .slice(0, bundleSize);
    
    console.log(`[DEBUG] Third bundle colleges: ${thirdBundleColleges.map(c => c.college.college.collegeName).join(", ")}`);
    bundleApproaches.push(thirdBundleColleges);
  }
  
  // Create the actual bundle entities
  console.log(`[DEBUG] Creating ${bundleApproaches.length} bundle entities in the database`);
  for (let i = 0; i < bundleApproaches.length; i++) {
    const bundleColleges = bundleApproaches[i];
    
    if (bundleColleges.length > 0) {
      // Calculate total metrics for this bundle
      const totalMetrics = {} as Record<MetricType, number>;
      
      for (const { collegeMetrics } of bundleColleges) {
        Object.entries(collegeMetrics).forEach(([type, value]) => {
          totalMetrics[type as MetricType] = (totalMetrics[type as MetricType] || 0) + value;
        });
      }
      console.log(`[DEBUG] Bundle ${i+1} total metrics:`, totalMetrics);
      
      // Calculate fulfillment percentages for this bundle
      const fulfillmentPercentages = {} as Record<string, number>;
      Object.entries(totalRequiredMetrics).forEach(([type, required]) => {
        if (required > 0) {
          const fulfilled = totalMetrics[type as MetricType] || 0;
          fulfillmentPercentages[type] = Math.min(100, (fulfilled / required) * 100);
        }
      });
      console.log(`[DEBUG] Bundle ${i+1} fulfillment percentages:`, fulfillmentPercentages);
      
      try {
        // Create the bundle
        console.log(`[DEBUG] Creating bundle ${i+1} in database with ${bundleColleges.length} colleges`);
        const bundle = await prisma.campaignBundle.create({
          data: {
            name: `Bundle ${i + 1}`,
            campaignId: campaignId,
            collegeIds: bundleColleges.map(item => item.college.collegeId),
            status: 'PENDING',
          },
        });
        console.log(`[DEBUG] Bundle created with ID: ${bundle.id}`);
        
        bundles.push({
          ...bundle,
          colleges: bundleColleges.map(item => ({
            id: item.college.id,
            collegeName: item.college.college.collegeName,
            eventName: item.college.college.eventName,
            eventType: item.college.eventType,
            posterUrl: item.college.posterUrl,
            score: item.score,
          })),
          totalMetrics,
          fulfillmentPercentages,
        });
      } catch (error) {
        console.error(`[DEBUG] Error creating bundle ${i+1}:`, error);
      }
    } else {
      console.log(`[DEBUG] Skipping bundle ${i+1} creation as it has no colleges`);
    }
  }
  
  console.log(`[DEBUG] Returning ${bundles.length} bundles`);
  return bundles;
}

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }
  
  const token = authHeader.split(' ')[1];
  let decoded: { userId: string; role: string };
  
  try {
    decoded = verifyToken(token) as { userId: string; role: string };
  } catch (jwtError: unknown) {
    console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const campaigns = await prisma.companyCampaign.findMany({
      where: {
        companyId: decoded.userId,
      },
      include: {
        metrics: true,
        features: true,
        bundles: true,
      },
    });

    return NextResponse.json({ campaigns });
  } catch (error: unknown) {
    console.error('Campaign retrieval error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to retrieve campaigns', 
      status: 'error' 
    }, { status: 500 });
  }
}