"use client"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Bell, Search, LogOut, User, Settings } from "lucide-react"
import { Dropdown } from "@/components/ui/dropdown"
import { Badge } from "@/components/ui/badge"
import { WorkspaceSwitcher } from "./workspace-switcher"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/chat": "AI Chat",
  "/dashboard/analytics": "Analytics",
  "/dashboard/workspace": "Workspace",
  "/dashboard/settings": "Settings",
}

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const title = PAGE_TITLES[pathname] ?? "NeuroDesk"
  const initials = session?.user?.name?.slice(0, 2).toUpperCase() ?? "ND"

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-white/6 bg-zinc-950/80 backdrop-blur-md shrink-0" role="banner">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-zinc-100">{title}</h1>
        <WorkspaceSwitcher />
      </div>
      <div className="flex items-center gap-2">
        {/* Search */}
        <button aria-label="Search" className="h-8 flex items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-3 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/6 transition-colors">
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline text-[10px] border border-white/10 rounded px-1">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button aria-label="Notifications" className="relative h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/6 transition-colors">
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-violet-500" aria-label="Unread notifications" />
        </button>

        {/* User */}
        <Dropdown
          trigger={
            <button aria-label="User menu" className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white hover:ring-2 hover:ring-violet-500 hover:ring-offset-1 hover:ring-offset-zinc-950 transition-all">
              {initials}
            </button>
          }
          items={[
            { label: session?.user?.email ?? "User", icon: <User />, onClick: () => {}, disabled: true },
            { label: "Profile Settings", icon: <Settings />, onClick: () => router.push("/dashboard/settings") },
            { label: "Sign out", icon: <LogOut />, onClick: () => signOut({ callbackUrl: "/login" }), danger: true },
          ]}
        />
      </div>
    </header>
  )
}
