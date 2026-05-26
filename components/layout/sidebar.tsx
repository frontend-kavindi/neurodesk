"use client"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, MessageSquare, BarChart3, Building2,
  Settings, Zap, ChevronLeft, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { Tooltip } from "@/components/ui/tooltip"

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "AI Chat", icon: MessageSquare, href: "/dashboard/chat" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Workspace", icon: Building2, href: "/dashboard/workspace" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, setActiveRoute } = useUIStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => { setActiveRoute(pathname) }, [pathname, setActiveRoute])

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 220 : 56 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full bg-zinc-950 border-r border-white/6 overflow-hidden shrink-0"
      aria-label="Sidebar navigation">
      {/* Logo */}
      <div className="flex items-center h-14 px-3.5 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/30">
            <Zap className="h-4 w-4 text-white" fill="white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
                NeuroDesk
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5" role="navigation">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          const btn = (
            <button key={href} onClick={() => router.push(href)}
              aria-label={label} aria-current={active ? "page" : undefined}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                active
                  ? "bg-violet-600/15 text-violet-300 border border-violet-600/20"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              )}>
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-violet-400")} aria-hidden="true" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="whitespace-nowrap truncate">{label}</motion.span>
                )}
              </AnimatePresence>
            </button>
          )
          return sidebarOpen ? btn : (
            <Tooltip key={href} content={label} side="right">{btn}</Tooltip>
          )
        })}
      </nav>

      {/* Toggle */}
      <div className="px-2 pb-3">
        <button onClick={toggleSidebar} aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-2.5 py-2 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors text-sm">
          {sidebarOpen
            ? <><ChevronLeft className="h-4 w-4" /><span className="text-xs">Collapse</span></>
            : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  )
}
