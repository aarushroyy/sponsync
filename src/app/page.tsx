import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-orange-100 rounded-lg -z-10 transform -skew-y-1"></span>
              <span className="relative">Connect</span>
            </span>{" "}
            colleges with{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-orange-100 rounded-lg -z-10 transform -skew-y-1"></span>
              <span className="relative">sponsors</span>
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl">
            SponSync bridges the gap between college events and corporate sponsors,
            making sponsorship management simple, transparent, and effective.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white text-lg rounded-lg px-6 py-6"
              asChild
            >
              <Link href="/auth/college/register">
                Register as College <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50 text-lg rounded-lg px-6 py-6"
              asChild
            >
              <Link href="/auth/company/register">
                Register as Company <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block px-2">
                Why Choose SponSync
                <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-4"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform simplifies sponsorship management from start to finish
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "For Colleges",
                description: "Showcase your events to potential sponsors and manage packages effortlessly",
                features: [
                  "Create customizable sponsorship packages",
                  "Gain visibility to corporate sponsors",
                  "Track sponsorship fulfillment",
                  "Simplify sponsor communication"
                ]
              },
              {
                title: "For Companies",
                description: "Discover college events that align with your brand and sponsorship goals",
                features: [
                  "Browse events by location and type",
                  "Compare sponsorship packages",
                  "Track ROI on sponsorships",
                  "Receive verification reports"
                ]
              },
              {
                title: "Verified by SPOCs",
                description: "Our Single Point of Contact verification ensures transparency and accountability",
                features: [
                  "Independent verification",
                  "Photo documentation",
                  "Metrics tracking",
                  "Detailed implementation reports"
                ]
              }
            ].map((card, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
                <ul className="space-y-3">
                  {card.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How it Works Section */}
      <div className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="relative inline-block px-2">
              How SponSync Works
              <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-4"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our streamlined process connects colleges and companies seamlessly
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Register",
              description: "Colleges and companies create accounts and complete their profiles"
            },
            {
              step: "02",
              title: "Connect",
              description: "Colleges create packages, companies browse and select events"
            },
            {
              step: "03",
              title: "Verify",
              description: "SPOCs verify implementation and track sponsorship metrics"
            },
            {
              step: "04",
              title: "Analyze",
              description: "Both parties receive reports and analytics on performance"
            }
          ].map((step, index) => (
            <div 
              key={index} 
              className="relative"
            >
              <div className="bg-orange-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl font-bold">{step.step}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < 3 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-orange-200 -z-10 transform -translate-x-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="relative inline-block px-2">
              Ready to get started?
              <span className="absolute inset-x-0 bottom-2 bg-orange-500 opacity-30 -z-10 h-4"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join our platform today and transform how you manage sponsorships
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white text-lg rounded-lg px-8 py-6"
              asChild
            >
              <Link href="/auth/college/register">
                Register as College
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-black hover:bg-white/10 hover:text-white text-lg rounded-lg px-8 py-6"
              asChild
            >
              <Link href="/auth/company/register">
                Register as Company
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">SponSync</h3>
              <p className="text-gray-600 text-sm">
                Connecting colleges and companies for meaningful sponsorships
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">For Colleges</h4>
              <ul className="space-y-2">
                <li><Link href="/auth/college/register" className="text-gray-600 hover:text-orange-500">Register</Link></li>
                <li><Link href="/auth/college/login" className="text-gray-600 hover:text-orange-500">Login</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-orange-500">How It Works</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">For Companies</h4>
              <ul className="space-y-2">
                <li><Link href="/auth/company/register" className="text-gray-600 hover:text-orange-500">Register</Link></li>
                <li><Link href="/auth/company/login" className="text-gray-600 hover:text-orange-500">Login</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-orange-500">Browse Events</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">For SPOCs</h4>
              <ul className="space-y-2">
                <li><Link href="/auth/spoc/register" className="text-gray-600 hover:text-orange-500">Register</Link></li>
                <li><Link href="/auth/spoc/login" className="text-gray-600 hover:text-orange-500">Login</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-orange-500">Verification Process</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} SponSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}