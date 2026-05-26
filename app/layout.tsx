import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "NeuroDesk — AI Productivity Dashboard",
  description: "Production-grade AI productivity platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
