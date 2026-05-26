"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError("")
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Registration failed")
        return
      }
      router.push("/login?registered=1")
    } catch {
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-9 w-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Zap className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold tracking-tight">NeuroDesk</span>
        </div>

        <div className="rounded-2xl border border-white/8 bg-zinc-900/80 backdrop-blur-sm p-7 shadow-2xl">
          <h1 className="text-lg font-semibold text-zinc-100 mb-1">Create account</h1>
          <p className="text-sm text-zinc-500 mb-6">Start your free trial today</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input label="Full name" placeholder="Alex Chen" error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Input label="Confirm password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2" role="alert">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" loading={isSubmitting} className="w-full mt-2">
              Create account <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
