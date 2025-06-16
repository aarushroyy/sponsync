import { GraduationCap, Building, ShieldCheck, Send, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CTASection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!name || !email || !message) {
      toast.error("Please fill all fields");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      toast.success("Message sent successfully!");
      // Clear form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-[#262323] text-white py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="relative inline-block px-2">
              Ready to get started?
              <span className="absolute inset-x-0 bottom-2 bg-orange-500 opacity-30 -z-10 h-4"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join our platform today and transform how you manage sponsorships
          </p>
          
          <div className="flex flex-row gap-6 mb-12 justify-center items-center">
            {/* College Card */}
            <div className="w-full max-w-md rounded-xl p-6 hover:scale-105 transition-transform overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff3131] to-[#ff914d] opacity-90"></div>
              <div className="relative z-10">
                <GraduationCap className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">For Colleges</h3>
                <p className="text-white mb-4">Showcase your events and manage sponsorships</p>
                <Link href="/college" passHref>
                  <Button variant="outline" className="w-full border-white text-white bg-transparent hover:bg-white hover:text-orange-500">
                    Register as College
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Company Card */}
            <div className="w-full max-w-md rounded-xl p-6 hover:scale-105 transition-transform overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff3131] to-[#ff914d] opacity-90"></div>
              <div className="relative z-10">
                <Building className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">For Companies</h3>
                <p className="text-white mb-4">Find the perfect events to sponsor</p>
                <Link href="/company" passHref>
                  <Button variant="outline" className="w-full border-white text-white bg-transparent hover:bg-white hover:text-orange-500">
                    Register as Company
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* SPOC Card - Standout Design */}
          <div className="max-w-lg mx-auto mb-12 rounded-xl p-8 hover:scale-105 transition-transform overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff3131] to-[#ff914d] opacity-90"></div>
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-orange-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500 rounded-full opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <ShieldCheck className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">For SPOCs</h3>
              <p className="text-white mb-6">Verify and validate sponsorship implementations as a Single Point of Contact</p>
               <Link href="/auth/spoc/register" passHref>
              <Button variant="outline" className="px-8 py-3 border-2 border-white text-white bg-transparent hover:bg-white hover:text-orange-500">
                Register as SPOC
              </Button>
              </Link>
            </div>
          </div>
          
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="bg-[#313030] text-white py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="relative inline-block px-2">
                Contact Us
                <span className="absolute inset-x-0 bottom-1 bg-orange-500 opacity-30 -z-10 h-3"></span>
              </span>
            </h2>
            <p className="text-xl text-gray-300">Get in touch with our team</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff3131] to-[#ff914d] flex items-center justify-center flex-shrink-0">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Instagram</h3>
                  <a 
                    href="https://www.instagram.com/spon_sync/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-orange-400 hover:underline"
                  >
                    @spon_sync
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff3131] to-[#ff914d] flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Aadi</h3>
                  <a href="tel:+919318301351" className="text-orange-400 hover:underline">+91 9318301351</a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff3131] to-[#ff914d] flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Amogh</h3>
                  <a href="tel:+918130277940" className="text-orange-400 hover:underline">+91 8130277940</a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-[#272626] p-6 rounded-xl">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="What would you like to ask us?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] hover:opacity-90 text-white font-medium rounded flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}