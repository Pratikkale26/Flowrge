"use client"

import LandingNav from "../components/landing/Nav"
import LandingHero from "../components/landing/Hero"
import LandingFeatures from "../components/landing/Features"
import LandingComparison from "../components/landing/Comparison"
import LandingUseCases from "../components/landing/UseCases"
import LandingSocialProof from "../components/landing/SocialProof"
import LandingCTA from "../components/landing/CTA"
import CursorGlow from "../components/landing/CursorGlow"
import LandingFooter from "../components/landing/Footer"

export default function FlowrgeLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-card/20 animate-gradient-shift"></div>
      <CursorGlow />
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingComparison />
      <LandingUseCases />
      <LandingSocialProof />
      <LandingCTA />
      <LandingFooter />
    </div>
  )
}
