// // app/api/company/campaigns/route.ts
// import { NextResponse } from 'next/server';
// import prisma from '@/app/lib/prisma';
// import { verifyToken } from '@/app/lib/jwt';
// import { MetricType, FeatureType, Region, CampaignPlan } from '@prisma/client';

// interface MetricData {
//   type: MetricType;
//   minValue?: number;
//   maxValue?: number;
// }

// interface FeatureData {
//   type: FeatureType;
//   enabled: boolean;
// }

// interface CampaignData {
//   name: string;
//   plan: CampaignPlan;
//   region: Region;
//   eventTypes: string[];
//   bundleSize: number;
//   budgetLimit: number;
//   preSelectedCollegeId?: string;  // Add this
//   optimizationCriteria?: string;  // Add this
//   metrics: MetricData[];
//   features: FeatureData[];
// }

// export async function POST(request: Request): Promise<NextResponse> {
//   // Verify JWT from Authorization header
//   const authHeader = request.headers.get('Authorization');
//   if (!authHeader) {
//     return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
//   }
  
//   const token = authHeader.split(' ')[1];
//   let decoded: { userId: string; role: string };
  
//   try {
//     decoded = verifyToken(token) as { userId: string; role: string };
//   } catch (jwtError: unknown) {
//     console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
//     return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//   }

//   try {
//     console.log("[DEBUG] POST /api/company/campaigns - Starting campaign creation");

//     const campaignData: CampaignData = await request.json();
//     console.log("[DEBUG] Campaign request data:", JSON.stringify(campaignData, null, 2));

//     // Validate required fields
//     if (!campaignData.name || !campaignData.plan || !campaignData.region || 
//         !campaignData.eventTypes || !campaignData.bundleSize) {
//       return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
//     }

//     // Create company campaign
//     const campaign = await prisma.companyCampaign.create({
//       data: {
//         companyId: decoded.userId,
//         name: campaignData.name,
//         plan: campaignData.plan,
//         region: campaignData.region,
//         eventTypes: campaignData.eventTypes,
//         bundleSize: campaignData.bundleSize,
//         budgetLimit: campaignData.budgetLimit || null,
//         status: 'DRAFT',
//       }
//     });

//     console.log("[DEBUG] Campaign created:", campaign.id);


//     // Create metrics for this campaign
//     for (const metric of campaignData.metrics) {
//       await prisma.campaignMetric.create({
//         data: {
//           type: metric.type,
//           minValue: metric.minValue || null,
//           maxValue: metric.maxValue || null,
//           campaignId: campaign.id,
//         }
//       });
//     }

//     console.log("[DEBUG] Creating features, count:", campaignData.features.length);

//     // Create features for this campaign
//     for (const feature of campaignData.features) {
//       await prisma.campaignFeature.create({
//         data: {
//           type: feature.type,
//           enabled: feature.enabled,
//           campaignId: campaign.id,
//         }
//       });
//     }

//     console.log("[DEBUG] Calling generateBundleSuggestions with:", {
//       campaignId: campaign.id,
//       region: campaign.region,
//       eventTypes: campaignData.eventTypes,
//       bundleSize: campaignData.bundleSize,
//       budgetLimit: campaignData.budgetLimit,
//       preSelectedCollegeId: campaignData.preSelectedCollegeId,
//       optimizationCriteria: campaignData.optimizationCriteria || "balanced",
//       metricsCount: campaignData.metrics.length
//     });

//     // Generate bundle suggestions using the matching algorithm
//     const suggestedBundles = await generateBundleSuggestions(
//       campaign.id,
//       campaign.region,
//       campaignData.eventTypes,
//       campaignData.bundleSize,
//       campaignData.metrics,
//       campaignData.budgetLimit,
//       campaignData.preSelectedCollegeId || null,
//       campaignData.optimizationCriteria || "balanced"
//     );

//     console.log("[DEBUG] Bundle generation complete, bundles count:", suggestedBundles.length);
//     if (suggestedBundles.length === 0) {
//       console.log("[DEBUG] No bundles were generated");
//     }

//     return NextResponse.json({
//       message: 'Campaign created successfully',
//       campaign: {
//         ...campaign,
//         metrics: campaignData.metrics,
//         features: campaignData.features,
//         suggestedBundles,
//       }
//     });
//   } catch (error: unknown) {
//     console.error('Campaign creation error:', error instanceof Error ? error.message : 'Unknown error');
//     return NextResponse.json({ 
//       message: error instanceof Error ? error.message : 'Failed to create campaign', 
//       status: 'error' 
//     }, { status: 500 });
//   }
// }

// async function generateBundleSuggestions(
//   campaignId: string,
//   region: Region,
//   eventTypes: string[],
//   bundleSize: number,
//   companyMetrics: MetricData[]
// ) {
//   console.log("[DEBUG] Starting bundle generation with params:", {
//     campaignId,
//     region,
//     eventTypes,
//     bundleSize,
//     companyMetrics: companyMetrics.map(m => ({ type: m.type, min: m.minValue, max: m.maxValue }))
//   });

//   // Find matching colleges based on region and event types
//   console.log("[DEBUG] Finding colleges matching region and event types");
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

//   console.log("[DEBUG] Found matching colleges:", matchingColleges.length);
//   if (matchingColleges.length === 0) {
//     console.log("[DEBUG] No colleges match the region and event types criteria. Returning empty bundle.");
//     return [];
//   }

//   // Log college details for debugging
//   console.log("[DEBUG] College details:");
//   matchingColleges.forEach((college, index) => {
//     console.log(`[DEBUG] College ${index+1}: ${college.college.collegeName}, Event: ${college.eventType}, Packages: ${college.packageConfigs.length}`);
//     // Check if packageConfigs exist and have metrics
//     if (college.packageConfigs.length === 0) {
//       console.log(`[DEBUG] WARNING: College ${college.college.collegeName} has no package configs`);
//     } else {
//       college.packageConfigs.forEach(pkg => {
//         console.log(`[DEBUG]   - Package: ${pkg.tier}, Metrics: ${pkg.metrics.length}, Features: ${pkg.features.length}`);
//         if (pkg.metrics.length === 0) {
//           console.log(`[DEBUG]   WARNING: Package ${pkg.tier} has no metrics`);
//         }
//       });
//     }
//   });

//   // Convert company metrics to a more usable format
//   const metricsMap = companyMetrics.reduce((acc, metric) => {
//     acc[metric.type] = {
//       minValue: metric.minValue || 0,
//       maxValue: metric.maxValue || 0,
//     };
//     return acc;
//   }, {} as Record<string, { minValue: number; maxValue: number }>);
//   console.log("[DEBUG] Company metrics map:", metricsMap);

//   // Calculate the total required metrics (sum of max values)
//   const totalRequiredMetrics: Record<string, number> = {};
//   companyMetrics.forEach(metric => {
//     totalRequiredMetrics[metric.type] = metric.maxValue || 0;
//   });
//   console.log("[DEBUG] Total required metrics:", totalRequiredMetrics);

//   // Score each college based on how well it matches company requirements
//   console.log("[DEBUG] Scoring colleges based on requirements match");
//   const scoredColleges = matchingColleges.map(college => {
//     let score = 0;
    
//     // Start with a base score for region match
//     score += 10;
//     console.log(`[DEBUG] College ${college.college.collegeName} - Base region score: 10`);
    
//     // Add score for event type match
//     if (eventTypes.includes(college.eventType)) {
//       score += 15;
//       console.log(`[DEBUG] College ${college.college.collegeName} - Event type match: +15`);
//     }
    
//     // Find the best package config (e.g., GOLD, SILVER, BRONZE)
//     // Prioritize by tier: GOLD > SILVER > BRONZE
//     const tierOrder = { GOLD: 3, SILVER: 2, BRONZE: 1 };
//     const sortedPackageConfigs = [...college.packageConfigs].sort((a, b) => {
//       return (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0);
//     });
    
//     const bestPackage = sortedPackageConfigs.length > 0 ? sortedPackageConfigs[0] : null;
//     const collegeMetrics: Record<string, number> = {};
    
//     if (bestPackage) {
//       console.log(`[DEBUG] College ${college.college.collegeName} - Best package: ${bestPackage.tier}`);
      
//       // Score based on metrics match
//       for (const metric of bestPackage.metrics) {
//         if (metric.enabled && metricsMap[metric.type]) {
//           // Use lower limit of what college provides (as per requirements)
//           const collegeProvides = metric.minValue || 0;
//           collegeMetrics[metric.type] = collegeProvides;
          
//           // Use upper limit of what company wants
//           const companyWants = metricsMap[metric.type].maxValue || 0;
          
//           // Score based on percentage of fulfillment
//           if (companyWants > 0) {
//             const fulfillmentPercentage = Math.min(100, (collegeProvides / companyWants) * 100);
//             const metricScore = fulfillmentPercentage / 5; // Convert to 0-20 scale
//             score += metricScore;
//             console.log(`[DEBUG] College ${college.college.collegeName} - Metric ${metric.type}: ${collegeProvides}/${companyWants} (${fulfillmentPercentage.toFixed(1)}%) = +${metricScore.toFixed(1)} points`);
//           } else {
//             console.log(`[DEBUG] College ${college.college.collegeName} - Metric ${metric.type}: Company doesn't require this metric`);
//           }
//         } else if (!metric.enabled) {
//           console.log(`[DEBUG] College ${college.college.collegeName} - Metric ${metric.type}: Not enabled`);
//         } else if (!metricsMap[metric.type]) {
//           console.log(`[DEBUG] College ${college.college.collegeName} - Metric ${metric.type}: Not requested by company`);
//         }
//       }
//     } else {
//       console.log(`[DEBUG] WARNING: College ${college.college.collegeName} has no valid package configs`);
//     }
    
//     console.log(`[DEBUG] College ${college.college.collegeName} - Final score: ${score.toFixed(1)}`);
    
//     return {
//       college,
//       score,
//       bestPackage,
//       collegeMetrics,
//     };
//   });

//   // Sort colleges by score (descending)
//   scoredColleges.sort((a, b) => b.score - a.score);
//   console.log("[DEBUG] Top 3 colleges after scoring:", scoredColleges.slice(0, 3).map(c => 
//     `${c.college.college.collegeName} (${c.score.toFixed(1)})`).join(", "));
  
//   // Check if we have enough colleges for at least one bundle
//   if (scoredColleges.length < bundleSize) {
//     console.log(`[DEBUG] Not enough colleges to form a bundle. Need ${bundleSize}, have ${scoredColleges.length}`);
//     return [];
//   }
  
//   // Create bundles
//   console.log("[DEBUG] Creating bundles");
//   const bundles = [];
//   const numBundles = Math.min(3, Math.ceil(scoredColleges.length / bundleSize));
//   console.log(`[DEBUG] Will create ${numBundles} bundles with bundle size ${bundleSize}`);
  
//   // First bundle: highest scoring colleges
//   console.log("[DEBUG] Creating first bundle with highest scoring colleges");
//   const firstBundleColleges = scoredColleges.slice(0, bundleSize);
//   console.log(`[DEBUG] First bundle colleges: ${firstBundleColleges.map(c => c.college.college.collegeName).join(", ")}`);
  
//   // For other bundles, try to optimize for different metrics
//   const bundleApproaches = [
//     firstBundleColleges, // First bundle: highest overall scores
//   ];
  
//   // Second bundle: prioritize colleges that are good at metrics the first bundle is weak at
//   if (numBundles >= 2 && scoredColleges.length > bundleSize) {
//     console.log("[DEBUG] Creating second bundle to complement first bundle's metrics");
    
//     // Find metrics that are underrepresented in the first bundle
//     const firstBundleMetrics: Record<string, number> = {};
//     for (const { collegeMetrics } of firstBundleColleges) {
//       Object.entries(collegeMetrics).forEach(([type, value]) => {
//         firstBundleMetrics[type] = (firstBundleMetrics[type] || 0) + value;
//       });
//     }
//     console.log("[DEBUG] First bundle total metrics:", firstBundleMetrics);
    
//     // Calculate fulfillment percentages
//     const metricFulfillment: Record<string, number> = {};
//     Object.entries(totalRequiredMetrics).forEach(([type, required]) => {
//       if (required > 0) {
//         metricFulfillment[type] = ((firstBundleMetrics[type] || 0) / required) * 100;
//       }
//     });
//     console.log("[DEBUG] First bundle metric fulfillment:", metricFulfillment);
    
//     // Sort metrics by fulfillment percentage (ascending)
//     const prioritizedMetrics = Object.entries(metricFulfillment)
//       .sort(([, a], [, b]) => a - b)
//       .map(([type]) => type);
//     console.log("[DEBUG] Prioritized metrics for second bundle:", prioritizedMetrics);
    
//     // Create a special scoring function that prioritizes these metrics
//     const remainingColleges = scoredColleges.filter(c => 
//       !firstBundleColleges.some(fc => fc.college.id === c.college.id)
//     );
//     console.log(`[DEBUG] Remaining colleges for second bundle: ${remainingColleges.length}`);
    
//     const secondBundleColleges = remainingColleges.map(collegeData => {
//       let specialScore = collegeData.score;
      
//       // Boost score for colleges that fulfill underrepresented metrics
//       prioritizedMetrics.forEach((metricType, index) => {
//         const weight = prioritizedMetrics.length - index; // Higher weight for most underrepresented
//         const collegeMetricValue = collegeData.collegeMetrics[metricType] || 0;
//         if (collegeMetricValue > 0) {
//           const boost = collegeMetricValue * weight * 0.1;
//           specialScore += boost;
//           console.log(`[DEBUG] Boosting ${collegeData.college.college.collegeName} score for ${metricType}: +${boost.toFixed(1)} (now ${specialScore.toFixed(1)})`);
//         }
//       });
      
//       return { ...collegeData, specialScore };
//     })
//     .sort((a, b) => b.specialScore - a.specialScore)
//     .slice(0, bundleSize);
    
//     console.log(`[DEBUG] Second bundle colleges: ${secondBundleColleges.map(c => c.college.college.collegeName).join(", ")}`);
//     bundleApproaches.push(secondBundleColleges);
//   }
  
//   // Third bundle: try to maximize diversity of event types
//   if (numBundles >= 3 && scoredColleges.length > bundleSize * 2) {
//     console.log("[DEBUG] Creating third bundle to maximize event type diversity");
    
//     const usedColleges = [...firstBundleColleges];
//     if (bundleApproaches.length > 1) {
//       usedColleges.push(...bundleApproaches[1]);
//     }
    
//     // Count event types in used bundles
//     const eventTypeCounts: Record<string, number> = {};
//     usedColleges.forEach(c => {
//       const eventType = c.college.eventType;
//       eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;
//     });
//     console.log("[DEBUG] Event type counts from previous bundles:", eventTypeCounts);
    
//     const remainingColleges = scoredColleges.filter(c => 
//       !usedColleges.some(uc => uc.college.id === c.college.id)
//     );
//     console.log(`[DEBUG] Remaining colleges for third bundle: ${remainingColleges.length}`);
    
//     // Create a special scoring function that prioritizes diverse event types
//     const thirdBundleColleges = remainingColleges.map(collegeData => {
//       let diversityScore = collegeData.score;
      
//       // Boost score for colleges with less represented event types
//       const eventType = collegeData.college.eventType;
//       const eventTypeCount = eventTypeCounts[eventType] || 0;
//       const boost = (10 - eventTypeCount) * 5;
//       diversityScore += boost;
//       console.log(`[DEBUG] Boosting ${collegeData.college.college.collegeName} score for diversity of ${eventType}: +${boost} (now ${diversityScore})`);
      
//       return { ...collegeData, diversityScore };
//     })
//     .sort((a, b) => b.diversityScore - a.diversityScore)
//     .slice(0, bundleSize);
    
//     console.log(`[DEBUG] Third bundle colleges: ${thirdBundleColleges.map(c => c.college.college.collegeName).join(", ")}`);
//     bundleApproaches.push(thirdBundleColleges);
//   }
  
//   // Create the actual bundle entities
//   console.log(`[DEBUG] Creating ${bundleApproaches.length} bundle entities in the database`);
//   for (let i = 0; i < bundleApproaches.length; i++) {
//     const bundleColleges = bundleApproaches[i];
    
//     if (bundleColleges.length > 0) {
//       // Calculate total metrics for this bundle
//       const totalMetrics = {} as Record<MetricType, number>;
      
//       for (const { collegeMetrics } of bundleColleges) {
//         Object.entries(collegeMetrics).forEach(([type, value]) => {
//           totalMetrics[type as MetricType] = (totalMetrics[type as MetricType] || 0) + value;
//         });
//       }
//       console.log(`[DEBUG] Bundle ${i+1} total metrics:`, totalMetrics);
      
//       // Calculate fulfillment percentages for this bundle
//       const fulfillmentPercentages = {} as Record<string, number>;
//       Object.entries(totalRequiredMetrics).forEach(([type, required]) => {
//         if (required > 0) {
//           const fulfilled = totalMetrics[type as MetricType] || 0;
//           fulfillmentPercentages[type] = Math.min(100, (fulfilled / required) * 100);
//         }
//       });
//       console.log(`[DEBUG] Bundle ${i+1} fulfillment percentages:`, fulfillmentPercentages);
      
//       try {
//         // Create the bundle
//         console.log(`[DEBUG] Creating bundle ${i+1} in database with ${bundleColleges.length} colleges`);
//         const bundle = await prisma.campaignBundle.create({
//           data: {
//             name: `Bundle ${i + 1}`,
//             campaignId: campaignId,
//             collegeIds: bundleColleges.map(item => item.college.collegeId),
//             status: 'PENDING',
//           },
//         });
//         console.log(`[DEBUG] Bundle created with ID: ${bundle.id}`);
        
//         bundles.push({
//           ...bundle,
//           colleges: bundleColleges.map(item => ({
//             id: item.college.id,
//             collegeName: item.college.college.collegeName,
//             eventName: item.college.college.eventName,
//             eventType: item.college.eventType,
//             posterUrl: item.college.posterUrl,
//             score: item.score,
//           })),
//           totalMetrics,
//           fulfillmentPercentages,
//         });
//       } catch (error) {
//         console.error(`[DEBUG] Error creating bundle ${i+1}:`, error);
//       }
//     } else {
//       console.log(`[DEBUG] Skipping bundle ${i+1} creation as it has no colleges`);
//     }
//   }
  
//   console.log(`[DEBUG] Returning ${bundles.length} bundles`);
//   return bundles;
// }

// Enhanced generateBundleSuggestions function for /api/company/campaigns route.ts
//starts here::::

// import { CollegeOnboarding, PackageConfig } from '@prisma/client';

// async function generateBundleSuggestions(
//   campaignId: string,
//   region: Region,
//   eventTypes: string[],
//   bundleSize: number,
//   companyMetrics: MetricData[],
//   budgetLimit: number,
//   preSelectedCollegeId: string | null = null,
//   optimizationCriteria: string = "balanced"
// ) {
//   console.log("[DEBUG] Starting bundle generation with params:", {
//     campaignId,
//     region,
//     eventTypes,
//     bundleSize,
//     budgetLimit,
//     preSelectedCollegeId,
//     optimizationCriteria,
//     companyMetrics: companyMetrics.map(m => ({ type: m.type, min: m.minValue, max: m.maxValue }))
//   });

//   // Find matching colleges based on region and event types
//   console.log("[DEBUG] Finding colleges matching region and event types");
//   const matchingColleges = await prisma.collegeOnboarding.findMany({
//     where: {
//       region: region,
//       eventType: {
//         in: eventTypes,
//       },
//       // If preSelectedCollegeId is provided, make sure to include that college
//       ...(preSelectedCollegeId ? { 
//         OR: [
//           { collegeId: preSelectedCollegeId },
//           { 
//             AND: [
//               { collegeId: { not: preSelectedCollegeId } },
//               { eventType: { in: eventTypes } }
//             ] 
//           }
//         ]
//       } : {})
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

//   console.log("[DEBUG] Found matching colleges:", matchingColleges.length);
//   if (matchingColleges.length === 0) {
//     console.log("[DEBUG] No colleges match the region and event types criteria. Returning empty bundle.");
//     return [];
//   }

//   // Convert company metrics to a more usable format
//   const metricsMap = companyMetrics.reduce((acc, metric) => {
//     acc[metric.type] = {
//       minValue: metric.minValue || 0,
//       maxValue: metric.maxValue || 0,
//     };
//     return acc;
//   }, {} as Record<string, { minValue: number; maxValue: number }>);
//   console.log("[DEBUG] Company metrics map:", metricsMap);

//   // Calculate the total required metrics (sum of max values)
//   const totalRequiredMetrics: Record<string, number> = {};
//   companyMetrics.forEach(metric => {
//     totalRequiredMetrics[metric.type] = metric.maxValue || 0;
//   });
//   console.log("[DEBUG] Total required metrics:", totalRequiredMetrics);

//   // Score each college package combination based on how well it matches company requirements
//   console.log("[DEBUG] Scoring college package combinations based on requirements match");
  
// //   const allCollegePackageCombinations: Array<{
// //   college: any;
// //   packageConfig: any;
// //   score: number;
// //   collegeMetrics: Record<string, number>;
// //   estimatedAmount: number;
// //   costEffectiveness: number;
// //   roi: number;
// // }> = [];



// const allCollegePackageCombinations: Array<{
//   college: CollegeOnboarding & {
//     college: {
//       collegeName: string;
//       eventName: string;
//     };
//     packageConfigs: PackageConfig[];
//   };
//   packageConfig: PackageConfig & {
//     metrics: Array<{
//       type: MetricType;
//       enabled: boolean;
//       minValue: number | null;
//       maxValue: number | null;
//     }>;
//     features: Array<{
//       type: FeatureType;
//       enabled: boolean;
//     }>;
//   };
//   score: number;
//   collegeMetrics: Record<string, number>;
//   estimatedAmount: number;
//   costEffectiveness: number;
//   roi: number;
// }> = [];

//   // For each college, evaluate each of its package configs
//   for (const college of matchingColleges) {
//     // Skip colleges with no package configs
//     if (college.packageConfigs.length === 0) {
//       console.log(`[DEBUG] College ${college.college.collegeName} has no package configs, skipping`);
//       continue;
//     }

//     // Evaluate each package config for this college
//     for (const packageConfig of college.packageConfigs) {
//       let score = 0;
      
//       // Start with a base score for region match
//       score += 10;
      
//       // Add score for event type match
//       if (eventTypes.includes(college.eventType)) {
//         score += 15;
//       }
      
//       // Get the estimated amount for this package
//       const estimatedAmount = packageConfig.estimatedAmount || 0;
      
//       // Skip if this package would exceed the budget limit
//       if (estimatedAmount > budgetLimit) {
//         console.log(`[DEBUG] Package ${packageConfig.tier} for ${college.college.collegeName} exceeds budget limit (${estimatedAmount} > ${budgetLimit}), skipping`);
//         continue;
//       }
      
//       // Prepare metrics data
//       const collegeMetrics: Record<string, number> = {};
      
//       // Score based on metrics match
//       for (const metric of packageConfig.metrics) {
//         if (metric.enabled && metricsMap[metric.type]) {
//           // Use lower limit of what college provides (as per requirements)
//           const collegeProvides = metric.minValue || 0;
//           collegeMetrics[metric.type] = collegeProvides;
          
//           // Use upper limit of what company wants
//           const companyWants = metricsMap[metric.type].maxValue || 0;
          
//           // Score based on percentage of fulfillment
//           if (companyWants > 0) {
//             const fulfillmentPercentage = Math.min(100, (collegeProvides / companyWants) * 100);
//             const metricScore = fulfillmentPercentage / 5; // Convert to 0-20 scale
//             score += metricScore;
//             console.log(`[DEBUG] College ${college.college.collegeName} - Package ${packageConfig.tier} - Metric ${metric.type}: ${collegeProvides}/${companyWants} (${fulfillmentPercentage.toFixed(1)}%) = +${metricScore.toFixed(1)} points`);
//           }
//         }
//       }
      
//       // Score based on features match
//       // Calculate cost-effectiveness (metrics per rupee)
//       const totalMetricValue = Object.values(collegeMetrics).reduce((sum, value) => sum + value, 0);
//       const costEffectiveness = estimatedAmount > 0 ? totalMetricValue / estimatedAmount : 0;
      
//       // Calculate ROI score (combination of match score and cost-effectiveness)
//       const roi = score * costEffectiveness * 100; // Scale up to make it more readable
      
//       // Add to our list of combinations
//       allCollegePackageCombinations.push({
//         college,
//         packageConfig,
//         score,
//         collegeMetrics,
//         estimatedAmount,
//         costEffectiveness,
//         roi
//       });
      
//       console.log(`[DEBUG] College ${college.college.collegeName} - Package ${packageConfig.tier} - Final score: ${score.toFixed(1)}, Cost: ₹${estimatedAmount}, ROI: ${roi.toFixed(2)}`);
//     }
//   }

//   // If preSelectedCollegeId is provided, make sure at least one of its packages is included
//   if (preSelectedCollegeId && allCollegePackageCombinations.length > 0) {
//     const hasPreSelectedCollege = allCollegePackageCombinations.some(
//       combo => combo.college.collegeId === preSelectedCollegeId
//     );
    
//     if (!hasPreSelectedCollege) {
//       console.log(`[DEBUG] Pre-selected college ${preSelectedCollegeId} not found in available combinations`);
//     }
//   }

//   // Sort combinations based on optimization criteria
//   console.log(`[DEBUG] Sorting combinations based on optimization criteria: ${optimizationCriteria}`);
  
//   if (optimizationCriteria === "metrics") {
//     // Prioritize maximizing metrics fulfillment
//     allCollegePackageCombinations.sort((a, b) => b.score - a.score);
//   } else if (optimizationCriteria === "cost") {
//     // Prioritize minimizing cost
//     allCollegePackageCombinations.sort((a, b) => a.estimatedAmount - b.estimatedAmount);
//   } else if (optimizationCriteria === "roi") {
//     // Prioritize return on investment
//     allCollegePackageCombinations.sort((a, b) => b.roi - a.roi);
//   } else {
//     // Default "balanced" approach - consider both metrics and cost
//     allCollegePackageCombinations.sort((a, b) => {
//       // Normalize scores for fair comparison
//       const scoreWeight = 0.7; // 70% weight on metric score
//       const costWeight = 0.3;   // 30% weight on cost efficiency
      
//       const normalizedScoreA = a.score / 100; // Assuming score is roughly between 0-100
//       const normalizedScoreB = b.score / 100;
      
//       const maxAmount = Math.max(...allCollegePackageCombinations.map(c => c.estimatedAmount));
//       const normalizedCostA = 1 - (a.estimatedAmount / maxAmount); // Lower cost is better
//       const normalizedCostB = 1 - (b.estimatedAmount / maxAmount);
      
//       const balancedScoreA = (normalizedScoreA * scoreWeight) + (normalizedCostA * costWeight);
//       const balancedScoreB = (normalizedScoreB * scoreWeight) + (normalizedCostB * costWeight);
      
//       return balancedScoreB - balancedScoreA;
//     });
//   }

//   console.log(`[DEBUG] Sorted combinations - top 5 colleges:`);
//   allCollegePackageCombinations.slice(0, 5).forEach((combo, i) => {
//     console.log(`[DEBUG] ${i+1}. ${combo.college.college.collegeName} - ${combo.packageConfig.tier} - Score: ${combo.score.toFixed(1)}, Cost: ₹${combo.estimatedAmount}, ROI: ${combo.roi.toFixed(2)}`);
//   });

//   // Check if we have enough colleges for at least one bundle
//   if (allCollegePackageCombinations.length < bundleSize) {
//     console.log(`[DEBUG] Not enough colleges to form a bundle. Need ${bundleSize}, have ${allCollegePackageCombinations.length}`);
//     return [];
//   }

//   // Create bundles using a knapsack-like algorithm
//   console.log("[DEBUG] Creating bundles with knapsack-like algorithm");
//   const bundles = [];
//   const maxBundles = 3; // Create at most 3 bundle options
  
//   // Sort college combinations for bundle creation based on criteria
//   for (let bundleIndex = 0; bundleIndex < maxBundles; bundleIndex++) {
//     // For subsequent bundles, slightly modify the sorting to diversify options
//     if (bundleIndex > 0) {
//       if (optimizationCriteria === "balanced") {
//         // For the second bundle, favor higher metrics but lower cost
//         if (bundleIndex === 1) {
//           allCollegePackageCombinations.sort((a, b) => {
//             return (b.score * 0.5) - (a.estimatedAmount * 0.5) - (a.score * 0.5) + (b.estimatedAmount * 0.5);
//           });
//         }
//         // For the third bundle, favor value for money (ROI)
//         else {
//           allCollegePackageCombinations.sort((a, b) => b.roi - a.roi);
//         }
//       } else if (bundleIndex === 1) {
//         // Just add a bit of randomness for the second bundle to ensure diversity
//         allCollegePackageCombinations.sort((a, b) => {
//           const randomFactor = Math.random() * 0.2 - 0.1; // Random factor between -0.1 and 0.1
//           if (optimizationCriteria === "metrics") {
//             return (b.score - a.score) + randomFactor;
//           } else if (optimizationCriteria === "cost") {
//             return (a.estimatedAmount - b.estimatedAmount) + randomFactor;
//           } else {
//             return (b.roi - a.roi) + randomFactor;
//           }
//         });
//       }
//     }
    
//     // Create a new bundle using knapsack-like approach
//     const selectedCombos = [];
//     const usedCollegeIds = new Set<string>();
//     let totalBundleCost = 0;
    
//     // If there's a pre-selected college, add it first
//     if (preSelectedCollegeId) {
//       const preSelectedCombo = allCollegePackageCombinations.find(
//         combo => combo.college.collegeId === preSelectedCollegeId && combo.estimatedAmount <= budgetLimit
//       );
      
//       if (preSelectedCombo && !usedCollegeIds.has(preSelectedCombo.college.collegeId)) {
//         selectedCombos.push(preSelectedCombo);
//         usedCollegeIds.add(preSelectedCombo.college.collegeId);
//         totalBundleCost += preSelectedCombo.estimatedAmount;
//         console.log(`[DEBUG] Bundle ${bundleIndex+1}: Added pre-selected college ${preSelectedCombo.college.college.collegeName} (${preSelectedCombo.packageConfig.tier}) - Cost: ₹${preSelectedCombo.estimatedAmount}`);
//       }
//     }
    
//     // Add other colleges to fill the bundle up to bundleSize
//     for (const combo of allCollegePackageCombinations) {
//       // Skip if this college is already in the bundle
//       if (usedCollegeIds.has(combo.college.collegeId)) {
//         continue;
//       }
      
//       // Skip if adding this college would exceed the budget
//       if (totalBundleCost + combo.estimatedAmount > budgetLimit) {
//         continue;
//       }
      
//       // Add this college to the bundle
//       selectedCombos.push(combo);
//       usedCollegeIds.add(combo.college.collegeId);
//       totalBundleCost += combo.estimatedAmount;
      
//       console.log(`[DEBUG] Bundle ${bundleIndex+1}: Added college ${combo.college.college.collegeName} (${combo.packageConfig.tier}) - Cost: ₹${combo.estimatedAmount}`);
      
//       // Stop if we've reached the desired bundle size
//       if (selectedCombos.length >= bundleSize) {
//         break;
//       }
//     }
    
//     // Only create a bundle if we have enough colleges
//     if (selectedCombos.length >= Math.min(bundleSize, 2)) {
//       // Calculate total metrics for this bundle
//       const totalMetrics = {} as Record<MetricType, number>;
      
//       for (const combo of selectedCombos) {
//         Object.entries(combo.collegeMetrics).forEach(([type, value]) => {
//           totalMetrics[type as MetricType] = (totalMetrics[type as MetricType] || 0) + value;
//         });
//       }
      
//       // Calculate fulfillment percentages for this bundle
//       const fulfillmentPercentages = {} as Record<string, number>;
//       Object.entries(totalRequiredMetrics).forEach(([type, required]) => {
//         if (required > 0) {
//           const fulfilled = totalMetrics[type as MetricType] || 0;
//           fulfillmentPercentages[type] = Math.min(100, (fulfilled / required) * 100);
//         }
//       });
      
//       // Calculate overall ROI for the bundle
//       // Calculate overall ROI for the bundle
// const totalScore = selectedCombos.reduce((sum, combo) => sum + combo.score, 0);
// const bundleROI = totalBundleCost > 0 ? (totalScore / totalBundleCost * 1000) : 0; // Add zero check

//       try {
//         // Create the bundle in the database
//         const bundle = await prisma.campaignBundle.create({
//           data: {
//             name: `Bundle ${bundleIndex + 1}`,
//             campaignId: campaignId,
//             collegeIds: selectedCombos.map(combo => combo.college.collegeId),
//             status: 'PENDING',
//             totalValue: totalBundleCost,
//           },
//         });
        
//         console.log(`[DEBUG] Created bundle ${bundle.id} with ${selectedCombos.length} colleges, total cost: ₹${totalBundleCost}`);
        
//         bundles.push({
//           ...bundle,
//           colleges: selectedCombos.map(combo => ({
//             id: combo.college.id,
//             collegeName: combo.college.college.collegeName,
//             eventName: combo.college.college.eventName,
//             eventType: combo.college.eventType,
//             posterUrl: combo.college.posterUrl,
//             score: combo.score,
//             estimatedAmount: combo.estimatedAmount,
//             packageTier: combo.packageConfig.tier,
//           })),
//           totalMetrics,
//           fulfillmentPercentages,
//           roi: bundleROI,
//         });
//       } catch (error) {
//         console.error(`[DEBUG] Error creating bundle ${bundleIndex+1}:`, error);
//       }
//     } else {
//       console.log(`[DEBUG] Not enough colleges for bundle ${bundleIndex+1}, skipping`);
//     }
//   }
  
//   console.log(`[DEBUG] Returning ${bundles.length} bundles`);
//   return bundles;
// }

// export async function GET(request: Request): Promise<NextResponse> {
//   const authHeader = request.headers.get('Authorization');
//   if (!authHeader) {
//     return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
//   }
  
//   const token = authHeader.split(' ')[1];
//   let decoded: { userId: string; role: string };
  
//   try {
//     decoded = verifyToken(token) as { userId: string; role: string };
//   } catch (jwtError: unknown) {
//     console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
//     return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//   }

//   try {
//     const campaigns = await prisma.companyCampaign.findMany({
//       where: {
//         companyId: decoded.userId,
//       },
//       include: {
//         metrics: true,
//         features: true,
//         bundles: true,
//       },
//     });

//     return NextResponse.json({ campaigns });
//   } catch (error: unknown) {
//     console.error('Campaign retrieval error:', error instanceof Error ? error.message : 'Unknown error');
//     return NextResponse.json({ 
//       message: error instanceof Error ? error.message : 'Failed to retrieve campaigns', 
//       status: 'error' 
//     }, { status: 500 });
//   }
// }

// app/api/company/campaigns/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';
import { MetricType, FeatureType, Region, CampaignPlan } from '@prisma/client';

interface MetricData {
  type: MetricType;
  minValue?: number;
  maxValue?: number;
  rangeOption?: string;
}

interface FeatureData {
  type: FeatureType;
  enabled: boolean;
  valueOption?: string;
}

interface CampaignData {
  name: string;
  plan: CampaignPlan;
  region: Region;
  eventTypes: string[];
  bundleSize: number;
  budgetLimit: number;
  preSelectedCollegeId?: string;
  optimizationCriteria?: string;
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
        budgetLimit: campaignData.budgetLimit || null,
        status: 'DRAFT',
      }
    });

    console.log("[DEBUG] Campaign created:", campaign.id);

    // Create metrics for this campaign with range options
    for (const metric of campaignData.metrics) {
      await prisma.campaignMetric.create({
        data: {
          type: metric.type,
          minValue: metric.minValue || null,
          maxValue: metric.maxValue || null,
          rangeOption: metric.rangeOption || null,
          campaignId: campaign.id,
        }
      });
    }

    console.log("[DEBUG] Creating features, count:", campaignData.features.length);

    // Create features for this campaign with value options
    for (const feature of campaignData.features) {
      await prisma.campaignFeature.create({
        data: {
          type: feature.type,
          enabled: feature.enabled,
          valueOption: feature.valueOption || null,
          campaignId: campaign.id,
        }
      });
    }

    console.log("[DEBUG] Calling generateBundleSuggestions with:", {
      campaignId: campaign.id,
      region: campaign.region,
      eventTypes: campaignData.eventTypes,
      bundleSize: campaignData.bundleSize,
      budgetLimit: campaignData.budgetLimit,
      preSelectedCollegeId: campaignData.preSelectedCollegeId,
      optimizationCriteria: campaignData.optimizationCriteria || "balanced",
      metricsCount: campaignData.metrics.length
    });

    // Generate bundle suggestions using the matching algorithm
    const suggestedBundles = await generateBundleSuggestions(
      campaign.id,
      campaign.region,
      campaignData.eventTypes,
      campaignData.bundleSize,
      campaignData.metrics,
      campaignData.features,
      campaignData.budgetLimit,
      campaignData.preSelectedCollegeId || null,
      campaignData.optimizationCriteria || "balanced"
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

/**
 * Enhanced generateBundleSuggestions function that considers the new metrics and features structure
 */
async function generateBundleSuggestions(
  campaignId: string,
  region: Region,
  eventTypes: string[],
  bundleSize: number,
  companyMetrics: MetricData[],
  companyFeatures: FeatureData[],
  budgetLimit: number,
  preSelectedCollegeId: string | null = null,
  optimizationCriteria: string = "balanced"
) {
  console.log("[DEBUG] Starting bundle generation with params:", {
    campaignId,
    region,
    eventTypes,
    bundleSize,
    budgetLimit,
    preSelectedCollegeId,
    optimizationCriteria,
    companyMetrics: companyMetrics.map(m => ({ 
      type: m.type, 
      min: m.minValue, 
      max: m.maxValue,
      range: m.rangeOption 
    })),
    companyFeatures: companyFeatures.map(f => ({
      type: f.type,
      enabled: f.enabled,
      value: f.valueOption
    }))
  });

  // Find matching colleges based on region and event types
  console.log("[DEBUG] Finding colleges matching region and event types");
  const matchingColleges = await prisma.collegeOnboarding.findMany({
    where: {
      region: region,
      eventType: {
        in: eventTypes,
      },
      // If preSelectedCollegeId is provided, make sure to include that college
      ...(preSelectedCollegeId ? { 
        OR: [
          { collegeId: preSelectedCollegeId },
          { 
            AND: [
              { collegeId: { not: preSelectedCollegeId } },
              { eventType: { in: eventTypes } }
            ] 
          }
        ]
      } : {})
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

  // Convert company metrics to a more usable format
  // For company metrics, we'll take the UPPER limit of what they ask for
  const metricsMap = companyMetrics.reduce((acc, metric) => {
    acc[metric.type] = {
      minValue: metric.minValue || 0,
      maxValue: metric.maxValue || 0,
      rangeOption: metric.rangeOption || null
    };
    return acc;
  }, {} as Record<string, { minValue: number; maxValue: number; rangeOption: string | null }>);
  console.log("[DEBUG] Company metrics map:", metricsMap);

  // Similar for features
  const featuresMap = companyFeatures.reduce((acc, feature) => {
    acc[feature.type] = {
      enabled: feature.enabled,
      valueOption: feature.valueOption || null
    };
    return acc;
  }, {} as Record<string, { enabled: boolean; valueOption: string | null }>);
  console.log("[DEBUG] Company features map:", featuresMap);

  // Calculate the total required metrics (sum of max values)
  const totalRequiredMetrics: Record<string, number> = {};
  companyMetrics.forEach(metric => {
    // For company requirements, we use MAX value
    totalRequiredMetrics[metric.type] = metric.maxValue || 0;
  });
  console.log("[DEBUG] Total required metrics:", totalRequiredMetrics);

  // Helper function to parse range options into min-max values
  function parseRangeOption(rangeOption: string | null, type: MetricType): { min: number; max: number } {
    if (!rangeOption) return { min: 0, max: 0 };
    
    // Handle special cases based on metric type
    if (type === MetricType.DIGITAL_MARKETING_VIEWS && rangeOption.includes('K')) {
      // Handle "20K-50K" type ranges
      const parts = rangeOption.split('-');
      if (parts.length === 2) {
        const min = parseInt(parts[0].replace(/K/g, '000'));
        const max = parseInt(parts[1].replace(/K/g, '000'));
        return { min, max };
      } else if (rangeOption.endsWith('+')) {
        // Handle "500K+" type ranges
        const min = parseInt(rangeOption.slice(0, -1).replace(/K/g, '000'));
        return { min, max: Number.MAX_SAFE_INTEGER };
      }
    }
    
    // Handle time-based metrics like "30min", "1hour"
    // if ([MetricType.KEYNOTE_SPEAKING, MetricType.ENGAGEMENT_ACTIVITY].includes(type) && 
    //     (rangeOption.includes('min') || rangeOption.includes('hour')))
    if (type === MetricType.KEYNOTE_SPEAKING || type === MetricType.ENGAGEMENT_ACTIVITY)  {
      let minutes = 0;
      if (rangeOption === '30min') minutes = 30;
      else if (rangeOption === '1hour') minutes = 60;
      else if (rangeOption === '1.5hours') minutes = 90;
      else if (rangeOption === '2hours') minutes = 120;
      else if (rangeOption === '2hours+') return { min: 120, max: Number.MAX_SAFE_INTEGER };
      
      return { min: minutes, max: minutes };
    }
    
    // Handle general range with "-"
    if (rangeOption.includes('-')) {
      const [minStr, maxStr] = rangeOption.split('-');
      const min = parseInt(minStr.replace(/\D/g, ''));
      const max = parseInt(maxStr.replace(/\D/g, ''));
      return { min, max };
    }
    
    // Handle ranges with "+"
    if (rangeOption.endsWith('+')) {
      const min = parseInt(rangeOption.slice(0, -1).replace(/\D/g, ''));
      return { min, max: Number.MAX_SAFE_INTEGER };
    }
    
    // Default
    const numericValue = parseInt(rangeOption.replace(/\D/g, '')) || 0;
    return { min: numericValue, max: numericValue };
  }

  // Score each college based on how well it matches company requirements
  console.log("[DEBUG] Scoring colleges based on requirements match");

  interface CollegeData {
    collegeId: string;
    id: string;
    eventType: string;
    region: string;
    posterUrl?: string | null;
    college: {
      collegeName: string;
      eventName: string;
    };
    packageConfigs: PackageConfigData[];
  }
  
  interface PackageConfigData {
    id: string;
    tier: string;
    estimatedAmount?: number | null;
    metrics: Array<{
      type: string;
      enabled: boolean;
      minValue: number | null;
      maxValue: number | null;
      rangeOption?: string | null;
    }>;
    features: Array<{
      type: string;
      enabled: boolean;
      valueOption?: string | null;
    }>;
  }

  const allCollegePackageCombinations: Array<{
    college: CollegeData;
    packageConfig: PackageConfigData;
    score: number;
    collegeMetrics: Record<string, number>;
    estimatedAmount: number;
    costEffectiveness: number;
    roi: number;
  }> = [];

  // For each college, evaluate each of its package configs
  for (const college of matchingColleges) {
    // Skip colleges with no package configs
    if (college.packageConfigs.length === 0) {
      console.log(`[DEBUG] College ${college.college.collegeName} has no package configs, skipping`);
      continue;
    }

    // Evaluate each package config for this college
    for (const packageConfig of college.packageConfigs) {
      let score = 0;
      
      // Start with a base score for region match
      score += 10;
      
      // Add score for event type match
      if (eventTypes.includes(college.eventType)) {
        score += 15;
      }
      
      // Get the estimated amount for this package
      const estimatedAmount = packageConfig.estimatedAmount || 0;
      
      // Skip if this package would exceed the budget limit
      if (budgetLimit > 0 && estimatedAmount > budgetLimit) {
        console.log(`[DEBUG] Package ${packageConfig.tier} for ${college.college.collegeName} exceeds budget limit (${estimatedAmount} > ${budgetLimit}), skipping`);
        continue;
      }
      
      // Prepare metrics data for this college package
      const collegeMetrics: Record<string, number> = {};
      
      // Score based on metrics match
      // For metrics, colleges provide a range, but we'll use the LOWER limit for matching
      for (const metric of packageConfig.metrics) {
        if (metric.enabled && metricsMap[metric.type]) {
          // For college metrics, we use the LOWER limit of what they provide (minValue)
          let collegeProvides = metric.minValue || 0;
          
          // If we have a range option, use it for more accurate comparison
          if (metric.rangeOption) {
            const { min } = parseRangeOption(metric.rangeOption, metric.type);
            collegeProvides = min;
          }
          
          collegeMetrics[metric.type] = collegeProvides;
          
          // For company metrics, we use the UPPER limit of what they want (maxValue)
          let companyWants = metricsMap[metric.type].maxValue || 0;
          
          // If we have a range option for company, use it
          if (metricsMap[metric.type].rangeOption) {
            const { max } = parseRangeOption(metricsMap[metric.type].rangeOption, metric.type);
            companyWants = max;
          }
          
          // Score based on percentage of fulfillment
          if (companyWants > 0) {
            const fulfillmentPercentage = Math.min(100, (collegeProvides / companyWants) * 100);
            const metricScore = fulfillmentPercentage / 5; // Convert to 0-20 scale
            score += metricScore;
            console.log(`[DEBUG] College ${college.college.collegeName} - Package ${packageConfig.tier} - Metric ${metric.type}: ${collegeProvides}/${companyWants} (${fulfillmentPercentage.toFixed(1)}%) = +${metricScore.toFixed(1)} points`);
          }
        }
      }
      
      // Score based on features match
      for (const feature of packageConfig.features) {
        if (featuresMap[feature.type] && featuresMap[feature.type].enabled) {
          if (feature.enabled) {
            // For binary features (Yes/No)
            if (['STALLS', 'TITLE_RIGHTS'].includes(feature.type)) {
              if (feature.valueOption === 'Yes') {
                score += 10;
                console.log(`[DEBUG] College ${college.college.collegeName} - Feature ${feature.type}: +10 points (available)`);
              }
            } 
            // For range-based features (like standees, backdrop time)
            else {
              // Add partial score based on feature match
              score += 5;
              console.log(`[DEBUG] College ${college.college.collegeName} - Feature ${feature.type}: +5 points (available)`);
              
              // If value options match exactly, add bonus
              if (feature.valueOption === featuresMap[feature.type].valueOption) {
                score += 5;
                console.log(`[DEBUG] College ${college.college.collegeName} - Feature ${feature.type}: +5 bonus points (exact match)`);
              }
            }
          }
        }
      }
      
      // Calculate cost-effectiveness (metrics per rupee)
      const totalMetricValue = Object.values(collegeMetrics).reduce((sum, value) => sum + value, 0);
      const costEffectiveness = estimatedAmount > 0 ? totalMetricValue / estimatedAmount : 0;
      
      // Calculate ROI score (combination of match score and cost-effectiveness)
      const roi = score * costEffectiveness * 100; // Scale up to make it more readable
      
      // Add to our list of combinations
      allCollegePackageCombinations.push({
        college: {
          ...college,
          posterUrl: college.posterUrl ?? undefined, // Convert null to undefined
        },
        packageConfig: {
          ...packageConfig,
          estimatedAmount: packageConfig.estimatedAmount ?? undefined, // Convert null to undefined
        },
        score,
        collegeMetrics,
        estimatedAmount,
        costEffectiveness,
        roi
      });
      
      console.log(`[DEBUG] College ${college.college.collegeName} - Package ${packageConfig.tier} - Final score: ${score.toFixed(1)}, Cost: ₹${estimatedAmount}, ROI: ${roi.toFixed(2)}`);
    }
  }

  // If preSelectedCollegeId is provided, make sure at least one of its packages is included
  if (preSelectedCollegeId && allCollegePackageCombinations.length > 0) {
    const hasPreSelectedCollege = allCollegePackageCombinations.some(
      combo => combo.college.collegeId === preSelectedCollegeId
    );
    
    if (!hasPreSelectedCollege) {
      console.log(`[DEBUG] Pre-selected college ${preSelectedCollegeId} not found in available combinations`);
    }
  }

  // Sort combinations based on optimization criteria
  console.log(`[DEBUG] Sorting combinations based on optimization criteria: ${optimizationCriteria}`);
  
  if (optimizationCriteria === "metrics") {
    // Prioritize maximizing metrics fulfillment
    allCollegePackageCombinations.sort((a, b) => b.score - a.score);
  } else if (optimizationCriteria === "cost") {
    // Prioritize minimizing cost
    allCollegePackageCombinations.sort((a, b) => a.estimatedAmount - b.estimatedAmount);
  } else if (optimizationCriteria === "roi") {
    // Prioritize return on investment
    allCollegePackageCombinations.sort((a, b) => b.roi - a.roi);
  } else {
    // Default "balanced" approach - consider both metrics and cost
    allCollegePackageCombinations.sort((a, b) => {
      // Normalize scores for fair comparison
      const scoreWeight = 0.7; // 70% weight on metric score
      const costWeight = 0.3;   // 30% weight on cost efficiency
      
      const normalizedScoreA = a.score / 100; // Assuming score is roughly between 0-100
      const normalizedScoreB = b.score / 100;
      
      const maxAmount = Math.max(...allCollegePackageCombinations.map(c => c.estimatedAmount));
      const normalizedCostA = 1 - (a.estimatedAmount / maxAmount); // Lower cost is better
      const normalizedCostB = 1 - (b.estimatedAmount / maxAmount);
      
      const balancedScoreA = (normalizedScoreA * scoreWeight) + (normalizedCostA * costWeight);
      const balancedScoreB = (normalizedScoreB * scoreWeight) + (normalizedCostB * costWeight);
      
      return balancedScoreB - balancedScoreA;
    });
  }

  console.log(`[DEBUG] Sorted combinations - top 5 colleges:`);
  allCollegePackageCombinations.slice(0, 5).forEach((combo, i) => {
    console.log(`[DEBUG] ${i+1}. ${combo.college.college.collegeName} - ${combo.packageConfig.tier} - Score: ${combo.score.toFixed(1)}, Cost: ₹${combo.estimatedAmount}, ROI: ${combo.roi.toFixed(2)}`);
  });

  // Check if we have enough colleges for at least one bundle
  if (allCollegePackageCombinations.length < bundleSize) {
    console.log(`[DEBUG] Not enough colleges to form a bundle. Need ${bundleSize}, have ${allCollegePackageCombinations.length}`);
    return [];
  }

  // Create bundles using a knapsack-like algorithm
  console.log("[DEBUG] Creating bundles with knapsack-like algorithm");
  const bundles = [];
  const maxBundles = 3; // Create at most 3 bundle options
  
  // Sort college combinations for bundle creation based on criteria
  for (let bundleIndex = 0; bundleIndex < maxBundles; bundleIndex++) {
    // For subsequent bundles, slightly modify the sorting to diversify options
    if (bundleIndex > 0) {
      if (optimizationCriteria === "balanced") {
        // For the second bundle, favor higher metrics but lower cost
        if (bundleIndex === 1) {
          allCollegePackageCombinations.sort((a, b) => {
            return (b.score * 0.5) - (a.estimatedAmount * 0.5) - (a.score * 0.5) + (b.estimatedAmount * 0.5);
          });
        }
        // For the third bundle, favor value for money (ROI)
        else {
          allCollegePackageCombinations.sort((a, b) => b.roi - a.roi);
        }
      } else if (bundleIndex === 1) {
        // Just add a bit of randomness for the second bundle to ensure diversity
        allCollegePackageCombinations.sort((a, b) => {
          const randomFactor = Math.random() * 0.2 - 0.1; // Random factor between -0.1 and 0.1
          if (optimizationCriteria === "metrics") {
            return (b.score - a.score) + randomFactor;
          } else if (optimizationCriteria === "cost") {
            return (a.estimatedAmount - b.estimatedAmount) + randomFactor;
          } else {
            return (b.roi - a.roi) + randomFactor;
          }
        });
      }
    }
    
    // Create a new bundle using knapsack-like approach
    const selectedCombos = [];
    const usedCollegeIds = new Set<string>();
    let totalBundleCost = 0;
    
    // If there's a pre-selected college, add it first
    if (preSelectedCollegeId) {
      const preSelectedCombo = allCollegePackageCombinations.find(
        combo => combo.college.collegeId === preSelectedCollegeId && combo.estimatedAmount <= budgetLimit
      );
      
      if (preSelectedCombo && !usedCollegeIds.has(preSelectedCombo.college.collegeId)) {
        selectedCombos.push(preSelectedCombo);
        usedCollegeIds.add(preSelectedCombo.college.collegeId);
        totalBundleCost += preSelectedCombo.estimatedAmount;
        console.log(`[DEBUG] Bundle ${bundleIndex+1}: Added pre-selected college ${preSelectedCombo.college.college.collegeName} (${preSelectedCombo.packageConfig.tier}) - Cost: ₹${preSelectedCombo.estimatedAmount}`);
      }
    }
    
    // Add other colleges to fill the bundle up to bundleSize
    for (const combo of allCollegePackageCombinations) {
      // Skip if this college is already in the bundle
      if (usedCollegeIds.has(combo.college.collegeId)) {
        continue;
      }
      
      // Skip if adding this college would exceed the budget
      if (budgetLimit > 0 && totalBundleCost + combo.estimatedAmount > budgetLimit) {
        continue;
      }
      
      // Add this college to the bundle
      selectedCombos.push(combo);
      usedCollegeIds.add(combo.college.collegeId);
      totalBundleCost += combo.estimatedAmount;
      
      console.log(`[DEBUG] Bundle ${bundleIndex+1}: Added college ${combo.college.college.collegeName} (${combo.packageConfig.tier}) - Cost: ₹${combo.estimatedAmount}`);
      
      // Stop if we've reached the desired bundle size
      if (selectedCombos.length >= bundleSize) {
        break;
      }
    }
    
    // Only create a bundle if we have enough colleges
    if (selectedCombos.length >= Math.min(bundleSize, 2)) {
      // Calculate total metrics for this bundle
      const totalMetrics = {} as Record<MetricType, number>;
      
      for (const combo of selectedCombos) {
        Object.entries(combo.collegeMetrics).forEach(([type, value]) => {
          totalMetrics[type as MetricType] = (totalMetrics[type as MetricType] || 0) + value;
        });
      }
      
      // Calculate fulfillment percentages for this bundle
      const fulfillmentPercentages = {} as Record<string, number>;
      Object.entries(totalRequiredMetrics).forEach(([type, required]) => {
        if (required > 0) {
          const fulfilled = totalMetrics[type as MetricType] || 0;
          fulfillmentPercentages[type] = Math.min(100, (fulfilled / required) * 100);
        }
      });
      
      // Calculate overall ROI for the bundle
      const totalScore = selectedCombos.reduce((sum, combo) => sum + combo.score, 0);
      const bundleROI = totalBundleCost > 0 ? (totalScore / totalBundleCost * 1000) : 0; // Add zero check

      try {
        // Create the bundle in the database
        const bundle = await prisma.campaignBundle.create({
          data: {
            name: `Bundle ${bundleIndex + 1}`,
            campaignId: campaignId,
            collegeIds: selectedCombos.map(combo => combo.college.collegeId),
            status: 'PENDING',
            totalValue: totalBundleCost,
          },
        });
        
        console.log(`[DEBUG] Created bundle ${bundle.id} with ${selectedCombos.length} colleges, total cost: ₹${totalBundleCost}`);
        
        bundles.push({
          ...bundle,
          colleges: selectedCombos.map(combo => ({
            id: combo.college.id,
            collegeName: combo.college.college.collegeName,
            eventName: combo.college.college.eventName,
            eventType: combo.college.eventType,
            posterUrl: combo.college.posterUrl,
            score: combo.score,
            estimatedAmount: combo.estimatedAmount,
            packageTier: combo.packageConfig.tier,
          })),
          totalMetrics,
          fulfillmentPercentages,
          roi: bundleROI,
        });
      } catch (error) {
        console.error(`[DEBUG] Error creating bundle ${bundleIndex+1}:`, error);
      }
    } else {
      console.log(`[DEBUG] Not enough colleges for bundle ${bundleIndex+1}, skipping`);
    }
  }
  
  console.log(`[DEBUG] Returning ${bundles.length} bundles`);
  return bundles;
}