"use client"

import { Zap } from "lucide-react"
import { Button } from "../ui/button"

export default function LandingNav() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-glass-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
              <Zap className="w-5 h-5 text-white group-hover:drop-shadow-glow" />
            </div>
            <span className="text-xl font-bold text-balance group-hover:text-primary transition-colors">Flowrge</span>
          </div>
          <Button
            variant="outline"
            className="border-primary/20 hover:border-primary/60 hover:bg-primary/10 bg-transparent hover:scale-105 transition-all duration-300 hover:shadow-neon"
          >
            Join Waitlist
          </Button>
        </div>
      </div>
    </nav>
  )
}


