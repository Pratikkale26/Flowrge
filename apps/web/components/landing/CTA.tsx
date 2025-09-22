"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function LandingCTA() {
  const [email, setEmail] = useState("")

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      console.log("Waitlist signup:", email)
      setEmail("")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section id="waitlist" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-fade-in-up">
          Ready to <span className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent">automate</span> everything?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 text-pretty animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Join the waitlist and be among the first to experience the future of Web3 automation.
        </p>
        <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1 bg-card/50 border-border/50 focus:border-primary/50 hover:border-primary/30 transition-all duration-300 focus:shadow-neon" />
          <Button type="submit" size="lg" className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] hover:from-[var(--neon-purple)]/80 hover:to-[var(--neon-blue)]/80 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            Join Waitlist
          </Button>
        </form>
        <div className="flex justify-center gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <a href="https://x.com/pratikkale26" target="_blank" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">Twitter</a>
          <a href="https://github.com/pratikkale26" target="_blank" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">GitHub</a>
        </div>
      </div>
    </section>
  )
}


