"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  ChevronRight, 
  Zap, 
  Users, 
  Globe, 
  Calendar, 
  UserPlus,
  FileEdit,
  Handshake,
  CheckCircle,
  ArrowRight,
  Building2,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// Sample testimonial data
const testimonials = [
  {
    quote: "SponSync transformed how we manage sponsors for our tech fest. We've increased our sponsorship revenue by 40% since we started using the platform.",
    name: "Priya Sharma",
    title: "Event Coordinator, Delhi Technical University",
    avatar: "P"
  },
  {
    quote: "Finding sponsors used to be our biggest challenge. Now companies approach us through SponSync, and we can focus on making our event amazing instead of chasing sponsorships.",
    name: "Rahul Mehra",
    title: "Cultural Secretary, IIT Bombay",
    avatar: "R"
  },
  {
    quote: "The verification system ensures transparency for both parties. Our sponsors are happier, and we've built relationships that continue year after year.",
    name: "Ananya Patel",
    title: "Student Council President, Manipal University",
    avatar: "A"
  }
];

// Sample success metrics
const successMetrics = [
  { title: "Average Sponsorship Increase", value: "35%", description: "Colleges report higher sponsorship amounts" },
  { title: "Time Saved", value: "70%", description: "Less time spent on sponsorship management" },
  { title: "Returning Sponsors", value: "80%", description: "Companies that sponsor again the next year" }
];

export default function CollegeLandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
                  <span className="relative z-10">Elevate</span>
                </span>
                <br />
                <span>Your College Events with</span>
                <br />
                <span className="relative inline-block">
                  <span className="absolute inset-x-0 bottom-0 h-6 bg-orange-100 -z-10 transform -skew-x-12"></span>
                  <span className="relative z-10 text-orange-500">Perfect Sponsors</span>
                </span>
              </h1>
              
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Find the ideal corporate sponsors for your college events and build lasting partnerships that elevate your institution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600 text-white group">
                  <Link href="/auth/college/register">
                    Register Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-orange-500 text-orange-500 hover:bg-orange-50 group">
                  <Link href="/auth/college/login">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                <div className="flex items-center">
                  <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-600">100+ Companies</span>
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
                  <span className="text-gray-600">₹45M+ Sponsorships</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 bg-white rounded-lg shadow-xl p-2">
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-white">
                  <div className="aspect-[4/3] w-full relative p-8">
                    <div className="relative h-full flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap className="h-48 w-48 text-orange-100" />
                      </div>
                      <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Simplify Sponsorship</h3>
                        <p className="text-gray-700 mb-4">
                          Our platform connects your college events directly with companies looking to sponsor educational initiatives.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 flex-shrink-0">
                              <Zap className="h-4 w-4 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Quick Results</p>
                              <p className="text-xs text-gray-500">Find sponsors faster</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 flex-shrink-0">
                              <Handshake className="h-4 w-4 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Better Deals</p>
                              <p className="text-xs text-gray-500">Standardized packages</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-100 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-50 rounded-full"></div>
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
                Why Colleges Choose SponSync
                <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-4"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Streamline your sponsorship process and maximize support for your events
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "One Click Solution",
                description: "Streamlined process to connect with potential sponsors instantly",
                color: "orange"
              },
              {
                icon: Users,
                title: "Long Term Relationship",
                description: "Build lasting partnerships with companies for future collaborations",
                color: "orange"
              },
              {
                icon: Globe,
                title: "Broaden Exposure",
                description: "Increase your college's visibility in the corporate world",
                color: "orange"
              },
              {
                icon: Calendar,
                title: "Event Management",
                description: "Tools to help you organize and manage your events effectively",
                color: "orange"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
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
      
      {/* Success Metrics Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                  <span className="text-2xl font-bold text-orange-500">{metric.value}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{metric.title}</h3>
                <p className="text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block px-2">
                How It Works
                <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-4"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Five simple steps to connect with companies and secure sponsorships
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-24 left-0 w-full h-0.5 bg-orange-200 z-0"></div>
            
            {[
              {
                icon: UserPlus,
                title: "Register & Sign Up",
                description: "Create your college profile and get started in minutes",
                action: "Register Now",
                link: "/auth/college/register"
              },
              {
                icon: FileEdit,
                title: "Create Event",
                description: "Add your event details, requirements, and sponsorship packages",
                action: "Learn More",
                link: "#"
              },
              {
                icon: Building2,
                title: "Get Connected",
                description: "We'll match you with interested sponsors",
                action: "How It Works",
                link: "#"
              },
              {
                icon: MessageSquare,
                title: "Find SPOC",
                description: "Connect with the company's point of contact",
                action: "Learn More",
                link: "#"
              },
              {
                icon: Handshake,
                title: "Finalize Deal",
                description: "Complete the sponsorship agreement and prepare for your event",
                action: "Get Started",
                link: "/auth/college/register"
              }
            ].map((step, index) => (
              <div key={index} className="relative z-10">
                <div className="bg-white rounded-xl shadow-md p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="relative mb-4">
                    <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="absolute top-0 right-0 h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
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
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block px-2">
                Hear from Other Colleges
                <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-4"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how SponSync has transformed sponsorship for institutions like yours
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold text-xl mr-4">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-sm text-gray-600">{testimonials[activeTestimonial].title}</p>
                </div>
              </div>
              <p className="text-lg text-gray-700 italic">"{testimonials[activeTestimonial].quote}"</p>
            </div>
            
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    index === activeTestimonial ? "bg-orange-500" : "bg-orange-200 hover:bg-orange-300"
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="relative inline-block px-2">
                Ready to elevate your college events?
                <span className="absolute inset-x-0 bottom-2 bg-orange-500 opacity-30 -z-10 h-4"></span>
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join our platform today and connect with companies eager to sponsor educational initiatives
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link href="/auth/college/register">
                  Register Now
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/auth/college/login">
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