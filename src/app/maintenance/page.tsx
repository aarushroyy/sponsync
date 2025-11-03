import { Metadata } from "next"
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Under Maintenance | SponSync",
  description: "We're currently undergoing maintenance to improve our services.",
}

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#262323] px-6 relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-4 h-72 w-72 bg-[#ff3131]/20 rounded-full opacity-70 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-[#ff914d]/20 rounded-full opacity-70 blur-3xl"></div>

      <div className="relative z-10 max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <Image
            src="/sponsyncLogos.png?v=1"
            alt="SponSync Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <span className="text-4xl font-bold">
            Spon<span className="text-[#ff914d]">Sync</span>
          </span>
        </div>

        {/* Maintenance Card */}
        <div className="bg-[#313030] rounded-2xl p-8 border border-[#414040] shadow-2xl backdrop-blur-sm">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent">
              Under Maintenance
            </h1>
            
            <div className="space-y-4">
              <p className="text-white/90 text-lg">
                We&apos;re currently enhancing SponSync to serve you better.
              </p>
              <p className="text-white/70">
                Our team is working hard to bring you an improved experience. 
                We&apos;ll be back shortly.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="pt-6">
              <div className="h-2 w-full bg-[#272626] rounded-full overflow-hidden">
                <div 
                  className="h-full w-2/3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] animate-pulse"
                ></div>
              </div>
              <p className="mt-4 text-white/60 text-sm">
                Estimated completion: Coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-white/60">
          <p>Need immediate assistance?</p>
          <p>Contact us at <a href="mailto:sponsyncc@gmail.com" className="text-[#ff914d] hover:text-[#ff3131] transition-colors">sponsyncc@gmail.com</a></p>
        </div>
      </div>
    </main>
  )
}