"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Card, CardContent } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { ArrowRight, Zap, Globe, Shield, CheckCircle, Star, Users, TrendingUp } from "lucide-react"

export default function FlowrgeLanding() {
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle waitlist signup
    console.log("Waitlist signup:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-balance">Flowrge</span>
            </div>
            <Button
              variant="outline"
              className="border-primary/20 hover:border-primary/40 hover:bg-primary/10 bg-transparent"
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
                onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
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

      {/* Key Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Build powerful{" "}
              <span className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] bg-clip-text text-transparent">
                automations
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Connect Web3 and Web2 services with simple drag-and-drop flows
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card border-glass-border hover:border-primary/30 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Webhook Triggers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Start automations with HTTP webhooks. Solana on-chain triggers coming soon for real-time blockchain
                  events.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-glass-border hover:border-primary/30 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-green)] to-[var(--neon-purple)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Cross-Platform Actions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Send SOL, post on social media, write to Google Sheets, send emails, and more - all from one platform.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-glass-border hover:border-primary/30 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-green)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Simple Dashboard</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create complex "flows" in seconds with our intuitive visual builder. No coding required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Why choose{" "}
              <span className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent">
                Flowrge?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Traditional Tools vs Flowrge</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                  <span>Native Solana blockchain triggers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                  <span>Built-in crypto actions (send SOL, tokens)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                  <span>Lower fees than traditional platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                  <span>Web3-native user experience</span>
                </div>
              </div>
            </div>

            <Card className="glass-card border-glass-border p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Built for Web3</h4>
                <p className="text-muted-foreground leading-relaxed">
                  The first automation platform designed specifically for the Solana ecosystem and Web3 workflows.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Perfect for{" "}
              <span className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-purple)] bg-clip-text text-transparent">
                everyone
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card border-glass-border p-8 text-center hover:border-primary/30 transition-all duration-300">
              <Users className="w-12 h-12 text-[var(--neon-purple)] mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">Developers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automate payouts, trigger notifications on smart contract events, and integrate Web2 services
                seamlessly.
              </p>
            </Card>

            <Card className="glass-card border-glass-border p-8 text-center hover:border-primary/30 transition-all duration-300">
              <Star className="w-12 h-12 text-[var(--neon-blue)] mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">Creators</h3>
              <p className="text-muted-foreground leading-relaxed">
                Schedule social posts, send alerts on NFT sales, and automate fan engagement across platforms.
              </p>
            </Card>

            <Card className="glass-card border-glass-border p-8 text-center hover:border-primary/30 transition-all duration-300">
              <TrendingUp className="w-12 h-12 text-[var(--neon-green)] mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">Businesses</h3>
              <p className="text-muted-foreground leading-relaxed">
                Process payments, manage customer data, and connect your existing tools with blockchain workflows.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12">Trusted by early builders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="flex items-center justify-center h-16 text-lg font-medium">Partner Logo 1</div>
            <div className="flex items-center justify-center h-16 text-lg font-medium">Partner Logo 2</div>
            <div className="flex items-center justify-center h-16 text-lg font-medium">Partner Logo 3</div>
            <div className="flex items-center justify-center h-16 text-lg font-medium">Partner Logo 4</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="waitlist" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Ready to{" "}
            <span className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent">
              automate
            </span>{" "}
            everything?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Join the waitlist and be among the first to experience the future of Web3 automation.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-card/50 border-border/50 focus:border-primary/50 p-2 rounded-2xl"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] hover:from-[var(--neon-purple)]/80 hover:to-[var(--neon-blue)]/80 text-white rounded-2xl"
            >
              Join Waitlist
            </Button>
          </form>

          <div className="flex justify-center gap-6 mt-12">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Discord
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Flowrge</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2024 Flowrge. Built for the Solana ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
