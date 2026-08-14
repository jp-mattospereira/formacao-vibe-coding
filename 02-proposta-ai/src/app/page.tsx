import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Benefits } from "@/components/landing/benefits"
import { HowItWorks } from "@/components/landing/how-it-works"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
