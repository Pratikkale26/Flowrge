"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { 
  Wallet, 
  ArrowRightLeft, 
  Send, 
  Split, 
  CheckCircle2,
  Activity,
  TrendingDown,
  ChevronRight,
  ChevronLeft,
  Building2,
  FileSpreadsheet,
  Image as ImageIcon,
  Gavel,
  Bell
} from "lucide-react"

// --- Types ---
interface FlowNode {
  id: number
  title: string
  sub: string
  icon: React.ElementType
  type: "trigger" | "logic" | "action"
}

interface Scenario {
  id: string
  name: string
  description: string
  themeColor: string
  secondaryColor: string
  nodes: [FlowNode, FlowNode, FlowNode, FlowNode]
}

// --- Configuration Data ---
const SCENARIOS: Scenario[] = [
  {
    id: "defi",
    name: "Dip Sniper",
    description: "Auto-buy tokens when price drops",
    themeColor: "#14F195", // Solana Green
    secondaryColor: "#9945FF", // Solana Purple
    nodes: [
      { id: 1, title: "Price Oracle", sub: "SOL/USD < $140", icon: TrendingDown, type: "trigger" },
      { id: 2, title: "Check Balance", sub: "USDC > 1000", icon: Split, type: "logic" },
      { id: 3, title: "Jupiter Swap", sub: "Buy SOL", icon: ArrowRightLeft, type: "action" },
      { id: 4, title: "Telegram", sub: "Send Alert", icon: Send, type: "action" }
    ]
  },
  {
    id: "dao",
    name: "Payroll Splitter",
    description: "Route treasury funds automatically",
    themeColor: "#3B82F6", // Blue
    secondaryColor: "#60A5FA", // Light Blue
    nodes: [
      { id: 1, title: "Treasury In", sub: "USDC Received", icon: Wallet, type: "trigger" },
      { id: 2, title: "Tax Logic", sub: "Split 20%", icon: Split, type: "logic" },
      { id: 3, title: "Safe Vault", sub: "Deposit 20%", icon: Building2, type: "action" },
      { id: 4, title: "Airtable", sub: "Log Transaction", icon: FileSpreadsheet, type: "action" }
    ]
  },
  {
    id: "nft",
    name: "NFT Sniper",
    description: "Monitor collections & sweep floors",
    themeColor: "#D946EF", // Fuchsia/Purple
    secondaryColor: "#F472B6", // Pink
    nodes: [
      { id: 1, title: "Tensor List", sub: "New Listing", icon: ImageIcon, type: "trigger" },
      { id: 2, title: "Floor Check", sub: "Price < 5 SOL", icon: Gavel, type: "logic" },
      { id: 3, title: "Auto Buy", sub: "Execute Tx", icon: Wallet, type: "action" },
      { id: 4, title: "Discord", sub: "Alpha Alert", icon: Bell, type: "action" }
    ]
  }
]

export default function FlowBuilderPreview() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const scenario = SCENARIOS[currentScenarioIndex]!

  // --- Animation Loop Logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (!isTransitioning) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= 4) {
            handleAutoSwitch()
            return prev
          }
          return prev + 1
        })
      }, 1500)
    }

    return () => clearInterval(interval)
  }, [isTransitioning, currentScenarioIndex])

  const handleAutoSwitch = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentScenarioIndex((prev) => (prev + 1) % SCENARIOS.length)
      setActiveStep(0)
      setIsTransitioning(false)
    }, 500)
  }, [])

  const handleManualSwitch = (direction: 'next' | 'prev') => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveStep(-1)

    setTimeout(() => {
      setCurrentScenarioIndex((prev) => {
        if (direction === 'next') return (prev + 1) % SCENARIOS.length
        return prev === 0 ? SCENARIOS.length - 1 : prev - 1
      })
      setActiveStep(0)
      setIsTransitioning(false)
    }, 400)
  }

  const isActive = (step: number) => !isTransitioning && activeStep >= step && activeStep !== 5

  return (
    <div className="w-full h-full min-h-[360px] bg-[#09090b] relative overflow-hidden rounded-xl border border-white/10 shadow-2xl flex flex-col group select-none">
      
      {/* 1. Header / Legend */}
      <div className="absolute top-4 left-6 z-20">
        <div className="flex items-center gap-3">
            <span 
              className={`text-xs font-bold px-2 py-1 rounded bg-white/5 border transition-all duration-500 uppercase tracking-wider ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
              style={{ 
                color: scenario.themeColor, 
                borderColor: `${scenario.themeColor}33` 
              }}
            >
              {scenario.name}
            </span>
            <span className={`text-zinc-500 text-xs hidden sm:inline-block transition-all duration-500 delay-75 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                {scenario.description}
            </span>
        </div>
      </div>

      {/* 2. Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-700" 
        style={{ 
          backgroundImage: `radial-gradient(${scenario.themeColor} 1px, transparent 1px)`, 
          backgroundSize: '24px 24px',
          opacity: isTransitioning ? 0 : 0.15
        }} 
      />

      {/* 3. SVG Connections Layer 
          UPDATED COORDINATES for w-120, h-90 nodes.
          Center Y Offset = +45px.
      */}
      <svg className={`absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {/* Path 1: Trigger (140, 155) -> Logic (240, 155) */}
        <path 
          d="M 140 155 C 170 155, 210 155, 240 155" 
          stroke={isActive(1) ? scenario.themeColor : "#333"} 
          strokeWidth="3" 
          fill="none" 
          strokeDasharray={isActive(1) ? "0" : "5,5"}
          className="transition-colors duration-500"
        />

        {/* Path 2: Logic (360, 155) -> Action Top (420, 95) */}
        <path 
          d="M 360 155 C 390 155, 390 95, 420 95" 
          stroke={isActive(2) ? scenario.themeColor : "#333"} 
          strokeWidth="3" 
          fill="none" 
          className="transition-colors duration-500 delay-75"
        />

        {/* Path 3: Logic (360, 155) -> Action Bottom (420, 215) */}
        <path 
          d="M 360 155 C 390 155, 390 215, 420 215" 
          stroke={isActive(2) ? scenario.secondaryColor : "#333"} 
          strokeWidth="3" 
          fill="none" 
          className="transition-colors duration-500 delay-75"
        />
      </svg>

      {/* 4. Nodes Layer */}
      <div className={`absolute inset-0 z-10 p-8 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        
        {/* Node 1: Trigger (Left) - w-[120px] */}
        <div className={`absolute top-[110px] left-[20px] w-[120px] h-[90px] bg-[#121212] border rounded-xl p-2.5 flex flex-col justify-center transition-all duration-500 ${isActive(0) ? 'shadow-[0_0_20px_rgba(0,0,0,0.5)]' : ''}`}
             style={{ borderColor: isActive(0) ? scenario.themeColor : 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="p-1.5 rounded-md bg-zinc-800 transition-colors duration-500" style={{ backgroundColor: isActive(0) ? `${scenario.themeColor}20` : undefined }}>
                {React.createElement(scenario.nodes[0].icon, { 
                    className: "w-4 h-4 transition-colors duration-500", 
                    style: { color: isActive(0) ? scenario.themeColor : '#71717a' }
                })}
            </div>
          </div>
          <p className="text-sm text-zinc-300 font-semibold truncate">{scenario.nodes[0].title}</p>
          <div className="text-[11px] text-zinc-500 mt-0.5 font-mono truncate">{scenario.nodes[0].sub}</div>
          {/* Handle */}
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#121212] border-2 transition-colors duration-300"
               style={{ borderColor: isActive(1) ? scenario.themeColor : '#3f3f46', backgroundColor: isActive(1) ? scenario.themeColor : '#121212' }} />
        </div>

        {/* Node 2: Logic (Center) - w-[120px] */}
        <div className={`absolute top-[110px] left-[240px] w-[120px] h-[90px] bg-[#121212] border rounded-xl p-2.5 flex flex-col justify-center transition-all duration-500 delay-100 ${isActive(1) ? 'shadow-[0_0_20px_rgba(0,0,0,0.5)]' : ''}`}
             style={{ borderColor: isActive(1) ? '#EAB308' : 'rgba(255,255,255,0.1)' }}>
           {/* Handle */}
           <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#121212] border-2 transition-colors duration-300"
               style={{ borderColor: isActive(1) ? scenario.themeColor : '#3f3f46', backgroundColor: isActive(1) ? scenario.themeColor : '#121212' }} />
           
          <div className="flex items-center justify-between mb-1">
            <div className="p-1.5 rounded-md transition-colors duration-500" style={{ backgroundColor: isActive(1) ? '#EAB30833' : '#27272a' }}>
                 {React.createElement(scenario.nodes[1].icon, { 
                    className: "w-4 h-4 transition-colors duration-500", 
                    style: { color: isActive(1) ? '#EAB308' : '#71717a' }
                })}
            </div>
          </div>
          <p className="text-sm text-zinc-300 font-semibold truncate">{scenario.nodes[1].title}</p>
          <div className="text-[11px] text-zinc-500 mt-0.5 font-mono truncate">{scenario.nodes[1].sub}</div>
           {/* Handle */}
           <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#121212] border-2 transition-colors duration-300"
               style={{ borderColor: isActive(2) ? '#EAB308' : '#3f3f46', backgroundColor: isActive(2) ? '#EAB308' : '#121212' }} />
        </div>

        {/* Node 3: Action A (Top Right) - w-[120px] */}
        <div className={`absolute top-[50px] left-[420px] w-[120px] h-[90px] bg-[#121212] border rounded-xl p-2.5 flex flex-col justify-center transition-all duration-500 delay-200`}
             style={{ borderColor: isActive(2) ? scenario.themeColor : 'rgba(255,255,255,0.1)' }}>
          {/* Handle */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#121212] border-2 transition-colors duration-300"
               style={{ borderColor: isActive(2) ? scenario.themeColor : '#3f3f46', backgroundColor: isActive(2) ? scenario.themeColor : '#121212' }} />

          <div className="flex items-center justify-between mb-1">
            <div className="p-1.5 rounded-md transition-colors duration-500" style={{ backgroundColor: isActive(2) ? `${scenario.themeColor}20` : '#27272a' }}>
                {React.createElement(scenario.nodes[2].icon, { 
                    className: "w-4 h-4 transition-colors duration-500", 
                    style: { color: isActive(2) ? scenario.themeColor : '#71717a' }
                })}
            </div>
            {isActive(3) && <CheckCircle2 className="w-4 h-4 animate-in fade-in zoom-in" style={{ color: scenario.themeColor }} />}
          </div>
          <p className="text-sm text-zinc-300 font-semibold truncate">{scenario.nodes[2].title}</p>
          <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{scenario.nodes[2].sub}</div>
        </div>

        {/* Node 4: Action B (Bottom Right) - w-[120px] */}
        <div className={`absolute top-[170px] left-[420px] w-[120px] h-[90px] bg-[#121212] border rounded-xl p-2.5 flex flex-col justify-center transition-all duration-500 delay-200`}
             style={{ borderColor: isActive(2) ? scenario.secondaryColor : 'rgba(255,255,255,0.1)' }}>
           {/* Handle */}
           <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#121212] border-2 transition-colors duration-300"
               style={{ borderColor: isActive(2) ? scenario.secondaryColor : '#3f3f46', backgroundColor: isActive(2) ? scenario.secondaryColor : '#121212' }} />

          <div className="flex items-center justify-between mb-1">
            <div className="p-1.5 rounded-md transition-colors duration-500" style={{ backgroundColor: isActive(2) ? `${scenario.secondaryColor}20` : '#27272a' }}>
                 {React.createElement(scenario.nodes[3].icon, { 
                    className: "w-4 h-4 transition-colors duration-500", 
                    style: { color: isActive(2) ? scenario.secondaryColor : '#71717a' }
                })}
            </div>
            {isActive(3) && <CheckCircle2 className="w-4 h-4 animate-in fade-in zoom-in" style={{ color: scenario.secondaryColor }} />}
          </div>
          <p className="text-sm text-zinc-300 font-semibold truncate">{scenario.nodes[3].title}</p>
          <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{scenario.nodes[3].sub}</div>
        </div>

      </div>

      {/* 5. Navigation & Status - MOVED TO LEFT BELOW TRIGGER NODE */}
      <div className="absolute top-[235px] left-[20px] z-30 flex items-center gap-2">
        {/* Arrows */}
        <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/10 p-1 backdrop-blur-md">
            <button 
                onClick={() => handleManualSwitch('prev')}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white disabled:opacity-50"
                disabled={isTransitioning}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-px h-3 bg-white/10 mx-1"></div>
            <button 
                onClick={() => handleManualSwitch('next')}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white disabled:opacity-50"
                disabled={isTransitioning}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>

        {/* Status Text */}
         <div className="bg-zinc-900/90 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300">
            <Activity className={`w-3 h-3 ${isTransitioning ? 'text-zinc-600' : 'animate-pulse'}`} style={{ color: isTransitioning ? undefined : (activeStep >= 4 ? '#71717a' : scenario.themeColor) }} />
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                {isTransitioning ? "Switching" : activeStep === 0 ? "Listening" : activeStep >= 4 ? "Done" : "Running"}
            </span>
        </div>
      </div>

    </div>
  )
}