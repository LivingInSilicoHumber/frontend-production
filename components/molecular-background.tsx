"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

// Floating decorative elements like in the reference image
function FloatingDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Teal/mint decorative circles - positioned around the page */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-accent"
        style={{ top: "15%", right: "20%" }}
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-accent/70"
        style={{ top: "25%", right: "15%" }}
        animate={{
          y: [0, 8, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-accent"
        style={{ top: "60%", left: "10%" }}
        animate={{
          y: [0, -8, 0],
          x: [0, 4, 0],
        }}
        transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-5 h-5 rounded-full bg-accent/60"
        style={{ bottom: "30%", left: "15%" }}
        animate={{
          y: [0, 6, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-accent/80"
        style={{ bottom: "20%", right: "25%" }}
        animate={{
          y: [0, -5, 0],
          x: [0, -3, 0],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-accent"
        style={{ top: "40%", right: "8%" }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.8 }}
      />
    </div>
  )
}

export function MolecularBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize nodes - more subtle with gray colors
    const nodeCount = 40
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 1.5 + 0.5,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes with gray/black colors
      nodesRef.current.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw node - subtle gray
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
        ctx.fill()

        // Draw connections - light gray lines
        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.06 * (1 - distance / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {/* Floating teal decorative elements */}
      <FloatingDecorations />
      {/* Subtle radial gradient overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(94, 234, 212, 0.04) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />
    </>
  )
}
