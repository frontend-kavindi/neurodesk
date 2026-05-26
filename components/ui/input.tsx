"use client"
import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "h-9 w-full rounded-lg border bg-white/5 px-3 text-sm text-white placeholder:text-zinc-500",
            "transition-all duration-150 outline-none",
            "focus:border-violet-500 focus:bg-white/8 focus:ring-1 focus:ring-violet-500",
            error ? "border-red-500/60" : "border-white/10 hover:border-white/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <p id={`${inputId}-error`} className="text-xs text-red-400" role="alert">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-zinc-500">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"
