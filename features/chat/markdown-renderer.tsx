"use client"
import { memo, useState, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import type { Components } from "react-markdown"

const CopyCodeButton = memo(({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])
  return (
    <button onClick={handleCopy} aria-label="Copy code" title="Copy"
      className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-700/60 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200 transition-colors opacity-0 group-hover:opacity-100">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
})
CopyCodeButton.displayName = "CopyCodeButton"

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "")
    const isBlock = !!match
    if (!isBlock) {
      return (
        <code className="bg-zinc-800 rounded px-1.5 py-0.5 text-violet-300 text-xs font-mono" {...props}>
          {children}
        </code>
      )
    }
    return (
      <div className="relative group/code my-2">
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: "8px", fontSize: "12px", background: "#18181b", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
        <CopyCodeButton text={String(children)} />
      </div>
    )
  },
  p({ children }) {
    return <p className="my-1 leading-relaxed">{children}</p>
  },
  h1({ children }) { return <h1 className="text-lg font-bold text-zinc-100 my-2">{children}</h1> },
  h2({ children }) { return <h2 className="text-base font-bold text-zinc-100 my-2">{children}</h2> },
  h3({ children }) { return <h3 className="text-sm font-semibold text-zinc-200 my-1.5">{children}</h3> },
  ul({ children }) { return <ul className="list-disc list-inside my-1 space-y-0.5 text-zinc-300">{children}</ul> },
  ol({ children }) { return <ol className="list-decimal list-inside my-1 space-y-0.5 text-zinc-300">{children}</ol> },
  li({ children }) { return <li className="text-sm">{children}</li> },
  strong({ children }) { return <strong className="font-semibold text-zinc-100">{children}</strong> },
  blockquote({ children }) {
    return <blockquote className="border-l-2 border-violet-500 pl-3 my-2 text-zinc-400 italic">{children}</blockquote>
  },
}

export const MarkdownRenderer = memo(({ content }: { content: string }) => (
  <ReactMarkdown components={markdownComponents}>
    {content}
  </ReactMarkdown>
))
MarkdownRenderer.displayName = "MarkdownRenderer"
