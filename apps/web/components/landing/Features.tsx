"use client"

import { Globe } from "../../components/ui/globe"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import FlowPreview from "./FlowPreview"

gsap.registerPlugin(ScrollTrigger)

export default function LandingFeatures() {
  const slotsContainerRef = useRef<HTMLDivElement>(null)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  
  // Box 2 refs
  const box2HeaderRef = useRef<HTMLHeadingElement>(null)
  const box2DescRef = useRef<HTMLParagraphElement>(null)
  const box2StatsRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<HTMLDivElement>(null)
  
  // Box 3 refs
  const box3HeaderRef = useRef<HTMLHeadingElement>(null)
  const box3DescRef = useRef<HTMLParagraphElement>(null)
  const box3ListRef = useRef<HTMLDivElement>(null)
  const box3CardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slots = slotRefs.current.filter(Boolean)
    
    // Animate slots with scroll trigger
    slots.forEach((slot, index) => {
      if (slot) {
        gsap.fromTo(slot, 
          {
            y: 40,
            opacity: 0,
            filter: "blur(10px)",
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: slot,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
              toggleActions: "play none none none"
            },
            delay: index * 0.1
          }
        )
      }
    })

    // Word-by-word animation for description
    if (descriptionRef.current) {
      const text = descriptionRef.current.textContent || ""
      const words = text.split(" ")
      
      // Clear the original text and create spans for each word
      descriptionRef.current.innerHTML = words.map((word, index) => 
        `<span class="inline-block" style="opacity: 0; filter: blur(5px); transform: translateY(20px);">${word}</span>`
      ).join(" ")
      
      const wordSpans = descriptionRef.current.querySelectorAll("span")
      
      gsap.to(wordSpans, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: "top 80%",
          end: "top 40%",
          scrub: 2,
          toggleActions: "play none none none"
        }
      })
    }

    // Box 2 Animations
    if (box2HeaderRef.current) {
      gsap.fromTo(box2HeaderRef.current,
        {
          y: 50,
          opacity: 0,
          filter: "blur(10px)"
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box2HeaderRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play none none none"
          }
        }
      )
    }

    if (box2DescRef.current) {
      gsap.fromTo(box2DescRef.current,
        {
          y: 40,
          opacity: 0,
          filter: "blur(8px)"
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box2DescRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play none none none"
          },
          delay: 0.2
        }
      )
    }

    if (box2StatsRef.current) {
      gsap.fromTo(box2StatsRef.current,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box2StatsRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play none none none"
          },
          delay: 0.4
        }
      )
    }

    if (globeRef.current) {
      gsap.fromTo(globeRef.current,
        {
          x: 100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: globeRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play none none none"
          },
          delay: 0.3
        }
      )
    }

    // Box 3 Animations
    if (box3HeaderRef.current) {
      gsap.fromTo(box3HeaderRef.current,
        {
          y: 4,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box3HeaderRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play none none none"
          }
        }
      )
    }

    if (box3DescRef.current) {
      gsap.fromTo(box3DescRef.current,
        {
          y: 4,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box3DescRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play none none none"
          },
          delay: 0.1
        }
      )
    }

    if (box3ListRef.current) {
      gsap.fromTo(box3ListRef.current,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box3ListRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play none none none"
          },
          delay: 0.2
        }
      )
    }

    if (box3CardRef.current) {
      gsap.fromTo(box3CardRef.current,
        {
          y: 60,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box3CardRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 1.5,
            toggleActions: "play none none none"
          },
          delay: 0.3
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="w-full py-12 lg:py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '78rem' }}>
        {/* Header */}
        <div className="text-start mb-8 lg:mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-white">
            Features Built to Simplify Web3 Automation
          </h2>
        </div>

         {/* Grid Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* First Row - Box 1 (1 col at position 3) */}
            <div className="col-span-1 p-6 lg:p-8 h-[320px] lg:h-[380px] rounded-[20px] lg:rounded-[30px] flex flex-col justify-between bg-[#111111]">
              {/* Feature Slots */}
              <div ref={slotsContainerRef} className="space-y-4">
                <div 
                  ref={(el) => { slotRefs.current[0] = el }}
                  className="p-5 rounded-2xl flex items-center gap-4 bg-[#747474]/10 drop-shadow-lg shadow-lg cursor-pointer transition-all duration-300 hover:bg-[#747474]/20 hover:scale-105 hover:shadow-xl"
                >
                  <svg className="w-7 h-7 flex-shrink-0 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-white text-md">Webhook Triggers</p>
                </div>

                <div 
                  ref={(el) => { slotRefs.current[1] = el }}
                  className="p-5 rounded-2xl flex items-center gap-4 bg-[#747474]/10 drop-shadow-lg shadow-lg cursor-pointer transition-all duration-300 hover:bg-[#747474]/20 hover:scale-105 hover:shadow-xl"
                >
                  <svg className="w-6 h-6 flex-shrink-0 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-white text-md">Instant alerts</p>
                </div>

                <div 
                  ref={(el) => { slotRefs.current[2] = el }}
                  className="p-5 rounded-2xl flex items-center gap-4 bg-[#747474]/10 drop-shadow-lg shadow-lg cursor-pointer transition-all duration-300 hover:bg-[#747474]/20 hover:scale-105 hover:shadow-xl"
                >
                  <svg className="w-6 h-6 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-white text-md">Secure execution</p>
                </div>
              </div>
             
             {/* Cool Description at bottom */}
             <div className="mt-2">
               <p ref={descriptionRef} className="text-white text-md p-1 m-1">
                 Advanced <span className="text-purple-400 font-bold">Automation Engine</span> that keeps your workflows running 24/7
               </p>
             </div>
           </div>
           
           {/* First Row - Box 2 (2 cols) */}
           <div className="col-span-1 lg:col-span-2 p-6 lg:p-8 h-[320px] lg:h-[380px] rounded-[20px] lg:rounded-[30px] bg-[#111111] flex relative overflow-hidden">
             {/* Left side - Content */}
             <div className="w-full lg:w-2/3 z-10 pr-6 lg:pr-12 py-4 flex flex-col justify-between">
               <div>
                 <h3 ref={box2HeaderRef} className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">Cross-Chain Ready</h3>
                 <p ref={box2DescRef} className="text-white text-sm lg:text-md leading-relaxed mt-4 lg:mt-8">
                   Connect with Solana blockchain and Web2 services seamlessly. Build powerful automations that bridge Web3 and traditional platforms.
                 </p>
               </div>
               
               {/* Bottom stats */}
               <div ref={box2StatsRef} className="text-white text-sm">
                 <div className="mb-1 flex items-center gap-2">
                   <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                   </svg>
                   Solana native integration
                 </div>
                 <div className="flex items-center gap-2">
                   <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                   </svg>
                   Real-time execution
                 </div>
               </div>
             </div>
             
             {/* Right side - Globe - Hidden on mobile */}
             <div ref={globeRef} className="absolute right-[-100px] top-[80px] w-[500px] h-[500px] hidden lg:block">
               <Globe className="absolute" />
             </div>
           </div>
            
           {/* Second Row - Box 3 (Full width) */}
           <div className="col-span-1 lg:col-span-3 p-6 lg:p-8 h-[320px] lg:h-[380px] rounded-[20px] lg:rounded-[30px] bg-[#111111] flex items-start justify-between relative overflow-hidden">
             {/* Left side - Content */}
             <div className="w-full max-w-xl flex-1 pr-6 lg:pr-12 py-4 flex flex-col justify-between">
               <div>
                 <h3 ref={box3HeaderRef} className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">Visual Flow Builder</h3>
                 <p ref={box3DescRef} className="text-white text-sm lg:text-md leading-relaxed mb-6 lg:mb-10">
                   Create complex automations with our intuitive drag-and-drop interface. Monitor logs, track performance, and manage your flows all in one place.
          </p>
        </div>
               
               {/* Feature list - positioned at bottom */}
               <div ref={box3ListRef} className="space-y-2">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                   <span className="text-white text-sm">No-code workflow builder</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                   <span className="text-white text-sm">Real-time monitoring & logs</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                   <span className="text-white text-sm">Performance analytics</span>
                 </div>
               </div>
             </div>
             
             {/* Right side - Inner box - Hidden on mobile */}
             <div ref={box3CardRef} className="absolute right-[-10px] top-[100px] w-[600px] h-[500px] rounded-[17px] bg-[#111111] border border-white/16 flex-shrink-0 hidden lg:block" style={{ boxShadow: '0 0 0 10px rgba(255, 255, 255, 0.1)' }}>
               <FlowPreview />
              </div>
              </div>
              </div>
        </div>
      </div>
  )
}
