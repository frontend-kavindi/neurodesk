import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { MOCK_ANALYTICS } from "@/lib/mock-data"
import { formatNumber, calculateGrowth } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, BarChart3, Building2, Zap, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const a = MOCK_ANALYTICS
  const userGrowth = calculateGrowth(a.users.previous, a.users.current)
  const revenueGrowth = calculateGrowth(a.revenue.previous, a.revenue.current)

  const quickStats = [
    { label: "Total Users", value: formatNumber(a.users.current), growth: userGrowth, color: "text-blue-400" },
    { label: "Revenue", value: `$${formatNumber(a.revenue.current)}`, growth: revenueGrowth, color: "text-emerald-400" },
    { label: "API Calls", value: formatNumber(a.usage.current), growth: 18, color: "text-amber-400" },
    { label: "Growth Score", value: `${a.growth.current}`, growth: 24, color: "text-violet-400" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-100">
          Good morning, {session?.user?.name ?? "there"} 👋
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">Here&apos;s what&apos;s happening with your workspace today.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map(({ label, value, growth, color }) => (
          <Card key={label} className="p-4 hover:border-white/15 transition-colors">
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-xs text-emerald-500">+{growth}%</span>
              <span className="text-xs text-zinc-600">vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/dashboard/chat", icon: MessageSquare, label: "Start AI Chat", desc: "Chat with NeuroDesk AI", color: "bg-violet-600/15 border-violet-600/20 hover:bg-violet-600/20" },
            { href: "/dashboard/analytics", icon: BarChart3, label: "View Analytics", desc: "Check your metrics", color: "bg-blue-600/15 border-blue-600/20 hover:bg-blue-600/20" },
            { href: "/dashboard/workspace", icon: Building2, label: "Manage Team", desc: "Invite and manage members", color: "bg-emerald-600/15 border-emerald-600/20 hover:bg-emerald-600/20" },
          ].map(({ href, icon: Icon, label, desc, color }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${color}`}>
              <div className="h-9 w-9 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                <Icon className="h-4.5 w-4.5 text-zinc-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200">{label}</p>
                <p className="text-xs text-zinc-500 truncate">{desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Feature highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Features</CardTitle>
          <Badge variant="success">All systems operational</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "AI Models", value: "GPT-4o", status: "Live" },
              { label: "Response time", value: "~1.2s", status: "Fast" },
              { label: "Uptime", value: "99.98%", status: "Stable" },
              { label: "Requests today", value: formatNumber(12840), status: "Normal" },
            ].map(({ label, value, status }) => (
              <div key={label} className="text-center p-3 rounded-lg bg-white/3">
                <p className="text-xs text-zinc-500 mb-1">{label}</p>
                <p className="text-sm font-semibold text-zinc-200">{value}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-zinc-500">{status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Powered by */}
      <div className="flex items-center justify-center gap-2 py-2">
        <Zap className="h-3.5 w-3.5 text-violet-500" />
        <p className="text-xs text-zinc-600">Powered by NeuroDesk AI Engine v2.1</p>
      </div>
    </div>
  )
}
