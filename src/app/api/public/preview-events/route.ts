// src/app/api/public/preview-events/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { EVENT_TYPES } from '@/app/lib/eventTypes';

// This API endpoint returns a limited set of college event data for public preview
// It's intended for marketing pages to show potential sponsors what's available
export async function GET() {
  try {
    // Get a limited set of college onboarding records
    const collegeEvents = await prisma.collegeOnboarding.findMany({
      take: 10, // Limit to 10 events
      where: {
        // You could add conditions here to only show featured events
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
          // Get only the top package for preview
          take: 1,
          orderBy: {
            estimatedAmount: 'desc',
          },
        },
      },
    });

    // Transform the data for the frontend, removing sensitive information
    const eventsForPublic = collegeEvents.map(onboarding => {
      // Get the top package config (should be only one due to take: 1)
      const topPackage = onboarding.packageConfigs[0] || null;

      return {
        id: onboarding.id, // Using onboarding ID instead of college ID for public API
        eventType: onboarding.eventType,
        region: onboarding.region,
        posterUrl: onboarding.posterUrl,
        college: {
          collegeName: onboarding.college.collegeName,
          eventName: onboarding.college.eventName,
        },
        // Only include basic package info for preview
        packageTier: topPackage?.tier || null,
        estimatedAmount: topPackage?.estimatedAmount || null,
      };
    });

    return NextResponse.json({ 
      events: eventsForPublic,
      message: "Preview events loaded successfully" 
    });
  } catch (error: unknown) {
    console.error('Preview events error:', error instanceof Error ? error.message : 'Unknown error');
    
    // Fallback data for testing or if database is unavailable
    const fallbackEvents = [
      {
        id: "preview-1",
        eventType: EVENT_TYPES[3], // "Tech Fest"
        region: "NORTH",
        posterUrl: null,
        college: {
          collegeName: "Delhi Technical University",
          eventName: "TechSummit 2025"
        },
        packageTier: "GOLD",
        estimatedAmount: 50000
      },
      {
        id: "preview-2",
        eventType: EVENT_TYPES[4], // "Cultural Fest"
        region: "SOUTH",
        posterUrl: null,
        college: {
          collegeName: "Bangalore Institute of Technology",
          eventName: "Crescendo 2025"
        },
        packageTier: "SILVER",
        estimatedAmount: 25000
      },
      {
        id: "preview-3",
        eventType: EVENT_TYPES[2], // "Hackathon"
        region: "WEST",
        posterUrl: null,
        college: {
          collegeName: "IIT Mumbai",
          eventName: "CodeNight 2025"
        },
        packageTier: "GOLD",
        estimatedAmount: 35000
      },
      {
        id: "preview-4",
        eventType: EVENT_TYPES[5], // "Sports Event"
        region: "EAST",
        posterUrl: null,
        college: {
          collegeName: "Calcutta University",
          eventName: "Sportify 2025"
        },
        packageTier: "BRONZE",
        estimatedAmount: 15000
      },
      {
        id: "preview-5",
        eventType: EVENT_TYPES[0], // "Club Workshop & Seminar"
        region: "NORTH",
        posterUrl: null,
        college: {
          collegeName: "Amity University",
          eventName: "AI Workshop Series"
        },
        packageTier: "SILVER",
        estimatedAmount: 20000
      },
      {
        id: "preview-6",
        eventType: EVENT_TYPES[0], // "Club Workshop & Seminar"
        region: "SOUTH",
        posterUrl: null,
        college: {
          collegeName: "VIT Chennai",
          eventName: "Industry Connect 2025"
        },
        packageTier: "BRONZE",
        estimatedAmount: 10000
      }
    ];
    
    return NextResponse.json({ 
      events: fallbackEvents,
      message: "Preview events loaded from fallback data" 
    });
  }
}