"use client"

import { useState } from "react"

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0)

    const faqs = [
        {
            question: "What is Flowrge?",
            answer: "Flowrge is the first automation platform built specifically for the Solana ecosystem. Connect Web3 and Web2 services with simple drag-and-drop flows, allowing you to automate tasks across blockchain and traditional platforms without writing any code."
        },
        {
            question: "Which services can I integrate with Flowrge?",
            answer: "Flowrge supports webhook triggers, Solana blockchain events, and various actions including sending SOL/tokens, posting on social media, writing to Google Sheets, sending emails, and more. We're continuously adding new integrations to expand your automation possibilities."
        },
        {
            question: "How does Flowrge work?",
            answer: "Flowrge works in three simple steps: First, set up your triggers (webhooks or Solana events). Second, define your actions using our visual flow builder. Finally, deploy and monitor your automations in real-time from our intuitive dashboard. No coding required!"
        },
        {
            question: "Do I need coding knowledge to use Flowrge?",
            answer: "No coding knowledge is required! Flowrge features an intuitive visual builder that lets you create complex automation flows with simple drag-and-drop. Our platform is designed for everyone, from developers to non-technical users."
        }
    ]

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index)
    }

    return (
        <div className="w-full py-12 lg:py-20 px-4 mx-auto" style={{ backgroundColor: '#0a0a0a', maxWidth: '78rem' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Section - Header */}
                    <div className="mb-4 xl:mb-0">
                        <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 animate-fade-in-up">
                            Frequently Asked <span className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent">Questions</span>
                        </h2>
                        <p className="text-zinc-400 text-sm lg:text-base xl:text-lg mb-6 lg:mb-8 leading-relaxed">
                            Find clear and simple answers to the most common questions about Flowrge automation platform.
                        </p>
                        <button className="px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-all duration-300 border border-zinc-700 hover:scale-105">
                            Contact Support
                        </button>
                    </div>

                    {/* Right Section - FAQ Items */}
                    <div className="space-y-3 lg:space-y-4">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index}
                                className="border border-zinc-800 rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-700"
                                style={{ backgroundColor: '#121212' }}
                            >
                                {/* Question Header */}
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-4 lg:px-6 py-4 lg:py-5 flex items-center justify-between text-left hover:bg-zinc-900/50 transition-colors"
                                >
                                    <span className="text-white text-sm lg:text-base xl:text-lg font-semibold pr-4">
                                        {faq.question}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-white transition-transform duration-300 flex-shrink-0 ${
                                            openIndex === index ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Answer Content */}
                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                        openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-4 lg:px-6 pb-4 lg:pb-5 text-zinc-400 text-sm lg:text-base leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

