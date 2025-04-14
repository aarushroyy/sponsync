// app/page.tsx
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block bg-gray-800 border border-gray-700 rounded-full px-4 py-2 mb-6 text-sm font-medium text-gray-300">
              Welcome To The Sponsorship Ecosystem
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-3xl text-white">
              Where College Events Meet Corporate Sponsors
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl">
              SponSync is a data-driven sponsorship solution provider that connects brands with the right events for maximum impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link 
                href="/auth/company/login" 
                className="bg-[#F85021] hover:bg-[#E04010] text-white font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                Company
              </Link>
              <Link 
                href="/auth/college/login" 
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-md border border-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                College Event Organizer
              </Link>
            </div>
            
            <div className="w-full max-w-4xl relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl border border-gray-700">
              <Image 
                src="/images/collaboration-illustration.svg" 
                alt="College and Corporate collaboration" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">How SponSync Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform makes it simple to create meaningful connections between brands and college events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition duration-300 border border-gray-700">
              <div className="w-12 h-12 bg-[#F85021] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Create Profile</h3>
              <p className="text-gray-300">
                Set up your company or college event profile with detailed requirements and metrics
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition duration-300 border border-gray-700">
              <div className="w-12 h-12 bg-[#F85021] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Get Matched</h3>
              <p className="text-gray-300">
                Our algorithm finds the ideal partnerships based on data-driven analysis
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition duration-300 border border-gray-700">
              <div className="w-12 h-12 bg-[#F85021] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Track Results</h3>
              <p className="text-gray-300">
                Measure performance with verified results and comprehensive analytics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Why Choose SponSync</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform leverages data analytics to create perfect matches between college events and corporate sponsors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition duration-300 border border-gray-700">
              <div className="w-14 h-14 bg-[#F85021] bg-opacity-20 rounded-lg p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F85021" className="w-full h-full">
                  <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75C3.84 21.75 3 20.91 3 19.875v-6.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Data-Driven Matching</h3>
              <p className="text-gray-300">
                Our algorithm ensures you find the perfect partnerships based on your specific goals and metrics
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition duration-300 border border-gray-700">
              <div className="w-14 h-14 bg-[#F85021] bg-opacity-20 rounded-lg p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F85021" className="w-full h-full">
                  <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                  <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Transparent Metrics</h3>
              <p className="text-gray-300">
                Clear sponsorship packages with defined deliverables and measurable outcomes
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition duration-300 border border-gray-700">
              <div className="w-14 h-14 bg-[#F85021] bg-opacity-20 rounded-lg p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F85021" className="w-full h-full">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Verified Results</h3>
              <p className="text-gray-300">
                Our SPOC network ensures reliable on-ground verification of sponsorship deliverables
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#F85021]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your sponsorship strategy?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of companies and college events already using SponSync to create meaningful partnerships
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/auth/company/register" 
              className="bg-white text-[#F85021] hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              Register as Company
            </Link>
            <Link 
              href="/auth/college/register" 
              className="bg-transparent hover:bg-[#E04010] text-white border border-white font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              Register as College
            </Link>
          </div>
        </div>
      </section>

      {/* SPOC Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-white">Become a SPOC</h2>
              <p className="text-gray-300 mb-6">
                Single Point of Contact (SPOC) is crucial for verifying sponsorship deliverables. As a SPOC, youll ensure transparency and authenticity between colleges and companies.
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-white">Benefits:</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Earn while you learn</li>
                  <li>Gain valuable industry connections</li>
                  <li>Flexible work schedule for students</li>
                  <li>Develop verification and communication skills</li>
                </ul>
              </div>
              <Link 
                href="/auth/spoc/register" 
                className="inline-block bg-[#F85021] hover:bg-[#E04010] text-white font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out"
              >
                Join as SPOC
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="w-full h-64 md:h-80 bg-gray-700 rounded-lg overflow-hidden relative shadow-lg border border-gray-700">
                <Image 
                  src="/images/spoc-verification.svg" 
                  alt="SPOC Verification Process" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
          <p className="text-gray-300 mb-8">
            Have questions? Our team is here to help you get started.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F85021" className="w-6 h-6 mr-2">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">+91 81302 77940, +91 93183 01351</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F85021" className="w-6 h-6 mr-2">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
              <a href="mailto:contactus@sponsync.com" className="text-[#F85021] hover:underline">
                contactus@sponsync.com
              </a>
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition duration-300 border border-gray-700">
              <span className="sr-only">Email</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F85021" className="w-6 h-6">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
            </a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition duration-300 border border-gray-700">
              <span className="sr-only">LinkedIn</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#F85021">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition duration-300 border border-gray-700">
              <span className="sr-only">Instagram</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#F85021">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}