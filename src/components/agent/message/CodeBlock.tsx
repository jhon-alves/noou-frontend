import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeBlockProps {
  language: string
  value: string
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative my-4 rounded-lg overflow-hidden bg-[#0f172a] border border-border">
      <div className="flex items-center justify-between px-3 py-2 text-xs bg-[#020617] text-gray-300">
        <span className="uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition cursor-pointer"
        >
          {copied ? t("common.copied") : t("common.copy")}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter language={language} style={oneDark} PreTag="div" className="m-0! text-sm">
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
