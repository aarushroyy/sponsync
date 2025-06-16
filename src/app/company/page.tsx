"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  ChevronRight, 
  Target, 
  Shield, 
  Workflow, 
  BarChart, 
  UserPlus, 
  LogIn, 
  Filter, 
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types to match the existing college events data structure
interface CollegeEvent {
  id: string;
  eventType: string;
  region: string;
  posterUrl: string | null;
  college: {
    collegeName: string;
    eventName: string;
  };
  packageTier?: string;
  estimatedAmount?: number;
}

export default function CompanyLandingPage() {
  const [collegeEvents, setCollegeEvents] = useState<CollegeEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewEvents = async () => {
      try {
        setIsLoading(true);
        // This is a public endpoint that doesn't require authentication
        // It fetches a limited set of college events as a preview
        const res = await fetch("/api/public/preview-events");
        
        if (!res.ok) {
          throw new Error("Failed to load preview events");
        }
        
        const data = await res.json();
        setCollegeEvents(data.events.slice(0, 6)); // Limit to 6 events for preview
      } catch (err) {
        console.error("Error fetching preview events:", err);
        setError("Unable to load events preview. Please try again later.");
        // Set some dummy data for demonstration purposes
        setCollegeEvents([
          {
            id: "1",
            eventType: "Technical Fest",
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
            id: "2",
            eventType: "Cultural Fest",
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
            id: "3",
            eventType: "Hackathon",
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
            id: "4",
            eventType: "Sports Event",
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
            id: "5",
            eventType: "Workshop",
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
            id: "6",
            eventType: "Seminar",
            region: "SOUTH",
            posterUrl: null,
            college: {
              collegeName: "VIT Chennai",
              eventName: "Industry Connect 2025"
            },
            packageTier: "BRONZE",
            estimatedAmount: 10000
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreviewEvents();
  }, []);

  // Helper function to get badge color based on region
  const getRegionBadgeColor = (region: string) => {
    switch (region) {
      case "NORTH": return "bg-blue-100 text-blue-800 border-blue-300";
      case "SOUTH": return "bg-green-100 text-green-800 border-green-300";
      case "EAST": return "bg-purple-100 text-purple-800 border-purple-300";
      case "WEST": return "bg-amber-100 text-amber-800 border-amber-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Helper function to get text color based on tier
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "GOLD": return "text-yellow-600";
      case "SILVER": return "text-gray-600";
      case "BRONZE": return "text-amber-700";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="absolute top-0 -left-4 h-72 w-72 bg-orange-100 rounded-full opacity-70 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 bg-orange-50 rounded-full opacity-70 blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                <span className="relative inline-block mb-2">
                  <span className="absolute inset-x-0 bottom-0 h-6 bg-orange-100 -z-10 transform skew-x-12"></span>
                  <span className="relative z-10">Empower</span>
                </span>
                <br />
                <span>Your Brand with</span>
                <br />
                <span className="relative inline-block">
                  <span className="absolute inset-x-0 bottom-0 h-6 bg-orange-100 -z-10 transform -skew-x-12"></span>
                  <span className="relative z-10 text-orange-500">Perfect Sponsors</span>
                </span>
              </h1>
              
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Connect with vibrant college events and boost your brand visibility among young talents across the country.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600 text-white group">
                  <Link href="/auth/company/register">
                    Register Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-orange-500 text-orange-500 hover:bg-orange-50 group">
                  <Link href="/auth/company/login">
                    Sign In
                    <LogIn className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                <div className="flex items-center">
                  <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-600">400+ Events</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-600">200+ Colleges</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-600">100+ Companies</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 bg-white rounded-lg shadow-xl p-2">
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#fff5f0] to-white">
                  <div className="aspect-[4/3] w-full relative p-8">
                    <div className="relative h-full flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="h-48 w-48 text-[#ff914d]" />
                      </div>
                      <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Sponsor With Confidence</h3>
                        <p className="text-gray-700 mb-4">
                          Our platform connects you directly with college events that match your brand values and target audience.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-[#ff914d]/10 flex items-center justify-center mr-2 flex-shrink-0">
                              <Target className="h-4 w-4 text-[#ff914d]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Targeted Reach</p>
                              <p className="text-xs text-gray-500">Connect with your exact audience</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-[#ff914d]/10 flex items-center justify-center mr-2 flex-shrink-0">
                              <Shield className="h-4 w-4 text-[#ff914d]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Verified Results</p>
                              <p className="text-xs text-gray-500">Independent implementation reports</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#ff914d]/10 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#ff3131]/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block px-2">
                Why Companies Choose SponSync
                <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-4"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Streamline your sponsorship process and maximize your ROI with our comprehensive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Brand Exposure",
                description: "Reach thousands of students through sponsored events",
                color: "[#ff914d]"
              },
              {
                icon: Shield,
                title: "Ensuring Deliverables",
                description: "Guarantee your sponsorship benefits are fulfilled",
                color: "[#ff914d]"
              },
              {
                icon: Workflow,
                title: "Smooth Process",
                description: "Streamlined communication and execution workflow",
                color: "[#ff914d]"
              },
              {
                icon: BarChart,
                title: "Quantifiable Data",
                description: "Track your sponsorship impact with detailed metrics",
                color: "[#ff914d]"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-[#fff5f0] via-white to-[#fff5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block px-2">
                How It Works
                <span className="absolute inset-x-0 bottom-2 bg-[#ff914d]/20 -z-10 h-4"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Four simple steps to connect with college events that align with your brand
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-24 left-0 w-full h-0.5 bg-[#ff914d]/20 z-0"></div>
            
            {[
              {
                icon: UserPlus,
                title: "Register",
                description: "Create your company profile with sponsorship preferences",
                action: "Register Now",
                link: "/auth/company/register"
              },
              {
                icon: LogIn,
                title: "Login & Browse",
                description: "Access your dashboard and explore available events",
                action: "Sign In",
                link: "/auth/company/login"
              },
              {
                icon: Filter,
                title: "Choose Events",
                description: "Filter and select events that match your criteria",
                action: "Learn More",
                link: "#"
              },
              {
                icon: MessageSquare,
                title: "Connect!",
                description: "Start collaborating with college event organizers",
                action: "Get Started",
                link: "/auth/company/register"
              }
            ].map((step, index) => (
              <div key={index} className="relative z-10">
                <div className="bg-white rounded-xl shadow-md p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="relative mb-4">
                    <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="absolute top-0 right-0 h-6 w-6 rounded-full bg-[#ff3131] flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <Link href={step.link} className="text-orange-500 font-medium flex items-center hover:underline">
                    {step.action} <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Preview Events Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block px-2">
                Featured College Events
                <span className="absolute inset-x-0 bottom-2 bg-[#ff914d]/20 -z-10 h-4"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Preview a selection of upcoming events available for sponsorship
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-[#ff914d] animate-spin mb-4" />
              <p className="text-gray-600">Loading available events...</p>
            </div>
          ) : error ? (
            <div className="text-center p-12 border rounded-lg bg-red-50 border-red-200 max-w-2xl mx-auto">
              <p className="text-red-600">{error}</p>
              <p className="mt-2 text-gray-600">Please try again later or contact support.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collegeEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-[#fff5f0] to-white relative flex items-center justify-center">
                      {event.posterUrl ? (
                        <img 
                          src={event.posterUrl} 
                          alt={event.college.eventName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                          <Building2 className="h-16 w-16 text-[#ff914d] mb-2" />
                          <h3 className="text-xl font-bold text-center text-gray-700">{event.college.eventName}</h3>
                        </div>
                      )}
                      <Badge className={`absolute top-2 right-2 ${getRegionBadgeColor(event.region)}`}>
                        {event.region}
                      </Badge>
                    </div>
                    <CardContent className="flex-grow pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {event.college.eventName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {event.college.collegeName}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-indigo-50">
                          {event.eventType}
                        </Badge>
                        
                        {event.packageTier && (
                          <span className={`text-sm font-medium ${getTierColor(event.packageTier)}`}>
                            {event.packageTier.charAt(0) + event.packageTier.slice(1).toLowerCase()} Package
                          </span>
                        )}
                      </div>
                      {event.estimatedAmount && (
                        <p className="mt-3 text-sm font-medium">
                          Starting at: ₹{event.estimatedAmount.toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <Link 
                        href="/auth/company/login" 
                        className="text-[#ff914d] hover:text-[#ff3131] hover:underline text-sm font-medium flex items-center w-full justify-center"
                      >
                        Sign in to view details <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-6">
                  This is just a small preview of available events. Sign in to access our full database.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    className="bg-[#ff3131] hover:bg-[#ff914d] text-white"
                  >
                    <Link href="/auth/company/register">
                      Register for Full Access
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    asChild
                    className="border-[#ff914d] text-[#ff914d] hover:bg-[#ff914d]/10"
                  >
                    <Link href="/auth/company/login">
                      Sign In
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="relative inline-block px-2">
                Ready to boost your brand presence?
                <span className="absolute inset-x-0 bottom-2 bg-[#ff914d]/30 -z-10 h-4"></span>
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join our platform today and connect with college events that align with your brand values
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link href="/auth/company/register">
                  Register Now
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                <Link href="/auth/company/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}