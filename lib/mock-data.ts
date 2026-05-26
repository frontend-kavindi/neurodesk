import type { AnalyticsData, Workspace, User } from "@/types"

export const MOCK_USERS: User[] = [
  { id: "1", name: "Alex Chen", email: "alex@neurodesk.ai", role: "owner" },
  { id: "2", name: "Priya Sharma", email: "priya@neurodesk.ai", role: "admin" },
  { id: "3", name: "Jordan Lee", email: "jordan@neurodesk.ai", role: "member" },
]

export const MOCK_WORKSPACES: Workspace[] = [
  { id: "ws-1", name: "Engineering", slug: "engineering", members: MOCK_USERS, createdAt: "2024-01-01" },
  { id: "ws-2", name: "Design", slug: "design", members: [MOCK_USERS[0], MOCK_USERS[1]], createdAt: "2024-02-01" },
  { id: "ws-3", name: "Marketing", slug: "marketing", members: [MOCK_USERS[0]], createdAt: "2024-03-01" },
]

export const MOCK_ANALYTICS: AnalyticsData = {
  users: { current: 12480, previous: 10200 },
  revenue: { current: 48320, previous: 39100 },
  usage: { current: 284500, previous: 241000 },
  growth: { current: 94, previous: 76 },
  chartData: [
    { label: "Jan", value: 4200 },
    { label: "Feb", value: 5800 },
    { label: "Mar", value: 5200 },
    { label: "Apr", value: 7100 },
    { label: "May", value: 6800 },
    { label: "Jun", value: 8400 },
    { label: "Jul", value: 9200 },
    { label: "Aug", value: 8800 },
    { label: "Sep", value: 10400 },
    { label: "Oct", value: 11200 },
    { label: "Nov", value: 10800 },
    { label: "Dec", value: 12480 },
  ],
}

export const AI_RESPONSES = [
  `## Great question!

Here's a breakdown of how **React Server Components** work:

\`\`\`tsx
// Server Component — runs on server, no client JS
async function UserProfile({ id }: { id: string }) {
  const user = await fetchUser(id) // Direct DB access!
  return <div>{user.name}</div>
}
\`\`\`

Key benefits:
- **Zero bundle size** — no JS shipped to browser
- **Direct data access** — query DB without API layer
- **Better performance** — HTML streamed from server`,

  `Sure! Here's a **Zustand store** pattern for production apps:

\`\`\`typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'app-store' }
  )
)
\`\`\`

This pattern gives you **persistence** across sessions automatically.`,

  `Here's a production-ready **API route** with full error handling:

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(1).max(1000),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    // process data...
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
\`\`\``,

  `## Performance Optimization Checklist

1. **Memoize expensive computations** with \`useMemo\`
2. **Prevent re-renders** with \`React.memo\` and \`useCallback\`  
3. **Code split** routes with \`dynamic()\`
4. **Virtualize lists** with \`@tanstack/react-virtual\`
5. **Optimize images** with \`next/image\`

The biggest wins usually come from **eliminating unnecessary re-renders** first. Profile with React DevTools to find the bottlenecks before optimizing.`,

  `I can help you design that system! Here's a high-level architecture:

**Frontend**: Next.js 14 App Router
- Server Components for data fetching  
- Client Components for interactivity
- Streaming UI for perceived performance

**State Management**:
- Zustand for UI state (modals, sidebar, theme)
- TanStack Query for server state (caching, refetching)
- NextAuth for auth state

**Database layer**: Use an ORM like Prisma with connection pooling for production scale.

Would you like me to dive deeper into any specific layer?`,
]
