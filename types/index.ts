export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "member"
}

export type Workspace = {
  id: string
  name: string
  slug: string
  members: User[]
  createdAt: string
}

export type AnalyticsData = {
  users: { current: number; previous: number }
  revenue: { current: number; previous: number }
  usage: { current: number; previous: number }
  growth: { current: number; previous: number }
  chartData: { label: string; value: number }[]
}

export type ThemeMode = "light" | "dark" | "system"

export type UserPreferences = {
  theme: ThemeMode
  notifications: boolean
  compactMode: boolean
  language: string
}
