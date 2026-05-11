import remarkGfm from "remark-gfm"
import Markdown from "react-markdown"
import remarkEmoji from "remark-emoji"
import remarkBreaks from "remark-breaks"
import rehypeSanitize from "rehype-sanitize"
import rehypeExternalLinks from "rehype-external-links"
import { markdownComponents } from "./markdown-components"

interface AgentAssistantMessageProps {
  content: string
}

export function AgentAssistantMessage({ content }: AgentAssistantMessageProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-black dark:text-white print:text-black!">
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji]}
        rehypePlugins={[
          rehypeSanitize,
          [
            rehypeExternalLinks,
            {
              target: "_blank",
              rel: ["noopener", "noreferrer"],
            },
          ],
        ]}
        components={markdownComponents}
      >
        {content}
      </Markdown>
    </div>
  )
}
