import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-300 border-zinc-700",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/15 text-red-400 border-red-500/30",
  info: "bg-violet-500/15 text-violet-400 border-violet-500/30",
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}
