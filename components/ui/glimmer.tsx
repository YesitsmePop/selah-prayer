"use client"

import React, { useEffect, useRef } from "react"

/**
 * Glimmer
 * Renders subtle glimmer elements on left and right sides of the page.
 * It creates a couple of absolutely-positioned spans which animate in and out
 * at random intervals. Respects prefers-reduced-motion and is aria-hidden.
 */
export default function Glimmer() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const el = containerRef.current
    if (!el) return

    let running = true
    let watchdog: number | null = null

    const scheduleNext = (min = 1200, extra = 7000) => {
      // next between min .. min+extra
      return Math.max(min, min + Math.random() * extra)
    }

    const spawnOne = () => {
      if (!running) return

      const span = document.createElement("span")
      span.className = "glimmer"

  // Randomize position anywhere on the viewport (avoid edges a bit)
  const leftPct = 4 + Math.random() * 92 // 4% .. 96%
  const topPct = 4 + Math.random() * 92 // 4% .. 96%
  span.style.left = `${leftPct}vw`
  span.style.top = `${topPct}vh`

  // Randomize size (px)
  const size = 120 + Math.random() * 260 // 120 - 380
  span.style.width = `${size}px`
  span.style.height = `${size}px`

  // Slight random rotation for variety
  const rot = -32 + Math.random() * 64
  span.style.setProperty("--glimmer-rot", `${rot}deg`)

      el.appendChild(span)

      // Remove after animation completes (match CSS: 2600ms)
      const removeAfter = 2800
      const tid = window.setTimeout(() => {
        span.remove()
        window.clearTimeout(tid)
      }, removeAfter)

      // Clear and reset watchdog so we guarantee at least one every 12s
      if (watchdog) {
        window.clearTimeout(watchdog)
        watchdog = null
      }
      watchdog = window.setTimeout(() => {
        if (running) spawnOne()
      }, 12000)

      // Schedule the next spawn at a random interval (between 0.8s and 9s)
      const next = scheduleNext(800, 8200)
      window.setTimeout(() => {
        if (running) spawnOne()
      }, next)
    }

    // Respect reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!mq.matches) {
      // Start with a slight random delay so the first isn't always immediate
      window.setTimeout(() => spawnOne(), 800 + Math.random() * 1600)
    }

    return () => {
      running = false
      if (watchdog) window.clearTimeout(watchdog)
    }
  }, [])

  return <div ref={containerRef} aria-hidden className="glimmer-root pointer-events-none" />
}
