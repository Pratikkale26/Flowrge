"use client"

import { useEffect, useState } from "react"

export default function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      className="fixed w-96 h-96 pointer-events-none z-0 opacity-20 transition-all duration-300 ease-out"
      style={{
        left: mousePosition.x - 192,
        top: mousePosition.y - 192,
        background: "radial-gradient(circle, var(--neon-purple) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  )
}


