"use client"
import { useState, useRef, useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface DropdownItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: "left" | "right"
}

export function Dropdown({ trigger, items, align = "right" }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)} role="button" aria-haspopup="true" aria-expanded={open}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn("absolute z-50 mt-1 w-52 rounded-xl border border-white/10 bg-zinc-900 shadow-xl py-1",
              align === "right" ? "right-0" : "left-0")} role="menu">
            {items.map((item, i) => (
              <button key={i} role="menuitem" disabled={item.disabled}
                onClick={() => { item.onClick(); setOpen(false) }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                  item.danger ? "text-red-400 hover:bg-red-500/10" : "text-zinc-300 hover:bg-white/6 hover:text-white",
                  item.disabled && "opacity-40 cursor-not-allowed"
                )}>
                {item.icon && <span className="h-4 w-4 opacity-70">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
