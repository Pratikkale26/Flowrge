"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ArrowRight, Zap, Github, ChevronRight, Terminal, Twitter } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export default function LandingHero() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    // Changed min-h-screen to min-h-[85vh] and reduced pt-20 to pt-12
    <section className="relative overflow-hidden min-h-[85vh] flex flex-col items-center justify-center pt-12 lg:pt-0 bg-[#050505] selection:bg-purple-500/30">
      
      {/* --- CSS for Background Animation --- */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 w-full h-full">
        {/* 1. Base Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-[1]" />
        
        {/* 2. Animated Blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* 3. Bottom Fade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-[2]" />
      </div>

      {/* --- NAVBAR (Floating Capsule) --- */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[100%] max-w-3xl animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex w-full items-center justify-between py-2.5 px-4 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-zinc-900/60">
          
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-purple-500/20">
              <Zap className="w-4 h-4 text-white fill-white/20" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-zinc-100 group-hover:text-white transition-colors">
              Flowrge
            </span>
          </div>
          
          {/* Nav Actions */}
          <div className="flex items-center gap-3">
             {/* GitHub Link - Hidden on small mobile */}
             <a href="https://x.com/pratikkale26" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                <Twitter className="w-3.5 h-3.5" />
                <span>Follow us</span>
             </a>
             <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
             <Button
                onClick={() => router.push("#waitlist")}
                variant="ghost"
                size="sm"
                className="h-8 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 hover:text-black text-xs font-semibold px-4"
             >
                Join Waitlist
             </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN HERO CONTENT --- */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 lg:px-6 flex flex-col items-center text-center">
        
        <div className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          
          {/* Announcement Pill - Reduced Margin */}
          <div className="inline-flex items-center justify-center mb-6">
            <Badge 
                variant="outline" 
                className="bg-zinc-900/30 hover:bg-zinc-900/60 border-white/10 text-zinc-300 px-4 py-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer group hover:border-purple-500/30"
            >
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-xs font-medium">v1.0 Early Access</span>
                <ChevronRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
              </span>
            </Badge>
          </div>

          {/* Headline - Reduced Margin */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="block text-white drop-shadow-sm">
              Automate Solana
            </span>
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent pb-2">
              Without the Code.
            </span>
          </h1>

          {/* Subheadline - Reduced Margin */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-zinc-400 mb-8 leading-relaxed">
            Build triggers, actions, and complex DeFi workflows in minutes. 
            The first drag-and-drop automation layer built for the Solana ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button 
              size="lg" 
              onClick={() => {
                const token = localStorage.getItem("token"); 
                if(token) router.push("/dashboard");
                else router.push("#waitlist");
              }}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all duration-200 font-semibold text-base shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]"
            >
              Start Building Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 rounded-full border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-200 font-medium text-base backdrop-blur-sm"
            >
              <Terminal className="mr-2 w-4 h-4 text-zinc-400" />
              Read Docs
            </Button>
          </div>

        </div>
      </div>

    </section>
  )
}