"use client"

import { useEffect, useRef } from "react"

export function StoryScrollEffects() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = ref.current?.closest("main")
    const stage = root?.querySelector("[data-story-workspace]")
    if (!root || !stage) return
    let disposed = false
    let loading = false
    let cleanup: (() => void) | undefined
    let anchor = window.location.hash
    let frame = 0
    const load = async () => {
      if (loading) return
      loading = true
      observer.disconnect()
      try {
        const [{ mountStoryMotion }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import("@/lib/story-motion"), import("gsap"), import("gsap/ScrollTrigger"),
        ])
        if (disposed) return
        cleanup = mountStoryMotion(root, gsap, ScrollTrigger)
        // Pin spacing changes document coordinates. Preserve an anchor navigation
        // that arrived before the deferred scene was ready, after its first refresh.
        if (anchor) frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            if (disposed || window.location.hash !== anchor) return
            const target = document.getElementById(anchor.slice(1))
            if (target && root.contains(target)) {
              ScrollTrigger.refresh()
              target.scrollIntoView({ behavior: "instant", block: "start" })
            }
          })
        })
      } catch {
        // Server-rendered content remains readable if the enhancement fails.
      }
    }
    // Keep GSAP out of the hero's critical network and execution path.
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) void load()
    }, { rootMargin: "300px 0px" })
    const navigate = () => {
      if (!cleanup) { anchor = window.location.hash; void load() }
    }
    observer.observe(stage)
    root.querySelectorAll("[data-tools-demo], .story-repos").forEach(element => observer.observe(element))
    window.addEventListener("hashchange", navigate)
    if (anchor) void load()
    return () => {
      disposed = true
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("hashchange", navigate)
      cleanup?.()
    }
  }, [])
  return <span ref={ref} hidden />
}
