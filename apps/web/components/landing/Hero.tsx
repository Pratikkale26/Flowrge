"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

export default function LandingHero() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 animate-pulse-subtle">
            🚀 Now in Early Access
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.2s" }}>Automate on</span>{" "}
            <span className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent neon-text animate-fade-in-up inline-block" style={{ animationDelay: "0.4s" }}>Solana</span>{" "}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.6s" }}>in minutes</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            Triggers and actions across Web3 & Web2 without writing code. The first automation platform built for the Solana ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "1s" }}>
            <Button size="lg" className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] hover:from-[var(--neon-purple)]/80 hover:to-[var(--neon-blue)]/80 text-white px-8 py-6 text-lg animate-pulse-glow hover:scale-105 transition-all duration-300 hover:shadow-2xl group" onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}>
              Join Waitlist <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary/60 hover:bg-primary/10 px-8 py-6 text-lg bg-transparent hover:scale-105 transition-all duration-300 hover:shadow-neon group">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 left-10 w-20 h-20 bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 rounded-full blur-xl animate-float-slow hover:scale-150 transition-all duration-500" style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}></div>
      <div className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-purple)]/20 rounded-full blur-xl animate-float-slow hover:scale-150 transition-all duration-500" style={{ animationDelay: "1s", transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)` }}></div>
    </section>
  )
}


