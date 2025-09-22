"use client"
import { Button } from "@repo/ui/button"
import { Badge } from "@repo/ui/badge"
import { ArrowRight, Zap } from "lucide-react"

type HeroSectionProps = {
  isVisible: boolean
  onJoinClick: () => void
}

export function HeroSection({ isVisible, onJoinClick }: HeroSectionProps) {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
            🚀 Now in Early Access
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
            Automate on{" "}
            <span className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent neon-text">
              Solana
            </span>{" "}
            in minutes
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
            Triggers and actions across Web3 & Web2 without writing code. The first automation platform built for the
            Solana ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] hover:from-[var(--neon-purple)]/80 hover:to-[var(--neon-blue)]/80 text-white px-8 py-6 text-lg animate-pulse-glow rounded-full"
              onClick={onJoinClick}
            >
              Join Waitlist <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 hover:border-primary/40 hover:bg-primary/10 px-8 py-6 text-lg bg-transparent rounded-full"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/2 left-10 w-20 h-20 bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 rounded-full blur-xl animate-float"></div>
      <div
        className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-purple)]/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
    </section>
  )
}


