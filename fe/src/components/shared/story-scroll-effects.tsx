"use client"

import { useEffect, useRef } from "react"
import { mountStoryMotion } from "@/lib/story-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function StoryScrollEffects() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = ref.current?.closest("main")
    if (root) return mountStoryMotion(root, gsap, ScrollTrigger)
  }, [])
  return <span ref={ref} hidden />
}
