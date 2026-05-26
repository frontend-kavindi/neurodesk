import { create } from "zustand"
import { generateId } from "@/lib/utils"
import { AI_RESPONSES } from "@/lib/mock-data"
import type { Message } from "@/types"

interface ChatState {
  messages: Message[]
  isTyping: boolean
  streamingContent: string
  isStreaming: boolean
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  setTyping: (val: boolean) => void
  regenerateLastResponse: () => Promise<void>
}

async function simulateAIResponse(prompt: string): Promise<string> {
  const idx = Math.floor(Math.random() * AI_RESPONSES.length)
  return AI_RESPONSES[idx]
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  streamingContent: "",
  isStreaming: false,

  setTyping: (val) => set({ isTyping: val }),

  sendMessage: async (content: string) => {
    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }
    set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }))

    const delay = 500 + Math.random() * 700
    await new Promise((r) => setTimeout(r, delay))

    const response = await simulateAIResponse(content)
    set({ isTyping: false, isStreaming: true, streamingContent: "" })

    // Stream word by word
    const words = response.split(" ")
    let accumulated = ""
    for (let i = 0; i < words.length; i++) {
      accumulated += (i === 0 ? "" : " ") + words[i]
      set({ streamingContent: accumulated })
      await new Promise((r) => setTimeout(r, 18 + Math.random() * 25))
    }

    const aiMsg: Message = {
      id: generateId(),
      role: "assistant",
      content: accumulated,
      timestamp: new Date().toISOString(),
    }
    set((s) => ({
      messages: [...s.messages, aiMsg],
      isStreaming: false,
      streamingContent: "",
    }))
  },

  regenerateLastResponse: async () => {
    const { messages, sendMessage } = get()
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
    if (!lastUserMsg) return
    // Remove last assistant message
    set((s) => ({
      messages: s.messages.filter((m, i, arr) => !(m.role === "assistant" && i === arr.length - 1)),
    }))
    await sendMessage(lastUserMsg.content)
  },

  clearChat: () => set({ messages: [], isTyping: false, streamingContent: "", isStreaming: false }),
}))
