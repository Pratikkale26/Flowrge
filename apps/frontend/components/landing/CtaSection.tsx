"use client"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import type React from "react"

type CtaSectionProps = {
  email: string
  setEmail: (value: string) => void
}

export function CtaSection({ email, setEmail }: CtaSectionProps) {
  async function handleSubmit(e: React.FormEvent) {
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

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
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
  )
}


