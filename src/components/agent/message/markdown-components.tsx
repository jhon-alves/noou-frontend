import { CodeBlock } from "./CodeBlock"
import type { Components } from "react-markdown"

export const markdownComponents: Components = {
  code({ children, className }) {
    const match = /language-(\w+)/.exec(className || "")

    if (match) {
      return <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />
    }

    return <code className="rounded-lg bg-muted px-1.5 py-0.5 text-sm">{children}</code>
  },
  blockquote({ children }) {
    return (
      <blockquote className="my-3 border-l-4 border-muted pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    )
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        className="text-brand-primary-200 font-medium underline hover:text-brand-primary-200/80"
      >
        {children}
      </a>
    )
  },
  hr() {
    return <hr className="my-6 border-t border-border/60" />
  },
  p({ children }) {
    return <p className="mb-3 leading-relaxed">{children}</p>
  },
  ul({ children }) {
    return <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
  },
  ol({ children }) {
    return <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
  },
  li({ children }) {
    return <li className="list-item leading-relaxed">{children}</li>
  },
  h1({ children }) {
    return <h1 className="mt-6 mb-3 text-xl font-semibold">{children}</h1>
  },
  h2({ children }) {
    return <h2 className="mt-5 mb-2 text-lg font-semibold">{children}</h2>
  },
  h3({ children }) {
    return (
      <h3 className="mt-5 mb-2 text-base font-semibold tracking-wide text-muted-foreground">
        {children}
      </h3>
    )
  },
  table({ children }) {
    return (
      <div className="my-3 overflow-x-auto">
        <table className="w-full border-collapse border border-border text-sm">{children}</table>
      </div>
    )
  },
  th({ children }) {
    return (
      <th className="border border-border bg-muted px-3 py-2 text-left font-medium">{children}</th>
    )
  },
  td({ children }) {
    return <td className="border border-border px-3 py-2">{children}</td>
  },
}
