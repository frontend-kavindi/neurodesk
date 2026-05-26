import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ghost" | "bordered"
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        variant === "default" && "bg-zinc-900 border border-white/8 shadow-xl",
        variant === "ghost" && "bg-white/4",
        variant === "bordered" && "border border-white/12 bg-zinc-900/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pb-3 flex items-center justify-between", className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold text-zinc-200", className)} {...props} />
}
