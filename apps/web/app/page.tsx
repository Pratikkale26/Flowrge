"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { CtaSection } from "../components/landing/CtaSection"
import { FeaturesSection } from "../components/landing/FeaturesSection"
import { HeroSection } from "../components/landing/HeroSection"
import { NavBar } from "../components/landing/NavBar"
import { SocialProofSection } from "../components/landing/SocialProofSection"
import { UseCasesSection } from "../components/landing/UseCasesSection"
import { ComparisonSection } from "../components/landing/ComparisonSection"
import { FooterSection } from "../components/landing/FooterSection"

export default function FlowrgeLanding() {
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <HeroSection isVisible={isVisible} onJoinClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })} />
      <FeaturesSection />
      <ComparisonSection />
      <UseCasesSection />
      {/* <SocialProofSection /> */}
      <CtaSection email={email} setEmail={setEmail} />
      <FooterSection />
    </div>
  )
}
