import { useTranslation } from "react-i18next"
import { KeyboardEvent, useRef, useState, useLayoutEffect } from "react"
import { ArrowUp, FileText, Paperclip, Square, X } from "lucide-react"
import { getFileTypeLabel } from "@/utils/getFileTypeLabel"
import { useAgentStore } from "@/stores/useAgentStore"
import { ChatFileDropzone } from "./ChatFileDropzone"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface InputBarProps {
  disabled?: boolean
  isStreaming?: boolean
  onSend: (message: string, files?: File[]) => void
  onStop?: () => void
}

export function InputBar({ disabled, isStreaming, onSend, onStop }: InputBarProps) {
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { message, setMessage } = useAgentStore()
  const [files, setFiles] = useState<File[]>([])

  const maxHeight = 190

  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return

    el.style.height = "auto"

    const nextHeight = Math.min(el.scrollHeight, maxHeight)
    el.style.height = `${nextHeight}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [textareaRef, message, maxHeight])

  const handleSend = () => {
    if ((!message.trim() && files.length === 0) || disabled) return

    onSend(message.trim(), files)
    setMessage("")
    setFiles([])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <ChatFileDropzone
      disabled={disabled}
      onFilesSelected={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
    >
      {({ open }) => (
        <div
          className="flex flex-col gap-3 p-2 rounded-3xl border transition-colors bg-white dark:bg-[#2d2d38] border-[#e3e6ea] dark:border-[#2d2d38]"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* File Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2">
              {files.map((file, index) => {
                const isImage = file.type.startsWith("image/")
                const hasNonImageFile = files.some((file) => !file.type.startsWith("image/"))
                const previewUrl = isImage ? URL.createObjectURL(file) : null

                return isImage ? (
                  <div
                    key={index}
                    className={cn(
                      "relative rounded-lg overflow-hidden border bg-muted",
                      hasNonImageFile ? "w-14 h-14" : "w-20 h-20",
                    )}
                  >
                    <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        removeFile(index)
                      }}
                      className={cn(
                        "absolute top-1 right-1 rounded-full w-5 h-5 flex items-center justify-center",
                        "bg-gray-400/70 text-white border border-white cursor-pointer",
                      )}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="relative flex items-center gap-3 px-3 py-2 rounded-xl bg-muted max-w-60"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-500/40 shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex min-w-0 flex-col overflow-hidden">
                      <span className="truncate text-sm font-medium text-black dark:text-white">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {getFileTypeLabel(file)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        removeFile(index)
                      }}
                      className={cn(
                        "absolute top-1 right-1 rounded-full w-5 h-5 flex items-center justify-center",
                        "bg-gray-400/70 text-white border border-white cursor-pointer",
                      )}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("agent.input-placeholder")}
            disabled={disabled}
            rows={1}
            className={cn(
              "min-h-14 w-full  bg-transparent resize-none overflow-hidden outline-none text-sm p-2 text-gray-900 dark:text-[#E5E5E5]",
              "dark:placeholder:text-[#808080]  placeholder:text-gray-400 scrollbar",
            )}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="p-2!"
                onClick={open}
                aria-label="Anexar arquivo"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>

            {isStreaming ? (
              <Button
                variant="primary"
                className="p-2! size-10"
                aria-label="Stop generation"
                onClick={onStop}
              >
                <Square className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={disabled || !message.trim()}
                className="p-2! size-10"
                aria-label="Send message"
                onClick={handleSend}
              >
                <ArrowUp className="size-5 shrink-0" />
              </Button>
            )}
          </div>
        </div>
      )}
    </ChatFileDropzone>
  )
}
