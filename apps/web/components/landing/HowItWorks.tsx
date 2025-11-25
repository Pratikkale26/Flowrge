"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0)
    
    const steps = [
        {
            title: "1. Connect Your Triggers",
            description: "Choose from webhook triggers or wait for Solana blockchain events. Set up your automation starting point in seconds.",
            image: "/triggers.png"
        },
        {
            title: "2. Define Your Actions",
            description: "Select actions like sending SOL, posting to social media, or integrating with Web2 services. Build your flow visually.",
            image: "/actions.png"
        },
        {
            title: "3. Deploy & Monitor",
            description: "Activate your automation and monitor executions in real-time. View logs, analytics, and manage all your flows from one dashboard.",
            image: "/monitors.png"
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 3)
        }, 3000)
        
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-full py-12 lg:py-20">
            {/* Header */}
            <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-white text-center mb-8 lg:mb-12 animate-fade-in-up px-4">
                How it <span className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent">Works</span>
            </h2>
            
            <div className="w-full min-h-[400px] lg:h-[470px] border-t border-b border-zinc-800" style={{ backgroundColor: '#0a0a0a' }}>
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
                    <div className="w-full h-full lg:border-l lg:border-r border-zinc-800 flex flex-col lg:flex-row">
                        {/* Left Section - Steps */}
                        <div className="flex-1 flex flex-col w-full lg:w-1/2">
                            {steps.map((step, index) => (
                                <div 
                                    key={index}
                                    className={`flex-1 ${index < 2 ? 'border-b border-zinc-800' : ''} p-4 lg:p-8 flex items-center relative overflow-hidden cursor-pointer transition-colors hover:bg-zinc-900/30`}
                                    onClick={() => setActiveStep(index)}
                                >
                                    {/* Animated Left Border */}
                                    <div 
                                        className="absolute left-0 top-0 w-1 bg-gradient-to-b from-[var(--neon-purple)] to-[var(--neon-blue)] ease-linear"
                                        style={{
                                            height: activeStep === index ? '100%' : '0%',
                                            transition: activeStep === index ? 'height 3s linear' : 'none'
                                        }}
                                    />
                                    
                                    <div className="relative z-10">
                                        <h3 className="text-lg lg:text-2xl text-white mb-2 lg:mb-3 font-semibold transition-colors" style={{
                                            color: activeStep === index ? 'white' : '#71717a'
                                        }}>
                                            {step.title}
                                        </h3>
                                        <p className="text-zinc-400 text-sm lg:text-base leading-relaxed max-w-md">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Vertical Separator Line - Hidden on mobile */}
                        <div className="w-px bg-zinc-800 hidden lg:block"></div>

                        {/* Right Section - Dynamic Image - Hidden on mobile */}
                        <div className="flex-1 overflow-hidden relative bg-zinc-900/30 hidden lg:block">
                            {steps.map((step, index) => (
                                <div 
                                    key={index}
                                    className={`w-full h-full absolute inset-0 transition-opacity duration-500 flex items-center justify-center ${
                                        activeStep === index ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <Image 
                                        src={step.image} 
                                        alt={step.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

