"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface HeroAnimationProps {
  leftContent: ReactNode
  rightContent: ReactNode
}

export function HeroAnimation({ leftContent, rightContent }: HeroAnimationProps) {
  return (
    <div className="relative z-10 mx-auto max-w-[1600px] px-4 text-center md:px-6">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {leftContent}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          {rightContent}
        </motion.div>
      </div>
    </div>
  )
}
