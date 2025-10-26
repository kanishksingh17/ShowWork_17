import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Templates } from "@/components/landing/templates";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Templates />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
