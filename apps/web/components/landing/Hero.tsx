"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ArrowRight, Zap, Github, CornerDownLeft, GitFork } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export default function LandingHero() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 min-h-screen flex items-center">
      {/* Navbar inside Hero */}
      <div className="fixed top-2 lg:top-4 left-1/2 -translate-x-1/2 z-50 w-full px-2 lg:px-4">
        <div className="max-w-5xl mx-auto flex w-full items-center justify-between py-2 lg:py-3 transition-all duration-300 lg:px-4 bg-zinc-800/30 rounded-2xl px-3 lg:px-4 backdrop-blur-lg border border-white/10">
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 lg:gap-2 cursor-pointer group"
          >
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg lg:rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-white group-hover:drop-shadow-glow" />
            </div>
            <span className="text-base lg:text-lg font-semibold tracking-wide group-hover:text-primary transition-colors text-white">
              Flowrge
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 bg-transparent text-white hover:scale-105 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4"
          >
            Join Waitlist
          </Button>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex items-center justify-center pt-16 lg:pt-20 pb-8 lg:pb-12 mx-auto w-full">
        <div className="mx-auto w-full px-4 lg:px-6" style={{ maxWidth: '78rem' }}>
          <div className="flex items-center justify-center">
            {/* Centered Content */}
            <div className={`transition-all duration-1000 max-w-4xl text-center px-4 lg:px-0 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <Badge variant="secondary" className="mb-3 lg:mb-2 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm bg-white/5 text-white border-white/10 hover:bg-white/10 transition-all duration-300">
                🚀 Now in Early Access
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 lg:mb-4 leading-[1.1] tracking-tight">
                <span className="block text-white animate-fade-in-up" style={{ animationDelay: "0.2s" }}>Automate on Solana</span>{" "}
                <span className="block bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: "0.4s" }}>Without Code</span>
              </h1>
              <p className="max-w-2xl lg:max-w-3xl text-sm md:text-md lg:text-lg text-zinc-400 mb-6 lg:mb-6 leading-relaxed mx-auto animate-fade-in-up px-4 lg:px-0" style={{ animationDelay: "0.8s" }}>
                Triggers and actions across Web3 & Web2 without writing code. The first automation platform built for the Solana ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center animate-fade-in-up px-4 lg:px-0" style={{ animationDelay: "1s" }}>
                <Button 
                  size="lg" 
                  className="bg-white hover:bg-zinc-100 text-zinc-900 px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg font-semibold hover:scale-105 transition-all duration-300 group w-full sm:w-auto" 
                  onClick={() => {
                    const token = localStorage.getItem("token"); 
                    if(token) router.push("/dashboard")
                  }}
                >
                  Forge Now <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


