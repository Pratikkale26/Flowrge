"use client"

import { useState } from "react"
import { Zap, Github, ArrowDownLeft } from "lucide-react"

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
    <section id="waitlist" className="w-full py-8 lg:py-12 xl:py-20 px-4 relative z-10" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="mx-auto" style={{ maxWidth: '78rem' }}>
        {/* Outer container with muted background and border */}
        <footer className="bg-zinc-900/30 border border-zinc-800 w-full rounded-2xl lg:rounded-3xl p-1.5 lg:p-2">
          {/* Inner waitlist card */}
          <footer className="relative min-h-[18rem] lg:h-[20rem] w-full overflow-hidden rounded-xl lg:rounded-2xl border border-zinc-800">
            {/* Background image with blur */}
            <img 
              src="/usethisbg.jpg" 
              alt="Background" 
              className="absolute inset-0 h-full w-full rotate-180 object-cover opacity-40 blur-[2px]"
            />
            
            {/* Decorative logo/icon in top right */}
            <div className="absolute top-4 lg:top-8 right-6 lg:right-10 hidden lg:flex size-20 lg:size-32 items-center justify-center rounded-[1.5rem] lg:rounded-[2rem] border-2 border-white/30 p-3 lg:p-4 backdrop-blur-sm bg-white/5">
              <Zap className="size-14 lg:size-20 text-white" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-start justify-between px-4 pt-3 pb-4 sm:justify-center lg:px-8 lg:pt-2">
              <div className="relative flex flex-col items-start justify-start">
                <p className="mt-2 lg:mt-3 max-w-lg text-left text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold tracking-tight text-white">
                  Ready to automate your Web3 workflows?
                </p>
                <p className="max-w-xl pt-2 lg:pt-3 text-left text-xs lg:text-sm text-neutral-200">
                  Build powerful automations for Solana with Flowrge. Connect Web3 and Web2 services with simple drag-and-drop flows. No coding required.
        </p>
              </div>
              
              {/* Waitlist Form */}
              <form onSubmit={handleWaitlistSubmit} className="mt-4 lg:mt-6 flex w-full flex-col sm:flex-row flex-wrap items-stretch justify-center gap-2 lg:items-start lg:justify-start lg:gap-3 max-w-xl">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full sm:flex-1 h-10 lg:h-12 px-3 lg:px-4 text-sm lg:text-base rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all backdrop-blur-sm sm:min-w-[200px]"
                />
                <button 
                  type="submit" 
                  className="w-full sm:w-auto h-10 lg:h-12 px-6 lg:px-8 text-sm lg:text-base bg-white text-black font-semibold rounded-md hover:bg-gray-100 transition-all duration-300 whitespace-nowrap shadow-lg"
                >
            Join Waitlist
                </button>
        </form>
            </div>
          </footer>
          
          {/* Footer links section */}
          <div className="pt-10 pb-2 md:pb-6 flex justify-center">
            <div className="w-full px-4" style={{ maxWidth: '68rem' }}>
              <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Logo and description */}
                <div className="lg:col-span-1">
                  <div className="mb-4 flex items-center">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Flowrge</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-zinc-400 mb-4 text-sm">
                    The first automation platform built for the Solana ecosystem. Connect Web3 and Web2 with powerful no-code flows.
                  </p>
                  <div className="flex gap-2">
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center h-8 rounded-md gap-1.5 px-3 hover:bg-zinc-800 transition-all"
                      href="https://github.com/pratikkale26"
                    >
                      <Github className="h-4 w-4 text-zinc-400" />
                    </a>
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center h-8 rounded-md gap-1.5 px-3 hover:bg-zinc-800 transition-all"
                      href="https://x.com/pratikkale26"
                    >
                      <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                {/* Features Column */}
                <div>
                  <h4 className="text-white mb-4 font-semibold">Features</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#features">Webhook Triggers</a></li>
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#features">Solana Actions</a></li>
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#features">Visual Builder</a></li>
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#features">Real-time Monitoring</a></li>
                  </ul>
                </div>
                
                {/* Resources Column */}
                <div>
                  <h4 className="text-white mb-4 font-semibold">Resources</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#docs">Documentation</a></li>
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#guides">Quick Start</a></li>
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#tutorials">Tutorials</a></li>
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#api">API Reference</a></li>
                  </ul>
                </div>
                
                {/* Community Column */}
                <div>
                  <h4 className="text-white mb-4 font-semibold">Community</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="https://github.com/pratikkale26/issues">GitHub Issues</a></li>
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#discord">Discord Server</a></li>
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="#contributing">Contributing</a></li>
                    <li><a className="text-zinc-400 hover:text-white transition-colors" href="https://github.com/pratikkale26">GitHub Repo</a></li>
                  </ul>
                </div>
              </div>
              
              {/* Copyright section */}
              <div className="border-t border-zinc-800 pt-2">
                <div className="flex flex-col items-center justify-between md:flex-row">
                  <div className="mb-4 flex flex-col items-center gap-4 md:mb-0 md:flex-row">
                    <p className="text-zinc-400 text-sm">
                      © 2025 Flowrge. Built for the Solana ecosystem.
                    </p>
                  </div>
                </div>
              </div>
        </div>
          </div>
        </footer>
      </div>
    </section>
  )
}


