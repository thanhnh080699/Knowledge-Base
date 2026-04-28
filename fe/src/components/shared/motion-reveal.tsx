"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function MotionReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
