import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </div>
      <Footer />
    </main>
  );
}
