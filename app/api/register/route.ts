import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

// Mock in-memory user store
const users: { id: string; name: string; email: string }[] = []

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    if (users.find(u => u.email === data.email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const user = { id: Math.random().toString(36).slice(2), name: data.name, email: data.email }
    users.push(user)

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
