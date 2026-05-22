"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useState, useEffect } from "react"
import type { CSSProperties, MouseEvent, ReactNode } from "react"

type HomeRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function HomeReveal({ children, className = "", delay = 0 }: HomeRevealProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.48, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

type MouseFollowCardProps = {
  children: ReactNode
  className?: string
}

type GlowStyle = CSSProperties & {
  "--mouse-x"?: string
  "--mouse-y"?: string
}

export function MouseFollowCard({ children, className = "" }: MouseFollowCardProps) {
  const reducedMotion = useReducedMotion()

  function updateGlow(event: MouseEvent<HTMLElement>) {
    if (reducedMotion) return

    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`)
  }

  return (
    <article
      onMouseMove={updateGlow}
      className={`home-mouse-card ${className}`}
      style={{ "--mouse-x": "50%", "--mouse-y": "50%" } as GlowStyle}
    >
      {children}
    </article>
  )
}

type TypingTextProps = {
  text: string
  speed?: number
  delay?: number
}

export function TypingText({ text, speed = 80, delay = 400 }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    let active = true
    const mountTimer = setTimeout(() => {
      if (active) setMounted(true)
    }, 0)

    if (reducedMotion) {
      const textTimer = setTimeout(() => {
        if (active) setDisplayedText(text)
      }, 0)
      return () => {
        active = false
        clearTimeout(mountTimer)
        clearTimeout(textTimer)
      }
    }

    let index = 0
    let intervalId: NodeJS.Timeout

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index < text.length) {
          index++
          setDisplayedText(text.slice(0, index))
        } else {
          clearInterval(intervalId)
        }
      }, speed)
    }, delay)

    return () => {
      active = false
      clearTimeout(mountTimer)
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, speed, delay, reducedMotion])

  // SSR fallback
  if (!mounted) {
    return (
      <span className="home-type-word" style={{ opacity: 0 }}>
        {text}
      </span>
    )
  }

  return <span className="home-type-word">{displayedText}</span>
}

