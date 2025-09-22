"use client"

import { CheckCircle, TrendingUp } from "lucide-react"
import { Card } from "../ui/card"

export default function LandingComparison() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-fade-in-up">
            Why choose <span className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent">Flowrge?</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-2xl font-semibold mb-6">Traditional Tools vs Flowrge</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 animate-fade-in-left" style={{ animationDelay: "0.3s" }}>
                <CheckCircle className="w-5 h-5 text-[var(--neon-green)] animate-pulse-subtle" />
                <span>Native Solana blockchain triggers</span>
              </div>
              <div className="flex items-center gap-3 animate-fade-in-left" style={{ animationDelay: "0.4s" }}>
                <CheckCircle className="w-5 h-5 text-[var(--neon-green)] animate-pulse-subtle" />
                <span>Built-in crypto actions (send SOL, tokens)</span>
              </div>
              <div className="flex items-center gap-3 animate-fade-in-left" style={{ animationDelay: "0.5s" }}>
                <CheckCircle className="w-5 h-5 text-[var(--neon-green)] animate-pulse-subtle" />
                <span>Lower fees than traditional platforms</span>
              </div>
              <div className="flex items-center gap-3 animate-fade-in-left" style={{ animationDelay: "0.6s" }}>
                <CheckCircle className="w-5 h-5 text-[var(--neon-green)] animate-pulse-subtle" />
                <span>Web3-native user experience</span>
              </div>
            </div>
          </div>
          <Card className="glass-card border-glass-border p-8 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 group-hover:shadow-neon">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Built for Web3</h4>
              <p className="text-muted-foreground leading-relaxed">The first automation platform designed specifically for the Solana ecosystem and Web3 workflows.</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}


