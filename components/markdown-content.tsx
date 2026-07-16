'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div
      className={`rounded-xl border border-border/50 bg-surface-2 p-6 md:p-8 space-y-6 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-foreground border-b border-border/40 pb-3 mb-4 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-foreground mt-6 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-muted-foreground mb-3 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="rounded-xl border border-primary/20 bg-primary/5 p-5 my-4 not-italic">
              <div className="font-mono text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Concepto Clave
              </div>
              <div className="text-xs text-foreground/80 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
                {children}
              </div>
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-primary">
              {children}
            </code>
          ),
          hr: () => <hr className="border-border/40 my-6" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
