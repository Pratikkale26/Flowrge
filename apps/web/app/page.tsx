"use client";

import LandingNav from "../components/landing/Nav";
import LandingHero from "../components/landing/Hero";
import LandingFeatures from "../components/landing/Features";
import LandingComparison from "../components/landing/Comparison";
import LandingUseCases from "../components/landing/UseCases";
import LandingSocialProof from "../components/landing/SocialProof";
import LandingCTA from "../components/landing/CTA";
import CursorGlow from "../components/landing/CursorGlow";
import LandingFooter from "../components/landing/Footer";

export default function FlowrgeLanding() {
  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-card/20 animate-gradient-shift -z-10" />

      {/* Cursor Glow */}
      <CursorGlow />

      {/* Landing Content */}
      <div className="relative z-10 flex flex-col w-full">
        <LandingNav />
        <LandingHero />
        <LandingFeatures />
        <LandingComparison />
        <LandingUseCases />
        <LandingSocialProof />
        <LandingCTA />
        <LandingFooter />
      </div>
    </div>
  );
}
