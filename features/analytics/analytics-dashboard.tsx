"use client"
import { memo } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Zap } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { MOCK_ANALYTICS } from "@/lib/mock-data"
import { formatNumber, calculateGrowth } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

async function getAnalyticsData() {
  await new Promise(r => setTimeout(r, 800))
  return MOCK_ANALYTICS
}

const KPICard = memo(({ label, current, previous, icon: Icon, prefix = "", color }: {
  label: string; current: number; previous: number; icon: React.ElementType; prefix?: string; color: string
}) => {
  const growth = calculateGrowth(previous, current)
  const isPositive = growth >= 0
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-5 hover:border-white/15 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className={`h-9 w-9 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <Badge variant={isPositive ? "success" : "danger"}>
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(growth)}%
          </Badge>
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">{prefix}{formatNumber(current)}</p>
        <p className="text-xs text-zinc-500 mt-1">{label}</p>
        <p className="text-xs text-zinc-600 mt-0.5">vs. {prefix}{formatNumber(previous)} last period</p>
      </Card>
    </motion.div>
  )
})
KPICard.displayName = "KPICard"

const MiniChart = memo(({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value))
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => (
        <motion.div key={d.label} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
          style={{ originY: 1 }}
          className="flex-1 flex flex-col items-center gap-1 group" title={`${d.label}: ${formatNumber(d.value)}`}>
          <div className="w-full rounded-sm bg-violet-600/30 group-hover:bg-violet-600/60 transition-colors"
            style={{ height: `${(d.value / max) * 64}px` }} role="img" aria-label={`${d.label}: ${d.value}`} />
        </motion.div>
      ))}
    </div>
  )
})
MiniChart.displayName = "MiniChart"

const KPISkeleton = () => (
  <Card className="p-5">
    <Skeleton className="h-9 w-9 rounded-lg mb-4" />
    <Skeleton className="h-7 w-24 mb-1.5" />
    <Skeleton className="h-3 w-20 mb-1" />
    <Skeleton className="h-3 w-32" />
  </Card>
)

export function AnalyticsDashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ["analytics"], queryFn: getAnalyticsData })

  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-400 mb-3">Failed to load analytics</p>
      <button onClick={() => window.location.reload()} className="text-sm text-violet-400 hover:underline">Retry</button>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-zinc-100">Overview</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Last 30 days performance metrics</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <KPISkeleton key={i} />)
        ) : data ? (
          <>
            <KPICard label="Total Users" current={data.users.current} previous={data.users.previous} icon={Users} color="bg-blue-500/15 text-blue-400" />
            <KPICard label="Revenue" current={data.revenue.current} previous={data.revenue.previous} icon={DollarSign} prefix="$" color="bg-emerald-500/15 text-emerald-400" />
            <KPICard label="API Usage" current={data.usage.current} previous={data.usage.previous} icon={Activity} color="bg-amber-500/15 text-amber-400" />
            <KPICard label="Growth Score" current={data.growth.current} previous={data.growth.previous} icon={Zap} color="bg-violet-500/15 text-violet-400" />
          </>
        ) : null}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-20" /> : data && <MiniChart data={data.chartData.map(d => ({ label: d.label, value: d.value * 4 }))} />}
            <div className="flex gap-1 mt-2 overflow-x-auto">
              {data?.chartData.map(d => <span key={d.label} className="text-[10px] text-zinc-600 flex-1 text-center">{d.label}</span>)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>User Growth</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-20" /> : data && <MiniChart data={data.chartData} />}
            <div className="flex gap-1 mt-2 overflow-x-auto">
              {data?.chartData.map(d => <span key={d.label} className="text-[10px] text-zinc-600 flex-1 text-center">{d.label}</span>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3"><Skeleton className="h-8 w-8 rounded-full" /><div className="flex-1 space-y-1.5"><Skeleton className="h-3 w-48" /><Skeleton className="h-3 w-24" /></div></div>
            )) : (
              [
                { action: "New user signup", detail: "alex@company.com joined Engineering workspace", time: "2m ago", badge: "success" as const },
                { action: "API limit reached", detail: "Workspace 'Marketing' hit 100K request limit", time: "18m ago", badge: "warning" as const },
                { action: "Payment processed", detail: "$299 received from Acme Corp", time: "1h ago", badge: "success" as const },
                { action: "Model fine-tuned", detail: "Custom model v2.1 deployment complete", time: "3h ago", badge: "info" as const },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="h-2 w-2 rounded-full bg-violet-500 mt-1.5 shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200">{item.action}</p>
                    <p className="text-xs text-zinc-500 truncate">{item.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={item.badge} className="hidden sm:flex">{item.badge}</Badge>
                    <span className="text-xs text-zinc-600">{item.time}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
