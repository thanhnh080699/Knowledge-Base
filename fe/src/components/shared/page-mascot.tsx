"use client"

import { useEffect, useRef } from "react"
import { mountPageMascot } from "@/lib/page-mascot"

export function PageMascot() {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (ref.current) return mountPageMascot(ref.current)
  }, [])
  return <aside className="hero-mascot" aria-label="Mèo, bạn đồng hành khám phá">
    <div className="mascot-greeting"><span>Meo! Chào bạn.</span><p>Cùng tìm điều bạn cần nhé!</p></div>
    <div className="mascot-stage">
      <div className="mascot-orbit" aria-hidden="true" />
      <button ref={ref} type="button" className="mascot-button" data-page-mascot aria-label="Chạm để chào mèo">
        <span data-mascot-sprite className="mascot-sprite" aria-hidden="true">
          <span data-mascot-directions className="mascot-layer" style={{ backgroundPosition: "50% 50%" }} />
          <span data-mascot-reactions className="mascot-layer" style={{ backgroundPosition: "0% 0%", opacity: 0 }} />
        </span>
      </button>
    </div>
    <a className="mascot-start" href="#cau-chuyen">Cùng bắt đầu <span aria-hidden="true">↓</span></a>
  </aside>
}
