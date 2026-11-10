import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import StatsStrip from "@/components/landing/StatsStrip";
import PopularServices from "@/components/landing/PopularServices";
import HowItWorks from "@/components/landing/HowItWorks";
import SalonDirectory from "@/components/landing/SalonDirectory";
import ForOwnersSection from "@/components/landing/ForOwnersSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FaqSection from "@/components/landing/FaqSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsStrip />
      <PopularServices />
      <HowItWorks />
      <SalonDirectory />
      <ForOwnersSection />
      <TestimonialsSection />
      <FaqSection />
      <Footer />
    </div>
  );
}

