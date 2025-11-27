"use client"

import React, { useState } from "react"
import { 
  Zap, 
  GitMerge, 
  Rocket, 
  ArrowRight,
  MousePointer2
} from "lucide-react"

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    {
      id: 0,
      title: "Listen",
      subtitle: "Connect Triggers",
      description: "Don't build your own indexer. Just select type of an on-chain event, Webhook, or web2 event to trigger a flow.",
      icon: Zap,
      color: "bg-purple-500",
      textColor: "text-purple-400",
      gradient: "from-purple-500/20 to-purple-900/5",
      visual: <RadarAnimation />
    },
    {
      id: 1,
      title: "Logic",
      subtitle: "Design Workflow",
      description: "Build a custom flow that executes when conditions are met. like auto-buy tokens, send alerts, or route funds, etc.",
      icon: GitMerge,
      color: "bg-blue-500",
      textColor: "text-blue-400",
      gradient: "from-blue-500/20 to-blue-900/5",
      visual: <NodesAnimation />
    },
    {
      id: 2,
      title: "Act",
      subtitle: "Execute & Deploy",
      description: "The moment conditions are met, we sign the transaction. Swap tokens, mint NFTs, or post to Discord instantly.",
      icon: Rocket,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      gradient: "from-emerald-500/20 to-emerald-900/5",
      visual: <LaunchAnimation />
    }
  ]

  return (
    <section className="w-full py-24 bg-[#050505] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Works</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Complex infrastructure abstracted into three intuitive steps.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-zinc-500 text-sm font-medium animate-pulse">
            <MousePointer2 className="w-4 h-4" />
            <span>Hover to explore</span>
          </div>
        </div>

        {/* --- THE ACCORDION --- */}
        <div className="flex flex-col lg:flex-row h-[800px] lg:h-[500px] gap-4">
          {steps.map((step, index) => {
            const isActive = activeStep === index
            return (
              <div
                key={step.id}
                onMouseEnter={() => setActiveStep(index)}
                className={`relative rounded-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default border border-white/10 ${
                  isActive 
                    ? "lg:flex-[3] flex-[3] bg-[#0A0A0A]" 
                    : "lg:flex-[1] flex-[1] bg-black hover:bg-[#080808]"
                }`}
              >
                {/* Background Gradient (Active Only) */}
                <div className={`absolute inset-0 bg-gradient-to-b ${step.gradient} transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"}`} />

                <div className="absolute inset-0 p-8 flex flex-col justify-between h-full z-10">
                  
                  {/* Top: Icon & Label */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? `${step.color} text-white shadow-lg` : "bg-zinc-900 text-zinc-500"}`}>
                            <step.icon className="w-6 h-6" />
                        </div>
                        <div className={`transition-all duration-500 overflow-hidden ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 lg:opacity-100 lg:translate-x-0"}`}>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Step 0{index + 1}</span>
                            <span className={`text-xl font-bold ${isActive ? "text-white" : "text-zinc-400"}`}>{step.title}</span>
                        </div>
                    </div>
                    
                    {/* Arrow Indicator (Hidden when active to show content) */}
                    <div className={`p-2 rounded-full border border-white/10 transition-all duration-300 ${isActive ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}>
                        <ArrowRight className="w-5 h-5 text-zinc-600" />
                    </div>
                  </div>

                  {/* Middle: The Visual Animation (Only visible when active) */}
                  <div className={`flex-1 flex items-center justify-center transition-all duration-700 delay-100 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 hidden lg:flex"}`}>
                     {/* We keep it mounted but hidden to preserve layout */}
                     {isActive && step.visual} 
                  </div>

                  {/* Bottom: Text Content */}
                  <div className={`transition-all duration-500 ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 hidden lg:block lg:opacity-100 lg:translate-y-0"}`}>
                     <h3 className={`text-2xl md:text-3xl font-bold text-white mb-3 ${isActive ? "" : "hidden"}`}>
                        {step.subtitle}
                     </h3>
                     <p className={`text-zinc-400 leading-relaxed max-w-lg ${isActive ? "" : "hidden"}`}>
                        {step.description}
                     </p>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

// --- VISUALS (CSS ANIMATIONS) ---

const RadarAnimation = () => (
  <div className="relative w-64 h-64 flex items-center justify-center">
    {/* Concentric Circles */}
    <div className="absolute inset-0 border border-purple-500/20 rounded-full animate-[ping_3s_infinite]" />
    <div className="absolute inset-8 border border-purple-500/40 rounded-full" />
    <div className="absolute inset-16 border border-purple-500/60 rounded-full" />
    
    {/* Rotating Radar */}
    <div className="absolute inset-0 w-full h-full rounded-full animate-[spin_4s_linear_infinite] bg-gradient-to-tr from-transparent via-purple-500/10 to-transparent" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }} />
    
    {/* Center Dot */}
    <div className="w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)] z-10" />
    
    {/* Found "Events" */}
    <div className="absolute top-10 right-16 w-2 h-2 bg-white rounded-full animate-pulse" />
    <div className="absolute bottom-12 left-10 w-2 h-2 bg-white rounded-full animate-pulse delay-700" />
  </div>
)

const NodesAnimation = () => (
  <div className="relative w-full h-40 flex items-center justify-center gap-6">
    {/* Node 1 */}
    <div className="w-16 h-16 bg-zinc-900 border border-blue-500/50 rounded-xl flex items-center justify-center relative z-10">
        <div className="w-3 h-3 bg-blue-500 rounded-full" />
    </div>
    
    {/* Path */}
    <div className="w-24 h-1 bg-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500 w-1/2 animate-[shimmer_1.5s_infinite_linear]" />
    </div>

    {/* Node 2 */}
    <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        <div className="w-8 h-1 bg-zinc-700 rounded-full" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</div>
    </div>
  </div>
)

const LaunchAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
     <div className="absolute w-1 bg-gradient-to-t from-transparent via-emerald-500 to-transparent h-32 animate-bounce opacity-50" />
     <div className="w-20 h-20 bg-zinc-900 border border-emerald-500/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)] relative z-10 group">
        <Rocket className="w-8 h-8 text-emerald-500 group-hover:-translate-y-1 transition-transform" />
     </div>
     {/* Particles */}
     <div className="absolute bottom-20 left-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-[ping_1s_infinite]" />
     <div className="absolute bottom-24 right-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-[ping_1.5s_infinite]" />
  </div>
)

/* Add custom keyframe for shimmer if not in Tailwind config */
// @keyframes shimmer { 0% { transform: translateX(-100%) } 100% { transform: translateX(200%) } }