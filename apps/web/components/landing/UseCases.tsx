"use client"

import { Card } from "../ui/card"
import { Star, TrendingUp, Users } from "lucide-react"

export default function LandingUseCases() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-fade-in-up">
            Perfect for <span className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-purple)] bg-clip-text text-transparent">everyone</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card border-glass-border p-8 text-center hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Users className="w-12 h-12 text-[var(--neon-purple)] mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Developers</h3>
            <p className="text-muted-foreground leading-relaxed">Automate payouts, trigger notifications on smart contract events, and integrate Web2 services seamlessly.</p>
          </Card>
          <Card className="glass-card border-glass-border p-8 text-center hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Star className="w-12 h-12 text-[var(--neon-blue)] mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Creators</h3>
            <p className="text-muted-foreground leading-relaxed">Schedule social posts, send alerts on NFT sales, and automate fan engagement across platforms.</p>
          </Card>
          <Card className="glass-card border-glass-border p-8 text-center hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <TrendingUp className="w-12 h-12 text-[var(--neon-green)] mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Businesses</h3>
            <p className="text-muted-foreground leading-relaxed">Process payments, manage customer data, and connect your existing tools with blockchain workflows.</p>
          </Card>
        </div>
      </div>
    </section>
  )
}


