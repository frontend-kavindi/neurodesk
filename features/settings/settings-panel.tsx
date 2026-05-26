"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Sun, Moon, Monitor, Bell, Zap, Save } from "lucide-react"
import { useUIStore } from "@/store/ui-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ThemeMode } from "@/types"
import { cn } from "@/lib/utils"

const THEMES: { value: ThemeMode; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export function SettingsPanel() {
  const { data: session } = useSession()
  const { theme, preferences, toggleTheme, updatePreferences } = useUIStore()
  const [name, setName] = useState(session?.user?.name ?? "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h2 className="text-base font-semibold text-zinc-100">Settings</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-14 w-14 rounded-2xl bg-violet-600 flex items-center justify-center text-xl font-bold text-white">
              {(session?.user?.name ?? "ND").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-zinc-100">{session?.user?.name ?? "User"}</p>
              <p className="text-sm text-zinc-500">{session?.user?.email ?? "user@neurodesk.ai"}</p>
            </div>
          </div>
          <Input label="Display name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          <Input label="Email" value={session?.user?.email ?? ""} disabled hint="Email cannot be changed" />
          <Button onClick={handleSave} loading={saving} variant={saved ? "secondary" : "primary"}>
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400 mb-3">Choose your preferred color theme</p>
          <div className="flex gap-2">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => toggleTheme(value)} aria-pressed={theme === value}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border transition-all text-sm font-medium",
                  theme === value
                    ? "border-violet-500 bg-violet-600/15 text-violet-300"
                    : "border-white/10 bg-white/3 text-zinc-500 hover:text-zinc-300 hover:bg-white/6"
                )}>
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: "notifications", label: "Push notifications", desc: "Receive alerts for important events", icon: Bell },
            { key: "compactMode", label: "Compact mode", desc: "Reduce spacing for denser UI", icon: Zap },
          ].map(({ key, label, desc, icon: Icon }) => (
            <motion.div key={key} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-zinc-500" />
                <div>
                  <p className="text-sm font-medium text-zinc-200">{label}</p>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </div>
              </div>
              <button role="switch" aria-checked={preferences[key as keyof typeof preferences] as boolean}
                onClick={() => updatePreferences({ [key]: !preferences[key as keyof typeof preferences] })}
                className={cn(
                  "relative h-5 w-9 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                  preferences[key as keyof typeof preferences] ? "bg-violet-600" : "bg-zinc-700"
                )}>
                <span className={cn(
                  "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  preferences[key as keyof typeof preferences] ? "translate-x-4" : "translate-x-0"
                )} />
              </button>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card variant="bordered" className="border-red-500/20">
        <CardHeader><CardTitle className="text-red-400">Danger Zone</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500 mb-4">Irreversible actions. Be careful.</p>
          <Button variant="danger" size="sm">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}
