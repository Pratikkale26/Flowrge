"use client"

import { Zap } from "lucide-react"

export default function LandingFooter() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold group-hover:text-primary transition-colors">Flowrge</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2025 Flowrge. Built for the Solana ecosystem.</p>
        </div>
      </div>
    </footer>
  )
}


