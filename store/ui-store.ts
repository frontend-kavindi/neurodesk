import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ThemeMode, UserPreferences } from "@/types"

interface UIState {
  sidebarOpen: boolean
  activeRoute: string
  theme: ThemeMode
  preferences: UserPreferences
  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
  setActiveRoute: (r: string) => void
  toggleTheme: (mode: ThemeMode) => void
  updatePreferences: (p: Partial<UserPreferences>) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activeRoute: "/dashboard",
      theme: "dark",
      preferences: {
        theme: "dark",
        notifications: true,
        compactMode: false,
        language: "en",
      },
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      setActiveRoute: (r) => set({ activeRoute: r }),
      toggleTheme: (mode) =>
        set((s) => ({
          theme: mode,
          preferences: { ...s.preferences, theme: mode },
        })),
      updatePreferences: (p) =>
        set((s) => ({ preferences: { ...s.preferences, ...p } })),
    }),
    { name: "neurodesk-ui" }
  )
)
