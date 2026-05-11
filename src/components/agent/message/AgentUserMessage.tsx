import { useLayoutEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserMessageContentProps {
  content: string
}

export function AgentUserMessage({ content }: UserMessageContentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showToggle, setShowToggle] = useState(false)
  const textRef = useRef<HTMLParagraphElement | null>(null)

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return

    const checkOverflow = () => {
      if (!el) return
      setShowToggle(el.scrollHeight > el.clientHeight + 1)
    }

    if (!isExpanded) {
      checkOverflow()

      const resizeObserver = new ResizeObserver(() => {
        checkOverflow()
      })

      resizeObserver.observe(el)
      window.addEventListener("resize", checkOverflow)

      return () => {
        resizeObserver.disconnect()
        window.removeEventListener("resize", checkOverflow)
      }
    }
  }, [content, isExpanded])

  return (
    <div className="flex gap-5">
      <p
        ref={textRef}
        className={cn(
          "min-w-0 flex-1 text-sm leading-relaxed text-black dark:text-white print:text-black!",
          isExpanded ? "whitespace-pre-wrap" : "whitespace-normal line-clamp-5",
        )}
      >
        {isExpanded ? content : content.replace(/\s*\n+\s*/g, " ")}
      </p>

      {showToggle && (
        <div className="shrink-0">
          <button
            type="button"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-black/20"
            onClick={(e) => {
              e.preventDefault()
              setIsExpanded((prev) => !prev)
            }}
          >
            {isExpanded ? (
              <ChevronUp className="size-5 text-black dark:text-white" />
            ) : (
              <ChevronDown className="size-5 text-black dark:text-white" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
