"use client"
import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  content: string
  children: ReactNode
  side?: "top" | "bottom" | "left" | "right"
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [show, setShow] = useState(false)
  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div role="tooltip" className={cn("absolute z-50 whitespace-nowrap rounded-md bg-zinc-800 border border-white/10 px-2.5 py-1.5 text-xs text-zinc-200 shadow-xl", positions[side])}>
          {content}
        </div>
      )}
    </div>
  )
}
