"use client"

import { Card, CardContent } from "../ui/card"
import { Globe, Shield, Zap } from "lucide-react"

export default function LandingFeatures() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-fade-in-up">
            Build powerful <span className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] bg-clip-text text-transparent">automations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Connect Web3 and Web2 services with simple drag-and-drop flows
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card border-glass-border hover:border-primary/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 group-hover:shadow-neon">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Webhook Triggers</h3>
              <p className="text-muted-foreground leading-relaxed">Start automations with HTTP webhooks. Solana on-chain triggers coming soon for real-time blockchain events.</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-glass-border hover:border-primary/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-green)] to-[var(--neon-purple)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 group-hover:shadow-neon">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Cross-Platform Actions</h3>
              <p className="text-muted-foreground leading-relaxed">Send SOL, post on social media, write to Google Sheets, send emails, and more - all from one platform.</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-glass-border hover:border-primary/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-green)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 group-hover:shadow-neon">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Simple Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed">Create complex "flows" in seconds with our intuitive visual builder. No coding required.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}


