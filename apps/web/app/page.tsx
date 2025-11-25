"use client";

import LandingHero from "../components/landing/Hero";
import LandingFeatures from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import FAQ from "../components/landing/FAQ";
import LandingCTA from "../components/landing/CTA";
import Image from "next/image";

export default function FlowrgeLanding() {
  return (
    <div className="relative w-full">
      {/* Purple Background Image - Behind Hero */}
      <div className="absolute top-0 left-0 w-full h-screen -z-10 overflow-hidden opacity-50">
        <Image 
          src="/purplebg.jpg" 
          alt="Background" 
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Landing Content */}
      <div className="relative flex flex-col w-full">

        {/* Hero Section */}
        <LandingHero />

        <div style={{ backgroundColor: '#0a0a0a' }}>
          <LandingFeatures />
          <HowItWorks />
          <FAQ />
          <LandingCTA />
        </div>
      </div>
    </div>
  );
}
