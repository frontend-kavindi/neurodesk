"use client"
import { useEffect, useRef, useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, RefreshCw, Copy, Check, Trash2, Bot, User, Sparkles } from "lucide-react"
import { useChatStore } from "@/store/chat-store"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "./markdown-renderer"
import { cn, formatTimestamp } from "@/lib/utils"
import type { Message } from "@/types"

const MessageBubble = memo(({ message }: { message: Message }) => {
  const isUser = message.role === "user"
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [message.content])

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      className={cn("flex gap-3 group", isUser && "flex-row-reverse")}>
      <div className={cn("h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
        isUser ? "bg-violet-600" : "bg-zinc-800 border border-white/10")}>
        {isUser ? <User className="h-3.5 w-3.5 text-white" /> : <Bot className="h-3.5 w-3.5 text-violet-400" />}
      </div>

      <div className={cn("flex flex-col gap-1 max-w-[75%]", isUser && "items-end")}>
        <div className={cn("rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-violet-600 text-white rounded-tr-sm"
            : "bg-zinc-900 border border-white/8 text-zinc-200 rounded-tl-sm"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-zinc-600">{formatTimestamp(message.timestamp)}</span>
          {!isUser && (
            <button onClick={handleCopy} aria-label="Copy message"
              className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1">
              {copied
                ? <><Check className="h-3 w-3 text-emerald-400" /><span>Copied</span></>
                : <><Copy className="h-3 w-3" /><span>Copy</span></>}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
})
MessageBubble.displayName = "MessageBubble"

export function ChatInterface() {
  const { messages, isTyping, streamingContent, isStreaming, sendMessage, clearChat, regenerateLastResponse } = useChatStore()
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent, isTyping])

  const handleSend = useCallback(async () => {
    const content = input.trim()
    if (!content || isSending) return
    setInput("")
    setIsSending(true)
    try {
      await sendMessage(content)
    } finally {
      setIsSending(false)
    }
  }, [input, isSending, sendMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5" aria-live="polite" aria-label="Chat messages">
        <AnimatePresence>
          {!hasMessages && !isStreaming && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-4 text-center pt-20">
              <div className="h-14 w-14 rounded-2xl bg-violet-600/15 border border-violet-600/20 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-100 mb-1">Start a conversation</h2>
                <p className="text-sm text-zinc-500 max-w-xs">Ask me anything about code, architecture, or product development.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {["Explain React Server Components", "Write a Zustand store", "API route with Zod validation"].map(s => (
                  <button key={s} onClick={() => { setInput(s); textareaRef.current?.focus() }}
                    className="px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/8 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}

        {isStreaming && streamingContent && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <div className="h-7 w-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div className="bg-zinc-900 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%] text-sm text-zinc-200">
              <MarkdownRenderer content={streamingContent} />
              <span className="inline-block h-4 w-0.5 bg-violet-400 animate-pulse ml-0.5" aria-hidden="true" />
            </div>
          </motion.div>
        )}

        {isTyping && !isStreaming && (
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div className="bg-zinc-900 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5" aria-label="AI is thinking">
              {[0, 1, 2].map(i => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} aria-hidden="true" />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/6 p-4">
        {hasMessages && (
          <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" size="sm" onClick={regenerateLastResponse} disabled={isTyping || isStreaming}
              aria-label="Regenerate last response">
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
            <Button variant="ghost" size="sm" onClick={clearChat} aria-label="Clear chat">
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown} placeholder="Ask anything... (⏎ to send, ⇧⏎ for newline)"
              aria-label="Chat input" rows={1}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all max-h-40 overflow-y-auto"
              style={{ minHeight: "40px" }}
            />
          </div>
          <Button onClick={handleSend} disabled={!input.trim() || isTyping || isStreaming}
            aria-label="Send message" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-zinc-600 mt-2 text-center">NeuroDesk AI may produce inaccurate information. Verify important details.</p>
      </div>
    </div>
  )
}
