# NeuroDesk — AI Productivity Dashboard

Production-grade SaaS frontend built with Next.js 14 App Router.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Login:** any email + any password (6+ chars)  
**Demo credentials:** `demo@neurodesk.ai` / `password123`

## 🛠 Tech Stack

- **Next.js 14** — App Router, Server Components
- **TypeScript** — strict mode
- **Tailwind CSS** — utility-first styling
- **Zustand** — UI state management
- **TanStack Query** — server state & caching
- **NextAuth.js** — authentication (JWT)
- **Framer Motion** — animations
- **React Hook Form + Zod** — form validation
- **React Markdown + Prism** — markdown & code highlighting

## 📁 Project Structure

```
/app               → Next.js App Router pages & layouts
/features          → Feature modules (chat, analytics, workspace, settings)
/components/ui     → Design system (Button, Input, Card, Modal, etc.)
/components/layout → Layout components (Sidebar, TopNav, Shell)
/store             → Zustand stores (ui, chat, workspace)
/lib               → Utilities, mock data, auth options
/types             → TypeScript type definitions
```

## ✨ Features

- 🔐 **Auth** — Login/signup with NextAuth, protected routes
- 💬 **AI Chat** — Streaming word-by-word, markdown, code highlighting
- 📊 **Analytics** — KPI cards, charts, activity feed
- 🏢 **Workspace** — Multi-workspace, member management
- ⚙️ **Settings** — Profile, theme toggle, preferences
- 🎨 **Design System** — Button, Input, Card, Modal, Badge, Tooltip, Skeleton, Dropdown

## 🚢 Deploy on Vercel

```bash
vercel deploy
```

Set environment variables:
- `NEXTAUTH_SECRET` — any long random string
- `NEXTAUTH_URL` — your production URL
