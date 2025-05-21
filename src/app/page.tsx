// // "use client";

// // import React, { useState } from 'react';
// // import Link from 'next/link';
// // import { 
// //   ArrowRight, 
// //   CheckCircle, 
// //   Menu, 
// //   X, 
// //   ChevronDown, 
// //   Building, 
// //   GraduationCap, 
// //   Users, 
// //   LineChart, 
// //   ShieldCheck, 
// //   BarChart4,
// //   ArrowUpRight,
// // } from 'lucide-react';

// // // Styled Button component
// // const Button: React.FC<{
// //   children: React.ReactNode;
// //   variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
// //   size?: "sm" | "md" | "lg" | "xl";
// //   className?: string;
// //   onClick?: React.MouseEventHandler<HTMLButtonElement>;
// //   type?: "button" | "submit" | "reset";
// //   disabled?: boolean;
// //   [key: string]: React.ReactNode | string | boolean | React.MouseEventHandler<HTMLButtonElement> | undefined;
// // }> = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
// //   const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
  
// //   const variants = {
// //     primary: "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500",
// //     secondary: "bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 focus:ring-orange-500",
// //     outline: "bg-transparent hover:bg-orange-50 text-orange-500 border border-orange-500 focus:ring-orange-500",
// //     ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
// //     dark: "bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-900",
// //   };
  
// //   const sizes = {
// //     sm: "text-sm px-3 py-2",
// //     md: "text-base px-4 py-2",
// //     lg: "text-lg px-6 py-3",
// //     xl: "text-xl px-8 py-4",
// //   };
  
// //   return (
// //     <button 
// //       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
// //       {...props}
// //     >
// //       {children}
// //     </button>
// //   );
// // };

// // const HomePage = () => {
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
// //   return (
// //     <div className="min-h-screen bg-gray-900">
// //       {/* Header/Navbar */}
// //       <header className="bg-white border-b sticky top-0 z-50">
// //         <div className="container mx-auto px-4">
// //           <div className="flex items-center justify-between h-16">
// //             {/* Logo */}
// //             <div className="flex items-center">
// //               <Link href="/" className="flex items-center">
// //                 <span className="text-2xl font-bold text-gray-900">Spon<span className="text-orange-500">Sync</span></span>
// //               </Link>
// //             </div>
            
// //             {/* Main Navigation - Desktop */}
// //             <nav className="hidden md:flex items-center space-x-1">
// //               <div className="relative group">
// //               <button className="px-3 py-2 text-gray-700 hover:text-orange-500 rounded-md flex items-center">
// //     For Colleges <ChevronDown className="ml-1 h-4 w-4" />
// //   </button>
// //   <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
// //     <a href="/college" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500">Why SponSync</a>
// //     <a href="/auth/college/login" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500">Login</a>
// //     <a href="/auth/college/register" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500">Register</a>
// //   </div>
// //               </div>
              
// //               <div className="relative group">
// //   <button className="px-3 py-2 text-gray-700 hover:text-orange-500 rounded-md flex items-center">
// //     For Companies <ChevronDown className="ml-1 h-4 w-4" />
// //   </button>
// //   <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
// //     <a href="/company" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500">Why Sponsor</a>
// //     <a href="/auth/company/login" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500">Login</a>
// //     <a href="/auth/company/register" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500">Register</a>
// //   </div>
// // </div>
              
// //               <div className="relative group">
// //                 <button className="px-3 py-2 text-gray-700 hover:text-orange-500 rounded-md flex items-center">
// //                   For SPOCs <ChevronDown className="ml-1 h-4 w-4" />
// //                 </button>
// //                 <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
// //                   <a href="/auth/spoc/login" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500">Login</a>
// //                   <a href="/auth/spoc/register" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500">Register</a>
// //                 </div>
// //               </div>
              
// //               <div className="relative group">
// //                 <button className="px-3 py-2 text-gray-700 hover:text-orange-500 rounded-md flex items-center">
// //                   For Admins <ChevronDown className="ml-1 h-4 w-4" />
// //                 </button>
// //                 <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
// //                   <a href="/auth/admin/login" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500">Login</a>
// //                 </div>
// //               </div>
              
// //               <a href="#features" className="px-3 py-2 text-gray-700 hover:text-orange-500 rounded-md">
// //                 Features
// //               </a>
              
// //               <a href="#how-it-works" className="px-3 py-2 text-gray-700 hover:text-orange-500 rounded-md">
// //                 How It Works
// //               </a>
// //             </nav>
            
// //             {/* Mobile menu button */}
// //             <div className="md:hidden">
// //               <button 
// //                 type="button" 
// //                 className="text-gray-700 hover:text-orange-500"
// //                 onClick={() => setIsMenuOpen(!isMenuOpen)}
// //               >
// //                 {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* Mobile Navigation Menu */}
// //         {isMenuOpen && (
// //           <div className="md:hidden bg-white border-t py-2">
// //             <div className="container mx-auto px-4 space-y-1">
// //               <div className="py-2 border-b">
// //                 <p className="font-medium text-gray-900 mb-2">For Colleges</p>
// //                 <a href="/auth/college/login" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md">Login</a>
// //                 <a href="/auth/college/register" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md">Register</a>
// //               </div>
              
// //               <div className="py-2 border-b">
// //                 <p className="font-medium text-gray-900 mb-2">For Companies</p>
// //                 <a href="/auth/company/login" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md">Login</a>
// //                 <a href="/auth/company/register" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md">Register</a>
// //               </div>
              
// //               <div className="py-2 border-b">
// //                 <p className="font-medium text-gray-900 mb-2">For SPOCs</p>
// //                 <a href="/auth/spoc/login" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md">Login</a>
// //                 <a href="/auth/spoc/register" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md">Register</a>
// //               </div>
              
// //               <div className="py-2 border-b">
// //                 <p className="font-medium text-gray-900 mb-2">For Admins</p>
// //                 <a href="/auth/admin/login" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md">Login</a>
// //               </div>
              
// //               <a href="#features" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md">Features</a>
// //               <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md">How It Works</a>
// //             </div>
// //           </div>
// //         )}
// //       </header>

// //       <main>
// //         {/* Hero Section */}
// //         <section className="relative overflow-hidden">
// //           {/* Background pattern elements */}
// //           <div className="absolute top-0 -left-4 h-72 w-72 bg-orange-900/30 rounded-full opacity-70 blur-3xl"></div>
// //           <div className="absolute bottom-0 right-0 h-96 w-96 bg-orange-50 rounded-full opacity-70 blur-3xl"></div>
// //           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 -z-10"></div>
          
// //           <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
// //             <div className="flex flex-col lg:flex-row items-center">
// //               <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left mb-10 lg:mb-0">
// //                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
// //                   <span className="relative inline-block mb-2">
// //                     <span className="absolute inset-x-0 bottom-0 h-6 bg-orange-100 -z-10 transform skew-x-12"></span>
// //                     <span className="relative z-10">Connect</span>
// //                   </span>
// //                   <br />
// //                   <span>colleges with</span>
// //                   <br />
// //                   <span className="relative inline-block">
// //                     <span className="absolute inset-x-0 bottom-0 h-6 bg-orange-100 -z-10 transform -skew-x-12"></span>
// //                     <span className="relative z-10 text-orange-500">sponsors</span>
// //                   </span>
// //                 </h1>
                
// //                 <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
// //                   SponSync bridges the gap between college events and corporate sponsors, making sponsorship management simple, transparent, and effective.
// //                 </p>

// //                 <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
// //                 <Link href="/college" passHref>

// //                   <Button size="xl" className="group">
// //                     Register as College
// //                     <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
// //                   </Button>
// //                   </Link>
// //                   <Link href="/company" passHref>
// //                   <Button variant="outline" size="xl" className="group">
// //                     Register as Company
// //                     <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
// //                   </Button>
// //                   </Link>
// //                 </div>
                
// //                 <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
// //                   <div className="flex items-center">
// //                     <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
// //                       <CheckCircle className="h-4 w-4 text-green-600" />
// //                     </div>
// //                     <span className="text-gray-600">500+ Events</span>
// //                   </div>
// //                   <div className="flex items-center">
// //                     <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
// //                       <CheckCircle className="h-4 w-4 text-green-600" />
// //                     </div>
// //                     <span className="text-gray-600">200+ Colleges</span>
// //                   </div>
// //                   <div className="flex items-center">
// //                     <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
// //                       <CheckCircle className="h-4 w-4 text-green-600" />
// //                     </div>
// //                     <span className="text-gray-600">100+ Companies</span>
// //                   </div>
// //                 </div>
// //               </div>
              
// //               <div className="lg:w-1/2 relative">
// //                 {/* Main illustration */}
// //                 <div className="relative z-10 bg-white rounded-lg shadow-xl p-2">
// //                   <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-white">
// //                     <div className="aspect-[4/3] w-full relative">
// //                       {/* College and company illustration */}
// //                       <div className="absolute inset-0 flex items-center justify-center">
// //                         <div className="flex flex-col md:flex-row items-center gap-6 p-6">
// //                           <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs transform transition-transform hover:scale-105">
// //                             <div className="flex items-center mb-4">
// //                               <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
// //                                 <GraduationCap className="h-6 w-6 text-orange-500" />
// //                               </div>
// //                               <div className="ml-4">
// //                                 <h3 className="font-bold text-gray-900">Colleges</h3>
// //                                 <p className="text-sm text-gray-500">Event showcasing</p>
// //                               </div>
// //                             </div>
// //                             <div className="space-y-2">
// //                               <div className="h-2 bg-orange-100 rounded w-3/4"></div>
// //                               <div className="h-2 bg-orange-100 rounded w-4/5"></div>
// //                               <div className="h-2 bg-orange-100 rounded w-2/3"></div>
// //                             </div>
// //                           </div>
                          
// //                           <div className="flex items-center justify-center">
// //                             <ArrowRight className="h-8 w-8 text-orange-500 mx-2" />
// //                           </div>
                          
// //                           <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs transform transition-transform hover:scale-105">
// //                             <div className="flex items-center mb-4">
// //                               <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
// //                                 <Building className="h-6 w-6 text-blue-500" />
// //                               </div>
// //                               <div className="ml-4">
// //                                 <h3 className="font-bold text-gray-900">Companies</h3>
// //                                 <p className="text-sm text-gray-500">Sponsorship opportunities</p>
// //                               </div>
// //                             </div>
// //                             <div className="space-y-2">
// //                               <div className="h-2 bg-blue-100 rounded w-3/4"></div>
// //                               <div className="h-2 bg-blue-100 rounded w-4/5"></div>
// //                               <div className="h-2 bg-blue-100 rounded w-2/3"></div>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
                      
// //                       {/* Graph overlay */}
// //                       <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-white/80 to-transparent flex items-end justify-center p-4">
// //                         <div className="w-full bg-white/90 rounded-lg shadow-sm p-3 flex items-center justify-between">
// //                           <div className="space-y-1">
// //                             <div className="text-xs text-gray-500">Connecting Companies & Colleges</div>
// //                             <div className="text-lg font-bold text-gray-900">Increasing Sponsroships </div>
// //                           </div>
// //                           <div className="flex items-center h-10 gap-1">
// //                             <div className="h-3 w-1 bg-orange-200 rounded-t"></div>
// //                             <div className="h-5 w-1 bg-orange-300 rounded-t"></div>
// //                             <div className="h-6 w-1 bg-orange-400 rounded-t"></div>
// //                             <div className="h-8 w-1 bg-orange-500 rounded-t"></div>
// //                             <div className="h-4 w-1 bg-orange-400 rounded-t"></div>
// //                             <div className="h-7 w-1 bg-orange-500 rounded-t"></div>
// //                             <div className="h-10 w-1 bg-orange-600 rounded-t"></div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 {/* Decorative elements */}
// //                 <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-100 rounded-full"></div>
// //                 <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-50 rounded-full"></div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
        
// //         {/* Stats Section */}
// //         <section className="bg-white py-12">
// //           <div className="container mx-auto px-4">
// //             <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg overflow-hidden">
// //               <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
// //                 {[
// //                   { value: "40+", label: "College Events", icon: GraduationCap },
// //                   { value: "₹45k+", label: "Sponsorships Facilitated", icon: BarChart4 },
// //                   { value: "92%", label: "Satisfaction Rate", icon: CheckCircle }
// //                 ].map((stat, index) => (
// //                   <div key={index} className="p-8 text-center">
// //                     <stat.icon className="h-10 w-10 mx-auto mb-4 text-white/80" />
// //                     <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
// //                     <p className="text-white/80 font-medium">{stat.label}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Features Section */}
// //         <section id="features" className="py-20 bg-gray-50">
// //           <div className="container mx-auto px-4">
// //             <div className="text-center mb-16">
// //               <h2 className="text-4xl font-bold text-gray-900 mb-4">
// //                 <span className="relative inline-block px-2">
// //                   Why Choose SponSync
// //                   <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-4"></span>
// //                 </span>
// //               </h2>
// //               <p className="text-lg text-gray-600 max-w-3xl mx-auto">
// //                 Our platform simplifies sponsorship management from start to finish
// //               </p>
// //             </div>
            
// //             <div className="grid md:grid-cols-3 gap-8">
// //               {[
// //                 {
// //                   icon: GraduationCap,
// //                   title: "For Colleges",
// //                   description: "Showcase your events to potential sponsors and manage packages effortlessly",
// //                   features: [
// //                     "Create customizable sponsorship packages",
// //                     "Gain visibility to corporate sponsors",
// //                     "Track sponsorship fulfillment",
// //                     "Simplify sponsor communication"
// //                   ],
// //                   color: "orange"
// //                 },
// //                 {
// //                   icon: Building,
// //                   title: "For Companies",
// //                   description: "Discover college events that align with your brand and sponsorship goals",
// //                   features: [
// //                     "Browse events by location and type",
// //                     "Compare sponsorship packages",
// //                     "Track ROI on sponsorships",
// //                     "Receive verification reports"
// //                   ],
// //                   color: "blue"
// //                 },
// //                 {
// //                   icon: ShieldCheck,
// //                   title: "Verified by SPOCs",
// //                   description: "Our Single Point of Contact verification ensures transparency and accountability",
// //                   features: [
// //                     "Independent verification",
// //                     "Photo documentation",
// //                     "Metrics tracking",
// //                     "Detailed implementation reports"
// //                   ],
// //                   color: "green"
// //                 }
// //               ].map((card, index) => (
// //                 <div 
// //                   key={index} 
// //                   className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 group"
// //                 >
// //                   <div className={`h-16 w-16 rounded-full bg-${card.color}-100 flex items-center justify-center mb-6 group-hover:bg-${card.color}-200 transition-colors`}>
// //                     <card.icon className={`h-8 w-8 text-${card.color}-500`} />
// //                   </div>
                  
// //                   <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
// //                   <p className="text-gray-600 mb-6">{card.description}</p>
// //                   <ul className="space-y-3">
// //                     {card.features.map((feature, i) => (
// //                       <li key={i} className="flex items-start">
// //                         <CheckCircle className={`h-5 w-5 text-${card.color}-500 mt-0.5 mr-2 flex-shrink-0`} />
// //                         <span className="text-gray-700">{feature}</span>
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>
        
// //         {/* Testimonials & Integration Graph Section */}
// //         <section className="py-20 bg-white">
// //           <div className="container mx-auto px-4">
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// //               {/* Testimonials */}
// //               <div>
// //                 <h2 className="text-3xl font-bold text-gray-900 mb-8">
// //                   <span className="relative inline-block px-2">
// //                     What Our Users Say
// //                     <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-3"></span>
// //                   </span>
// //                 </h2>
                
// //                 <div className="space-y-6">
// //                   {[
// //                     {
// //                       quote: "SponSync transformed how we manage sponsors for our tech fest. We've increased our sponsorship revenue by 40% since we started using the platform.",
// //                       name: "Priya Sharma",
// //                       title: "Event Coordinator, Delhi Technical University",
// //                       avatar: "P"
// //                     },
// //                     {
// //                       quote: "As a marketing manager, I love how easy it is to find relevant college events in our target regions. The verification by SPOCs gives us confidence that our brand is being represented correctly.",
// //                       name: "Rahul Mehra",
// //                       title: "Marketing Manager, TechCorp Solutions",
// //                       avatar: "R"
// //                     }
// //                   ].map((testimonial, index) => (
// //                     <div key={index} className="bg-orange-50 rounded-lg p-6 relative">
// //                       <div className="absolute top-0 right-0 w-10 h-10 bg-orange-100 rounded-full -mt-4 -mr-4"></div>
                      
// //                       <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                      
// //                       <div className="flex items-center">
// //                         <div className="h-10 w-10 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center font-bold mr-3">
// //                           {testimonial.avatar}
// //                         </div>
// //                         <div>
// //                           <p className="font-medium text-gray-900">{testimonial.name}</p>
// //                           <p className="text-sm text-gray-600">{testimonial.title}</p>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
              
// //               {/* Integration Graph */}
// //               <div className="bg-white rounded-xl shadow-lg p-6">
// //                 <h2 className="text-3xl font-bold text-gray-900 mb-6">
// //                   <span className="relative inline-block px-2">
// //                     Seamless Integration
// //                     <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-3"></span>
// //                   </span>
// //                 </h2>
                
// //                 <div className="relative h-72 bg-gradient-to-br from-gray-50 to-white rounded-lg border p-4 mb-6">
// //                   <div className="absolute inset-0 flex items-center justify-center">
// //                     <div className="w-full max-w-md">
// //                       {/* Integration flow visualization */}
// //                       <div className="flex flex-col items-center">
// //                         {/* Central hub */}
// //                         <div className="relative bg-white rounded-full shadow-lg p-4 h-24 w-24 flex items-center justify-center mb-4 z-10">
// //                           <div className="text-center">
// //                             <span className="text-xl font-bold text-orange-500">Spon</span>
// //                             <span className="text-xl font-bold text-gray-900">Sync</span>
// //                           </div>
                          
// //                           {/* Connection lines */}
// //                           <div className="absolute top-0 left-1/2 h-10 w-0.5 bg-orange-200 -translate-x-1/2 -translate-y-full"></div>
// //                           <div className="absolute bottom-0 left-1/2 h-10 w-0.5 bg-orange-200 -translate-x-1/2 translate-y-full"></div>
// //                           <div className="absolute left-0 top-1/2 h-0.5 w-10 bg-orange-200 -translate-x-full -translate-y-1/2"></div>
// //                           <div className="absolute right-0 top-1/2 h-0.5 w-10 bg-orange-200 translate-x-full -translate-y-1/2"></div>
// //                         </div>
                        
// //                         {/* Connected elements */}
// //                         <div className="grid grid-cols-2 gap-16 w-full">
// //                           <div className="col-span-1 flex flex-col items-center">
// //                             <div className="bg-orange-50 rounded-lg shadow-sm p-3 w-32 text-center mb-3">
// //                               <GraduationCap className="h-6 w-6 text-orange-500 mx-auto mb-1" />
// //                               <p className="text-sm font-medium">Colleges</p>
// //                             </div>
// //                             <div className="bg-orange-50 rounded-lg shadow-sm p-3 w-32 text-center">
// //                               <Building className="h-6 w-6 text-orange-500 mx-auto mb-1" />
// //                               <p className="text-sm font-medium">Companies</p>
// //                             </div>
// //                           </div>
                          
// //                           <div className="col-span-1 flex flex-col items-center">
// //                             <div className="bg-orange-50 rounded-lg shadow-sm p-3 w-32 text-center mb-3">
// //                               <Users className="h-6 w-6 text-orange-500 mx-auto mb-1" />
// //                               <p className="text-sm font-medium">SPOCs</p>
// //                             </div>
// //                             <div className="bg-orange-50 rounded-lg shadow-sm p-3 w-32 text-center">
// //                               <LineChart className="h-6 w-6 text-orange-500 mx-auto mb-1" />
// //                               <p className="text-sm font-medium">Analytics</p>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 <div className="space-y-4">
// //                   <div className="flex items-start">
// //                     <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
// //                     <p className="text-gray-700">Connect all stakeholders in one centralized platform</p>
// //                   </div>
// //                   <div className="flex items-start">
// //                     <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
// //                     <p className="text-gray-700">Real-time tracking of sponsorship fulfillment</p>
// //                   </div>
// //                   <div className="flex items-start">
// //                     <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
// //                     <p className="text-gray-700">Transparent reporting and verified implementation</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
        
// //         {/* How it Works Section */}
// //         <section id="how-it-works" className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-100">
// //           <div className="container mx-auto px-4">
// //             <div className="text-center mb-16">
// //               <h2 className="text-4xl font-bold text-gray-900 mb-4">
// //                 <span className="relative inline-block px-2">
// //                   How SponSync Works
// //                   <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-4"></span>
// //                 </span>
// //               </h2>
// //               <p className="text-lg text-gray-600 max-w-3xl mx-auto">
// //                 Our streamlined process connects colleges and companies seamlessly
// //               </p>
// //             </div>
            
// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
// //               {/* Connection line */}
// //               <div className="hidden md:block absolute top-1/3 left-0 w-full h-0.5 bg-orange-200 z-0"></div>
              
// //               {[
// //                 {
// //                   step: "01",
// //                   title: "Register",
// //                   description: "Colleges and companies create accounts and complete their profiles with relevant information.",
// //                   icon: Users
// //                 },
// //                 {
// //                   step: "02",
// //                   title: "Connect",
// //                   description: "Colleges create packages, companies browse and select events that match their sponsorship goals.",
// //                   icon: ArrowUpRight
// //                 },
// //                 {
// //                   step: "03",
// //                   title: "Verify",
// //                   description: "SPOCs verify implementation and track sponsorship metrics with photo evidence.",
// //                   icon: ShieldCheck
// //                 },
// //                 {
// //                   step: "04",
// //                   title: "Analyze",
// //                   description: "Both parties receive reports and analytics on performance and ROI.",
// //                   icon: BarChart4
// //                 }
// //               ].map((step, index) => (
// //                 <div key={index} className="relative z-10">
// //                   <div className="bg-white rounded-xl shadow-md p-6 h-full hover:shadow-lg transition-shadow">
// //                     <div className="bg-orange-50 rounded-full w-16 h-16 flex items-center justify-center mb-4 relative">
// //                       <step.icon className="h-8 w-8 text-orange-500" />
// //                       <div className="absolute top-0 right-0 bg-orange-500 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold -mt-1 -mr-1">
// //                         {step.step}
// //                       </div>
// //                     </div>
// //                     <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
// //                     <p className="text-gray-600">{step.description}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>
        
// //         {/* Metrics Visualization Section */}
// //         <section className="py-20 bg-white">
// //           <div className="container mx-auto px-4">
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
// //               <div>
// //                 <h2 className="text-3xl font-bold text-gray-900 mb-6">
// //                   <span className="relative inline-block px-2">
// //                     Measurable Results
// //                     <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-3"></span>
// //                   </span>
// //                 </h2>
                
// //                 <p className="text-lg text-gray-600 mb-8">
// //                   Track the success of your sponsorships with real metrics and verified data. Our platform provides transparency and accountability for all parties.
// //                 </p>
                
// //                 <div className="space-y-6">
// //                   {[
// //                     {
// //                       title: "Engagement Metrics",
// //                       description: "Track audience engagement, reach, impressions, and interactions",
// //                       icon: Users,
// //                       color: "orange"
// //                     },
// //                     {
// //                       title: "Financial Tracking",
// //                       description: "Monitor sponsorship value, ROI, and budget allocation",
// //                       icon: BarChart4,
// //                       color: "green"
// //                     },
// //                     {
// //                       title: "Implementation Verification",
// //                       description: "Photo evidence and third-party validation of deliverables",
// //                       icon: ShieldCheck,
// //                       color: "blue" 
// //                     }
// //                   ].map((metric, index) => (
// //                     <div key={index} className="flex">
// //                       <div className={`h-12 w-12 rounded-lg bg-${metric.color}-100 flex items-center justify-center mr-4 flex-shrink-0`}>
// //                         <metric.icon className={`h-6 w-6 text-${metric.color}-500`} />
// //                       </div>
// //                       <div>
// //                         <h4 className="font-bold text-gray-900 mb-1">{metric.title}</h4>
// //                         <p className="text-gray-600">{metric.description}</p>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
              
// //               <div className="flex gap-8 mt-8">
// //                   <Link href="/college" passHref>
// //                     <Button size="lg" className="group">
// //                       Explore College 
// //                       <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
// //                     </Button>
// //                   </Link>
                  
// //                   <Link href="/company" passHref>
// //                     <Button size="lg" className="group">
// //                       Explore Company 
// //                       <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
// //                     </Button>
// //                   </Link>
// //                 </div>

// //               </div>
              
// //               {/* Metrics Visualization */}
// //               <div className="bg-white rounded-xl shadow-lg p-8 relative">
// //                 <div className="bg-orange-50 absolute top-0 right-0 w-24 h-24 rounded-bl-3xl"></div>
                
// //                 <div className="relative z-10">
// //                   <h3 className="text-xl font-bold text-gray-900 mb-6">Sponsorship Performance Dashboard</h3>
                  
// //                   {/* Dashboard mockup */}
// //                   <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
// //                     <div className="p-4 border-b">
// //                       <div className="flex justify-between items-center">
// //                         <div className="font-medium">Techfest 2025 Metrics</div>
// //                         <div className="flex space-x-2">
// //                           <div className="h-3 w-3 rounded-full bg-red-500"></div>
// //                           <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
// //                           <div className="h-3 w-3 rounded-full bg-green-500"></div>
// //                         </div>
// //                       </div>
// //                     </div>
                    
// //                     <div className="p-6">
// //                       {/* Engagement chart */}
// //                       <div className="mb-6">
// //                         <div className="flex justify-between items-center mb-2">
// //                           <div className="text-sm font-medium text-gray-700">Engagement Metrics</div>
// //                           <div className="text-xs text-gray-500">Last 30 days</div>
// //                         </div>
// //                         <div className="h-32 w-full bg-gray-50 rounded-lg p-3 flex items-end space-x-1">
// //                           {[35, 50, 30, 70, 45, 65, 55, 40, 50, 75, 60, 50, 65, 35].map((height, i) => (
// //                             <div 
// //                               key={i} 
// //                               className="h-full flex-1 flex flex-col justify-end"
// //                             >
// //                               <div 
// //                                 className="bg-orange-500 rounded-t transition-all duration-500"
// //                                 style={{ height: `${height}%` }}
// //                               ></div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
                      
// //                       {/* Key metrics */}
// //                       <div className="grid grid-cols-3 gap-4">
// //                         {[
// //                           { label: "Total Reach", value: "12.4K", change: "+24%" },
// //                           { label: "Engagement", value: "8.6K", change: "+12%" },
// //                           { label: "Conversion", value: "3.2%", change: "+0.8%" }
// //                         ].map((metric, index) => (
// //                           <div key={index} className="bg-gray-50 rounded-lg p-3">
// //                             <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
// //                             <div className="flex items-end justify-between">
// //                               <div className="text-xl font-bold text-gray-900">{metric.value}</div>
// //                               <div className="text-xs text-green-500">{metric.change}</div>
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
                      
// //                       {/* Sponsor breakdown */}
// //                       <div className="mt-6">
// //                         <div className="text-sm font-medium text-gray-700 mb-2">Sponsor Breakdown</div>
// //                         <div className="space-y-2">
// //                           {[
// //                             { name: "Gold Sponsors", value: 45, color: "bg-yellow-500" },
// //                             { name: "Silver Sponsors", value: 30, color: "bg-gray-400" },
// //                             { name: "Bronze Sponsors", value: 25, color: "bg-amber-600" }
// //                           ].map((tier, index) => (
// //                             <div key={index} className="flex items-center">
// //                               <div className="w-24 text-xs text-gray-600">{tier.name}</div>
// //                               <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
// //                                 <div 
// //                                   className={`h-full ${tier.color}`} 
// //                                   style={{ width: `${tier.value}%` }}
// //                                 ></div>
// //                               </div>
// //                               <div className="w-8 text-xs text-gray-600 text-right">{tier.value}%</div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
        
// //         {/* CTA Section */}
// //         <section className="bg-gray-900 text-white py-20">
// //           <div className="container mx-auto px-4 max-w-4xl text-center">
// //             <h2 className="text-4xl md:text-5xl font-bold mb-6">
// //               <span className="relative inline-block px-2">
// //                 Ready to get started?
// //                 <span className="absolute inset-x-0 bottom-2 bg-orange-500 opacity-30 -z-10 h-4"></span>
// //               </span>
// //             </h2>
// //             <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
// //               Join our platform today and transform how you manage sponsorships
// //             </p>
            
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
// //               <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
// //                 <GraduationCap className="h-12 w-12 text-orange-400 mx-auto mb-4" />
// //                 <h3 className="text-xl font-bold mb-2">For Colleges</h3>
// //                 <p className="text-gray-300 mb-4">Showcase your events and manage sponsorships</p>
// //                 <Link href="/college" passHref>
// //                 <Button variant="outline" className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
// //                   Register as College
// //                 </Button>
// //                 </Link>
// //               </div>
              
// //               <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
// //                 <Building className="h-12 w-12 text-orange-400 mx-auto mb-4" />
// //                 <h3 className="text-xl font-bold mb-2">For Companies</h3>
// //                 <p className="text-gray-300 mb-4">Find the perfect events to sponsor</p>
// //                 <Link href="/company" passHref>
// //                 <Button variant="outline" className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
// //                   Register as Company
// //                 </Button>
// //                 </Link>
// //               </div>
              
// //               <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
// //                 <ShieldCheck className="h-12 w-12 text-orange-400 mx-auto mb-4" />
// //                 <h3 className="text-xl font-bold mb-2">For SPOCs</h3>
// //                 <p className="text-gray-300 mb-4">Verify and validate sponsorship implementations</p>
// //                 <Button variant="outline" className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
// //                   Register as SPOC
// //                 </Button>
// //               </div>
// //             </div>
            
// //             <p className="text-gray-400">Already have an account? <a href="/login" className="text-orange-400 hover:underline">Log in here</a></p>
// //           </div>
// //         </section>
// //       </main>
      
// //       {/* Footer */}
// //       <footer className="bg-white border-t">
// //         <div className="container mx-auto px-4 py-12">
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
// //             <div className="col-span-2">
// //               <Link href="/" className="inline-block mb-4">
// //                 <span className="text-2xl font-bold text-gray-900">Spon<span className="text-orange-500">Sync</span></span>
// //               </Link>
// //               <p className="text-gray-600 mb-4 max-w-xs">
// //                 Connecting colleges and companies for meaningful sponsorships that benefit everyone.
// //               </p>
// //               <div className="flex space-x-4">
// //                 <a href="#" className="text-gray-400 hover:text-gray-500">
// //                   <span className="sr-only">Twitter</span>
// //                   <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
// //                     <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
// //                   </svg>
// //                 </a>
// //                 <a href="#" className="text-gray-400 hover:text-gray-500">
// //                   <span className="sr-only">LinkedIn</span>
// //                   <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
// //                     <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
// //                   </svg>
// //                 </a>
// //                 <a href="#" className="text-gray-400 hover:text-gray-500">
// //                   <span className="sr-only">Instagram</span>
// //                   <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
// //                     <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
// //                   </svg>
// //                 </a>
// //               </div>
// //             </div>
            
// //             <div>
// //               <h4 className="font-bold text-gray-900 mb-4">For Colleges</h4>
// //               <ul className="space-y-2">
// //                 <li><a href="/auth/college/register" className="text-gray-600 hover:text-orange-500">Register</a></li>
// //                 <li><a href="/auth/college/login" className="text-gray-600 hover:text-orange-500">Login</a></li>
// //                 <li><a href="/college" className="text-gray-600 hover:text-orange-500">How It Works</a></li>
// //               </ul>
// //             </div>
            
// //             <div>
// //   <h4 className="font-bold text-gray-900 mb-4">For Companies</h4>
// //   <ul className="space-y-2">
// //     <li><a href="/company" className="text-gray-600 hover:text-orange-500">Why Sponsor</a></li>
// //     <li><a href="/auth/company/register" className="text-gray-600 hover:text-orange-500">Register</a></li>
// //     <li><a href="/auth/company/login" className="text-gray-600 hover:text-orange-500">Login</a></li>
// //     <li><a href="#features" className="text-gray-600 hover:text-orange-500">Benefits</a></li>
// //   </ul>
// // </div>
            
// //             {/* <div>
// //               <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
// //               <ul className="space-y-2">
// //                 <li><a href="#" className="text-gray-600 hover:text-orange-500">Help Center</a></li>
// //                 <li><a href="#" className="text-gray-600 hover:text-orange-500">Blog</a></li>
// //                 <li><a href="#" className="text-gray-600 hover:text-orange-500">Case Studies</a></li>
// //                 <li><a href="#" className="text-gray-600 hover:text-orange-500">Contact Us</a></li>
// //               </ul>
// //             </div> */}
// //           </div>
// //             <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
// //               <p className="text-gray-500 text-sm mb-4 md:mb-0">
// //                 © {new Date().getFullYear()} SponSync. All rights reserved.
// //               </p>
// //               <div className="flex space-x-6">
// //                 <a href="#" className="text-gray-500 text-sm hover:text-gray-700">Privacy Policy</a>
// //                 <a href="#" className="text-gray-500 text-sm hover:text-gray-700">Terms of Service</a>
// //                 <a href="#" className="text-gray-500 text-sm hover:text-gray-700">Cookie Policy</a>
// //               </div>
// //             </div>
// //           </div>
// //         </footer>
// //     </div>
// //   );
// // };

// // export default HomePage;
// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { 
//   ArrowRight, 
//   CheckCircle, 
//   Menu, 
//   X, 
//   ChevronDown, 
//   Building, 
//   GraduationCap, 
//   ShieldCheck, 
// } from 'lucide-react';

// // Custom Button component with new color scheme
// const Button: React.FC<{
//   children: React.ReactNode;
//   variant?: "primary" | "secondary" | "outline" | "ghost";
//   size?: "sm" | "md" | "lg" | "xl";
//   className?: string;
//   onClick?: React.MouseEventHandler<HTMLButtonElement>;
//   type?: "button" | "submit" | "reset";
//   disabled?: boolean;
//   [key: string]: React.ReactNode | string | boolean | React.MouseEventHandler<HTMLButtonElement> | undefined;
// }> = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
//   const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-lg focus:outline-none";
  
//   const variants = {
//     primary: "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:from-[#ff4141] hover:to-[#ff9d5d] shadow-lg hover:shadow-xl hover:shadow-orange-900/30",
//     secondary: "bg-[#272626] text-white border-2 border-[#3a3939] hover:border-[#ff3131] hover:bg-[#313030]",
//     outline: "border-2 border-[#ff3131] text-white hover:bg-[#ff3131]/10",
//     ghost: "text-white hover:bg-[#272626]",
//   };
  
//   const sizes = {
//     sm: "text-sm px-4 py-2",
//     md: "text-base px-6 py-3",
//     lg: "text-lg px-8 py-4",
//     xl: "text-xl px-10 py-5",
//   };
  
//   return (
//     <button 
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const HomePage = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
//   return (
//     <div className="min-h-screen bg-[#313030]">
//       {/* Navigation */}
//       <header className="bg-[#272626] border-b border-[#3a3939] sticky top-0 z-50">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between h-20">
//             <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent">
//               SponSync
//             </Link>
            
//             {/* Desktop Nav */}
//             <nav className="hidden md:flex items-center gap-6">
//               <div className="relative group">
//                 <button className="text-white/80 hover:text-white flex items-center gap-1 py-2 px-3 rounded-lg transition-all">
//                   Colleges <ChevronDown className="h-4 w-4" />
//                 </button>
//                 <div className="absolute hidden group-hover:block bg-[#272626] border border-[#3a3939] rounded-lg p-2 min-w-[200px] mt-2">
//                   <a href="#" className="block px-4 py-2 hover:bg-[#313030] rounded-md text-white/80 hover:text-white">Features</a>
//                   <a href="#" className="block px-4 py-2 hover:bg-[#313030] rounded-md text-white/80 hover:text-white">Register</a>
//                   <a href="#" className="block px-4 py-2 hover:bg-[#313030] rounded-md text-white/80 hover:text-white">Login</a>
//                 </div>
//               </div>
              
//               <div className="relative group">
//                 <button className="text-white/80 hover:text-white flex items-center gap-1 py-2 px-3 rounded-lg transition-all">
//                   Companies <ChevronDown className="h-4 w-4" />
//                 </button>
//                 <div className="absolute hidden group-hover:block bg-[#272626] border border-[#3a3939] rounded-lg p-2 min-w-[200px] mt-2">
//                   <a href="#" className="block px-4 py-2 hover:bg-[#313030] rounded-md text-white/80 hover:text-white">Benefits</a>
//                   <a href="#" className="block px-4 py-2 hover:bg-[#313030] rounded-md text-white/80 hover:text-white">Register</a>
//                   <a href="#" className="block px-4 py-2 hover:bg-[#313030] rounded-md text-white/80 hover:text-white">Login</a>
//                 </div>
//               </div>
              
//               <a href="#features" className="text-white/80 hover:text-white py-2 px-3 rounded-lg transition-all">
//                 Features
//               </a>
//               <a href="#cta" className="text-white/80 hover:text-white py-2 px-3 rounded-lg transition-all">
//                 Contact
//               </a>
//             </nav>

//             <button 
//               className="md:hidden text-white/80 hover:text-white"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="bg-gradient-to-b from-[#313030] to-[#262323] py-20">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col lg:flex-row items-center gap-12">
//             <div className="lg:w-1/2 text-center lg:text-left">
//               <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
//                 <span className="text-white">Connect Colleges with</span>{' '}
//                 <span className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent">
//                   Sponsors
//                 </span>
//               </h1>
//               <p className="text-white/80 text-lg mb-8 max-w-2xl">
//                 Revolutionizing sponsorship management through seamless connections between academic institutions and corporate partners.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//                 <Button size="xl" className="group">
//                   College Registration
//                   <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-all" />
//                 </Button>
//                 <Button variant="outline" size="xl">
//                   Company Registration
//                 </Button>
//               </div>
//             </div>

//             <div className="lg:w-1/2 relative mt-12 lg:mt-0">
//               <div className="relative bg-[#272626] rounded-2xl p-1 shadow-2xl">
//                 <div className="bg-gradient-to-br from-[#313030] to-[#262323] rounded-xl p-8">
//                   <div className="flex flex-col gap-6">
//                     <div className="bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-xl p-1 shadow-lg">
//   <div className="bg-[#313030]/90 backdrop-blur-sm rounded-xl p-6 h-full border border-[#3a3939]/30">
//     <div className="flex items-center gap-4 mb-4">
//       <div className="bg-white p-3 rounded-lg">
//         <GraduationCap className="h-8 w-8 text-[#ff3131]" />
//       </div>
//       <div>
//         <h3 className="text-white text-xl font-bold">Colleges</h3>
//         <p className="text-white/80">500+ Registered</p>
//       </div>
//     </div>
//     <div className="space-y-2">
//       {[75, 85, 90].map((width, i) => (
//         <div key={i} className="h-2 bg-[#272626] rounded-full">
//           <div 
//             className="h-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full transition-all duration-500" 
//             style={{ width: `${width}%` }}
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// </div>


//                     <div className="bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-xl p-1 shadow-lg">
//   <div className="bg-[#313030]/90 backdrop-blur-sm rounded-xl p-6 h-full border border-[#3a3939]/30">
//     <div className="flex items-center gap-4 mb-4">
//       <div className="bg-white p-3 rounded-lg">
//         <Building className="h-8 w-8 text-[#ff3131]" />
//       </div>
//       <div>
//         <h3 className="text-white text-xl font-bold">Companies</h3>
//         <p className="text-white/80">200+ Partnerships</p>
//       </div>
//     </div>
//     <div className="space-y-2">
//       {[65, 75, 80].map((width, i) => (
//         <div key={i} className="h-2 bg-[#272626] rounded-full">
//           <div 
//             className="h-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full transition-all duration-500" 
//             style={{ width: `${width}%` }}
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
// <section id="features" className="bg-[#272626] py-20">
//   <div className="container mx-auto px-4">
//     <div className="text-center mb-16">
//       <h2 className="text-4xl font-bold text-white mb-4">
//         Powerful Features for
//         <span className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent ml-2">
//           Seamless Collaboration
//         </span>
//       </h2>
//       <p className="text-white/80 max-w-2xl mx-auto">
//         Everything you need to manage sponsorships effectively
//       </p>
//     </div>

//     <div className="grid md:grid-cols-3 gap-8">
//       {[
//         {
//           icon: GraduationCap,
//           title: "College Solutions",
//           features: ["Event Management", "Sponsor Matching", "Progress Tracking"]
//         },
//         {
//           icon: Building,
//           title: "Company Solutions",
//           features: ["Opportunity Discovery", "ROI Analytics", "Campaign Management"]
//         },
//         {
//           icon: ShieldCheck,
//           title: "Verification System",
//           features: ["SPOC Verification", "Documentation", "Compliance Checks"]
//         }
//       ].map((card, index) => (
//         <div 
//           key={index} 
//           className="bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-xl p-8 transition-all hover:shadow-xl hover:shadow-orange-900/30"
//         >
//           <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-full">
//             <div className="bg-white w-fit p-3 rounded-lg mb-6">
//               <card.icon className="h-8 w-8 text-[#ff3131]" />
//             </div>
//             <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
//             <ul className="space-y-3">
//               {card.features.map((feature, i) => (
//                 <li key={i} className="flex items-center text-white/90 hover:text-white transition-all">
//                   <CheckCircle className="h-5 w-5 text-white mr-2" />
//                   {feature}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>

// <div className="bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-xl p-1 shadow-lg">
//     <div className="bg-[#313030]/90 backdrop-blur-sm rounded-xl p-6 h-full border border-[#3a3939]/30">
//     <div className="flex items-center gap-4 mb-4">
//       <div className="bg-white p-3 rounded-lg">
//         <GraduationCap className="h-8 w-8 text-[#ff3131]" />
//       </div>
//       <div>
//         <h3 className="text-white text-xl font-bold">Colleges</h3>
//         <p className="text-white/80">500+ Registered</p>
//       </div>
//     </div>
//     <div className="space-y-2">
//       {[75, 85, 90].map((width, i) => (
//         <div key={i} className="h-2 bg-[#272626] rounded-full">
//           <div 
//             className="h-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full transition-all duration-500" 
//             style={{ width: `${width}%` }}
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// </div>

// <section id="cta" className="bg-[#262323] py-20">
//   <div className="container mx-auto px-4 text-center">
//     <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-3xl p-1 shadow-2xl">
//       <div className="bg-[#262323] rounded-3xl p-12">
//         <h2 className="text-4xl font-bold text-white mb-4">
//           Ready to Transform Sponsorships?
//         </h2>
//         <p className="text-white/80 mb-8 max-w-xl mx-auto">
//           Join hundreds of institutions and companies already benefiting from SponSync
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Button size="lg">Start Free Trial</Button>
//           <Button variant="secondary">Schedule Demo</Button>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>

//       {/* Footer */}
//       <footer className="bg-[#272626] border-t border-[#3a3939]">
//         <div className="container mx-auto px-4 py-12">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h3 className="text-white font-bold mb-4">SponSync</h3>
//               <p className="text-white/80">
//                 Connecting academia and industry through innovative sponsorship solutions.
//               </p>
//             </div>
            
//             <div>
//               <h4 className="text-white font-bold mb-4">For Colleges</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-white/80 hover:text-white">How It Works</a></li>
//                 <li><a href="#" className="text-white/80 hover:text-white">Pricing</a></li>
//                 <li><a href="#" className="text-white/80 hover:text-white">Case Studies</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="text-white font-bold mb-4">For Companies</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-white/80 hover:text-white">Benefits</a></li>
//                 <li><a href="#" className="text-white/80 hover:text-white">Success Stories</a></li>
//                 <li><a href="#" className="text-white/80 hover:text-white">Integration</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="text-white font-bold mb-4">Legal</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-white/80 hover:text-white">Privacy Policy</a></li>
//                 <li><a href="#" className="text-white/80 hover:text-white">Terms of Service</a></li>
//                 <li><a href="#" className="text-white/80 hover:text-white">Security</a></li>
//               </ul>
//             </div>
//           </div>
          
//           <div className="border-t border-[#3a3939] pt-8 text-center">
//             <p className="text-white/80">
//               © {new Date().getFullYear()} SponSync. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;

 "use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  Building,
  GraduationCap,
} from 'lucide-react';

// Custom Button with dark/orange variants
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  [key: string]: React.ReactNode | string | boolean | React.MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-gradient-to-r from-[#ff3131] to-[#ff914d] hover:from-[#ff914d] hover:to-[#ff3131] text-white focus:ring-[#ff3131]",
    secondary: "bg-white hover:bg-[#313030] text-[#ff3131] border border-[#ff3131] focus:ring-[#ff3131]",
    outline: "bg-transparent hover:bg-[#313030] text-[#ff3131] border border-[#ff3131] focus:ring-[#ff3131]",
    ghost: "bg-transparent hover:bg-[#272626] text-white focus:ring-[#ff3131]",
    dark: "bg-[#262323] hover:bg-[#313030] text-white focus:ring-[#ff3131]",
  };

  const sizes = {
    sm: "text-sm px-3 py-2",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
    xl: "text-xl px-8 py-4",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Black shades for backgrounds
  const bgMain = "bg-[#272626]";
  const bgSection = "bg-[#313030]";
  // const bgCard = "bg-gradient-to-tr from-[#ff3131] via-[#ff914d] to-[#ff3131]";

  return (
    <div className={`min-h-screen ${bgMain} text-white`}>
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-[#262323] border-b border-[#313030]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
  <Image
    src="/sponsyncLogos.png" // <-- change to your logo path (see below)
    alt="SponSync Logo"
    width={40}  // or your preferred size
    height={40}
    className="object-contain"
    priority
  />
  <span className="text-2xl font-bold text-white">
    Spon<span className="text-[#ff914d]">Sync</span>
  </span>
</Link>

            </div>

            {/* Main Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* For Colleges */}
              <div className="relative group">
                <button className="px-3 py-2 text-white hover:text-[#ff914d] rounded-md flex items-center">
                  For Colleges <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full w-48 bg-[#313030] shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="/college" className="block px-4 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d]">Why SponSync</a>
                  <a href="/auth/college/login" className="block px-4 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d]">Login</a>
                  <a href="/auth/college/register" className="block px-4 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d]">Register</a>
                </div>
              </div>

              {/* For Companies */}
              <div className="relative group">
                <button className="px-3 py-2 text-white hover:text-[#ff914d] rounded-md flex items-center">
                  For Companies <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full w-48 bg-[#313030] shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="/company" className="block px-4 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d]">Why Sponsor</a>
                  <a href="/auth/company/login" className="block px-4 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d]">Login</a>
                  <a href="/auth/company/register" className="block px-4 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d]">Register</a>
                </div>
              </div>

              {/* For SPOCs */}
              <div className="relative group">
                <button className="px-3 py-2 text-white hover:text-[#ff914d] rounded-md flex items-center">
                  For SPOCs <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full w-48 bg-[#313030] shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="/auth/spoc/login" className="block px-4 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d]">Login</a>
                </div>
              </div>

              {/* Features & How It Works */}
              <a href="#features" className="px-3 py-2 text-white hover:text-[#ff914d] rounded-md">
                Features
              </a>
              <a href="#how-it-works" className="px-3 py-2 text-white hover:text-[#ff914d] rounded-md">
                How It Works
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-white hover:text-[#ff914d]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#313030] border-t border-[#272626] py-2">
            <div className="container mx-auto px-4 space-y-1">
              <div className="py-2 border-b border-[#272626]">
                <p className="font-medium text-white mb-2">For Colleges</p>
                <a href="/auth/college/login" className="block px-3 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d] rounded-md">Login</a>
                <a href="/auth/college/register" className="block px-3 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d] rounded-md">Register</a>
              </div>
              <div className="py-2 border-b border-[#272626]">
                <p className="font-medium text-white mb-2">For Companies</p>
                <a href="/auth/company/login" className="block px-3 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d] rounded-md">Login</a>
                <a href="/auth/company/register" className="block px-3 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d] rounded-md">Register</a>
              </div>
              <div className="py-2 border-b border-[#272626]">
                <p className="font-medium text-white mb-2">For SPOCs</p>
                <a href="/auth/spoc/login" className="block px-3 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d] rounded-md">Login</a>
              </div>
              <a href="#features" className="block px-3 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d] rounded-md">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-white hover:bg-[#ff3131]/30 hover:text-[#ff914d] rounded-md">How It Works</a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Decorative BG */}
          <div className="absolute top-0 -left-4 h-72 w-72 bg-[#ff3131]/20 rounded-full opacity-70 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 bg-[#ff914d]/20 rounded-full opacity-70 blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#262323] via-[#313030] to-[#272626] -z-10"></div>

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Left: Text */}
              <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left mb-10 lg:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                  <span className="relative inline-block mb-2">
                    <span className="absolute inset-x-0 bottom-0 h-6 bg-[#ff914d]/30 -z-10 transform skew-x-12"></span>
                    <span className="relative z-10">Connect</span>
                  </span>
                  <br />
                  <span>colleges with</span>
                  <br />
                  <span className="relative inline-block">
                    <span className="absolute inset-x-0 bottom-0 h-6 bg-[#ff3131]/30 -z-10 transform -skew-x-12"></span>
                    <span className="relative z-10 text-[#ff914d]">sponsors</span>
                  </span>
                </h1>

                <p className="mt-6 text-xl text-[#ff914d]/80 max-w-2xl mx-auto lg:mx-0">
                  SponSync bridges the gap between college events and corporate sponsors, making sponsorship management simple, transparent, and effective.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                  <Link href="/college" passHref>
                    <Button size="xl" className="group shadow-lg shadow-[#ff3131]/20">
                      Register as College
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/company" passHref>
                    <Button variant="outline" size="xl" className="group border-2 border-[#ff914d] shadow-lg shadow-[#ff914d]/20">
                      Register as Company
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#ff914d]/30">
                      <CheckCircle className="h-4 w-4 text-[#ff914d]" />
                    </div>
                    <span className="text-white">500+ Events</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#ff914d]/30">
                      <CheckCircle className="h-4 w-4 text-[#ff914d]" />
                    </div>
                    <span className="text-white">200+ Colleges</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#ff914d]/30">
                      <CheckCircle className="h-4 w-4 text-[#ff914d]" />
                    </div>
                    <span className="text-white">100+ Companies</span>
                  </div>
                </div>
              </div>

              {/* Right: Illustration */}
              <div className="lg:w-1/2 relative">
                <div className="relative z-10 rounded-lg shadow-xl p-2 bg-[#313030]">
                  <div className="relative rounded-lg overflow-hidden" style={{
                    background: "linear-gradient(135deg, #ff3131 0%, #ff914d 100%)"
                  }}>
                    <div className="aspect-[4/3] w-full relative flex items-center justify-center p-6">
                      {/* College Card */}
                      <div className="bg-[#262323] rounded-lg shadow-lg p-6 max-w-xs transform transition-transform hover:scale-105 border border-[#ff3131]/40">
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 bg-[#ff3131]/30 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-[#ff914d]" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-bold text-white">Colleges</h3>
                            <p className="text-sm text-[#ff914d]/80">Event showcasing</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-[#ff914d]/30 rounded w-3/4"></div>
                          <div className="h-2 bg-[#ff914d]/30 rounded w-4/5"></div>
                          <div className="h-2 bg-[#ff914d]/30 rounded w-2/3"></div>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="flex items-center justify-center mx-4">
                        <ArrowRight className="h-8 w-8 text-white" />
                      </div>
                      {/* Company Card */}
                      <div className="bg-[#262323] rounded-lg shadow-lg p-6 max-w-xs transform transition-transform hover:scale-105 border border-[#ff914d]/40">
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 bg-[#ff914d]/30 rounded-full flex items-center justify-center">
                            <Building className="h-6 w-6 text-[#ff3131]" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-bold text-white">Companies</h3>
                            <p className="text-sm text-[#ff3131]/80">Sponsorship offers</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-[#ff3131]/30 rounded w-3/4"></div>
                          <div className="h-2 bg-[#ff3131]/30 rounded w-4/5"></div>
                          <div className="h-2 bg-[#ff3131]/30 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={`${bgSection} py-20`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Why SponSync?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="rounded-xl p-8 shadow-lg" style={{
                background: "linear-gradient(135deg, #ff3131 0%, #ff914d 100%)"
              }}>
                <h3 className="text-xl font-semibold mb-2 text-white">Streamlined Process</h3>
                <p className="text-white/90">Automated sponsorship matching and communication for both colleges and companies.</p>
              </div>
              {/* Feature Card 2 */}
              <div className="rounded-xl p-8 shadow-lg" style={{
                background: "linear-gradient(135deg, #ff914d 0%, #ff3131 100%)"
              }}>
                <h3 className="text-xl font-semibold mb-2 text-white">Verified Partners</h3>
                <p className="text-white/90">All users are verified to ensure trust and transparency in every deal.</p>
              </div>
              {/* Feature Card 3 */}
              <div className="rounded-xl p-8 shadow-lg" style={{
                background: "linear-gradient(135deg, #ff3131 0%, #ff914d 100%)"
              }}>
                <h3 className="text-xl font-semibold mb-2 text-white">Real-Time Updates</h3>
                <p className="text-white/90">Stay updated with notifications and analytics for every sponsorship activity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className={`${bgMain} py-20`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-xl p-8 shadow-lg bg-[#313030] border border-[#ff3131]/40">
                <h3 className="text-xl font-semibold mb-2 text-[#ff914d]">1. Register</h3>
                <p className="text-white/90">Colleges and companies register and create their profiles on SponSync.</p>
              </div>
              <div className="rounded-xl p-8 shadow-lg bg-[#313030] border border-[#ff914d]/40">
                <h3 className="text-xl font-semibold mb-2 text-[#ff914d]">2. Connect</h3>
                <p className="text-white/90">Get matched based on interests and requirements. Start conversations instantly.</p>
              </div>
              <div className="rounded-xl p-8 shadow-lg bg-[#313030] border border-[#ff3131]/40">
                <h3 className="text-xl font-semibold mb-2 text-[#ff3131]">3. Collaborate</h3>
                <p className="text-white/90">Seal the deal, manage sponsorships, and track progress—all in one place.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SPOC Registration at Bottom */}
        <section className={`${bgSection} py-16`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Are you a SPOC?</h2>
            <p className="mb-8 text-white/80">Register as a Single Point of Contact (SPOC) to manage your college’s sponsorships efficiently.</p>
            <Link href="/auth/spoc/register" passHref>
              <Button size="lg" variant="primary" className="shadow-lg shadow-[#ff914d]/30">
                Register as SPOC
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#262323] py-6 text-center text-white text-sm">
        &copy; {new Date().getFullYear()} SponSync. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
