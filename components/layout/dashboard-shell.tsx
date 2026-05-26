"use client"
import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { TopNav } from "./topnav"

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}
