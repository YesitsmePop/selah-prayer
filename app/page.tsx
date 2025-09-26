"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const scriptures = [
  '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." - Philippians 4:6',
  '"Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours." - Mark 11:24',
  '"The prayer of a righteous person is powerful and effective." - James 5:16',
  '"Call to me and I will answer you and tell you great and unsearchable things you do not know." - Jeremiah 33:3',
  '"And pray in the Spirit on all occasions with all kinds of prayers and requests." - Ephesians 6:18',
]

interface VaporChar {
  id: number
  char: string
  timestamp: number
}

interface Firework {
  id: number
  x: number
  y: number
  color: string
  sparks: Spark[]
}

interface Spark {
  id: number
  x: number
  y: number
  color: string
}

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [vaporChars, setVaporChars] = useState<VaporChar[]>([])
  const [charIdCounter, setCharIdCounter] = useState(0)
  const [hasStartedTyping, setHasStartedTyping] = useState(false)
  const [totalTypedChars, setTotalTypedChars] = useState(0)
  const [wpm, setWpm] = useState<number | null>(null)
  const [fireworks, setFireworks] = useState<Firework[]>([])
  const [fireworkInterval, setFireworkInterval] = useState<NodeJS.Timeout | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const totalTypedRef = useRef<number>(0)
  const typingStartRef = useRef<number | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const createFirework = useCallback(() => {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#00d2d3",
      "#ff9f43",
      "#10ac84",
      "#ee5a24",
      "#0abde3",
      "#feca57",
      "#48dbfb",
      "#ff6348",
      "#1dd1a1",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
    ]

    const newFirework: Firework = {
      id: Date.now() + Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * (window.innerHeight * 0.7) + window.innerHeight * 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      sparks: [],
    }

    // Create sparks for the firework
    const sparkCount = 12 + Math.random() * 8
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2
      const distance = 50 + Math.random() * 100
      newFirework.sparks.push({
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    setFireworks((prev) => [...prev, newFirework])

    // Remove firework after animation
    setTimeout(() => {
      setFireworks((prev) => prev.filter((fw) => fw.id !== newFirework.id))
    }, 1500)
  }, [])

  useEffect(() => {
    if (showSuccess) {
      // focus overlay for keyboard users so Escape will be captured
      setTimeout(() => overlayRef.current?.focus(), 0)
      // Create initial firework immediately
      createFirework()

      // Then create fireworks every 300-800ms
      const interval = setInterval(
        () => {
          createFirework()
        },
        300 + Math.random() * 500,
      )

      setFireworkInterval(interval)
    } else {
      if (fireworkInterval) {
        clearInterval(fireworkInterval)
        setFireworkInterval(null)
      }
      setFireworks([])
    }

    return () => {
      if (fireworkInterval) {
        clearInterval(fireworkInterval)
      }
    }
  }, [showSuccess, createFirework])

  const handleSuccessClick = useCallback(() => {
    setShowSuccess(false)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Prevent default behavior for printable characters
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()

        if (!hasStartedTyping) {
          setHasStartedTyping(true)
        }

        // Add the character to our vapor display
        const newChar: VaporChar = {
          id: charIdCounter,
          char: e.key,
          timestamp: Date.now(),
        }

        setVaporChars((prev) => [...prev, newChar])
        setCharIdCounter((prev) => prev + 1)
        // initialize start time on first keystroke
        setTotalTypedChars((prev) => {
          const next = prev + 1
          totalTypedRef.current = next
          if (!typingStartRef.current) {
            typingStartRef.current = Date.now()
          }
          return next
        })

        setTimeout(() => {
          setVaporChars((prev) => prev.filter((char) => char.id !== newChar.id))
        }, 950)
      }

      // Allow backspace, delete, arrow keys, etc.
      if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab"].includes(e.key)) {
        // For backspace, remove the most recent character immediately
        if (e.key === "Backspace") {
          e.preventDefault()
          setVaporChars((prev) => prev.slice(0, -1))
        }
      }
    },
    [charIdCounter, hasStartedTyping],
  )

  // WPM calculation: single interval reads refs so it doesn't recreate on every keystroke.
  useEffect(() => {
    const update = () => {
      const start = typingStartRef.current
      if (!start) return
      const now = Date.now()
      const elapsedMinutes = (now - start) / 60000
      const charsTyped = totalTypedRef.current
      const words = charsTyped / 5
      if (elapsedMinutes > 0.033) {
        const rawWpm = words / elapsedMinutes
        setWpm((prev) => {
          if (prev === null) return Math.round(rawWpm)
          return Math.round(prev * 0.6 + rawWpm * 0.4)
        })
      }
    }

    const interval = setInterval(update, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (vaporChars.length > 4) {
      setVaporChars((prev) => prev.slice(-4))
    }
  }, [vaporChars])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    setVaporChars([])

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setShowSuccess(true)

    // reset typing stats after successful submit
    setHasStartedTyping(false)
    setTotalTypedChars(0)
    totalTypedRef.current = 0
    typingStartRef.current = null
    setWpm(null)
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {showSuccess && (
        <div
          className="fixed inset-0 success-animation flex items-center justify-center z-50 cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-label="Prayer sent"
          onClick={handleSuccessClick}
          onTouchStart={handleSuccessClick}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleSuccessClick()
          }}
          tabIndex={-1}
          ref={(el) => { overlayRef.current = el }}
        >
          {/* Fireworks */}
          {fireworks.map((firework) => (
            <div key={firework.id} className="firework" style={{ left: firework.x, top: firework.y }}>
              <div className="firework-explosion" style={{ backgroundColor: firework.color }} />
              {firework.sparks.map((spark) => (
                <div
                  key={spark.id}
                  className="firework-spark"
                  style={
                    {
                      backgroundColor: spark.color,
                      "--spark-x": `${spark.x}px`,
                      "--spark-y": `${spark.y}px`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          ))}

          <div className="text-center space-y-6">
            <div className="text-7xl mb-6">✨</div>
            <h2 className="text-5xl font-serif text-foreground">Prayer Sent</h2>
            <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
              Your prayer has been lifted up. May you find peace in knowing it has been heard.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-4">(Click anywhere to return to prayer)</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="text-center py-10 px-4 sm:py-12">
        <div className="flex items-center justify-center gap-4 mb-3">
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-sans font-bold text-foreground tracking-tight bg-gradient-to-br from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
            Selah
          </h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Developed through MDevLinks</p>
        <p className="text-sm sm:text-base text-foreground max-w-3xl mx-auto leading-relaxed font-light px-2 sm:px-0">
          A sacred space for prayer and reflection. Type your heart's words and watch them rise like incense.
        </p>
      </header>

      {/* Scripture - Top */}
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <blockquote className="scripture-text text-base text-muted-foreground italic text-center">
          {scriptures[0]}
        </blockquote>
      </div>

      {/* Main Prayer Area */}
      <main className="max-w-5xl mx-auto px-4 mb-12 sm:mb-16">
        <div className="relative">
            <div className="modern-card rounded-2xl p-6 sm:p-12 shadow-2xl prayer-box">
            <div className="relative w-full h-14 sm:h-16 md:h-20 ">
              <textarea
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                placeholder={
                  hasStartedTyping ? "" : "Begin typing your prayer here... each letter will fade away as you type..."
                }
                  className="prayer-input absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none text-transparent placeholder:text-muted-foreground/50 text-2xl sm:text-3xl leading-tight font-mono caret-transparent"
                  rows={1}
                style={{ fontFamily: "inherit" }}
              />

              <div className="absolute inset-0 p-0 pointer-events-none flex items-start">
                <div className="flex flex-wrap items-center text-2xl sm:text-3xl leading-tight font-mono text-foreground">
                  {vaporChars.map((vaporChar, index) => (
                    <span
                      key={vaporChar.id}
                      className="vapor-char-display inline-block"
                      style={{
                        animation: `vaporFade 1.4s ease-out forwards`,
                        animationDelay: "0s",
                      }}
                    >
                      {vaporChar.char === " " ? "\u00A0" : vaporChar.char}
                    </span>
                  ))}
                  <span className="vapor-caret inline-block w-1 h-9 sm:h-12 bg-gradient-to-b from-foreground to-muted-foreground animate-pulse" />
                </div>
              </div>
              {/* WPM Counter placed visually under the input at the right side */}
                {/* hide on very small screens */}
                <div className="wpm-counter pointer-events-auto absolute right-4 bottom-3 text-xs sm:text-sm text-muted-foreground hidden xs:block sm:block">
                {wpm === null ? <span>WPM: —</span> : <span>WPM: {wpm}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-12">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-background hover:bg-muted text-foreground border-2 border-foreground hover:border-muted-foreground px-12 py-4 text-xl font-sans font-medium rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"></div>
                Sending Prayer...
              </span>
            ) : (
              "Send Prayer"
            )}
          </Button>
        </div>
      </main>

      {/* Scripture - Middle */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-transparent via-muted/10 to-transparent p-6 rounded-lg">
          <blockquote className="scripture-text text-base text-muted-foreground italic text-right font-light">
            {scriptures[1]}
          </blockquote>
        </div>
      </div>

      {/* Additional Scriptures Scattered */}
      <div className="max-w-6xl mx-auto px-4 space-y-20 mb-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-muted/5 to-transparent p-6 rounded-lg">
            <blockquote className="scripture-text text-base text-muted-foreground italic font-light">
              {scriptures[2]}
            </blockquote>
          </div>
          <div className="bg-gradient-to-bl from-muted/5 to-transparent p-6 rounded-lg">
            <blockquote className="scripture-text text-base text-muted-foreground italic text-right font-light">
              {scriptures[3]}
            </blockquote>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-transparent via-muted/10 to-transparent p-6 rounded-lg">
            <blockquote className="scripture-text text-base text-muted-foreground italic font-light">
              {scriptures[4]}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 text-center bg-gradient-to-t from-muted/5 to-transparent relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-base text-muted-foreground mb-3">
            <Link href="/disclaimer" className="underline hover:text-foreground transition-colors">
              How this works
            </Link>
            <Link href="https://m-dev-links.vercel.app/" target="_blank" className="underline hover:text-foreground transition-colors">
              For more of similar taste
            </Link>
            <Link href="https://www.rcmanteca.com/" target="_blank" className="underline hover:text-foreground transition-colors">
              Need a church?
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">"Be still, and know that I am God" - Psalm 46:10</p>
        </div>
        <div className="absolute left-4 bottom-4 text-sm text-muted-foreground">© 2025 Selah Prayer</div>
      </footer>
    </div>
  )
}
