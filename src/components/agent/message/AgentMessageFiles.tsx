import { downloadImage, getFilePreviewUrl } from "./message-utils"
import { Download, FileText } from "lucide-react"
import { Message } from "@/pages/agent/types/agent-types"
import { cn } from "@/lib/utils"

interface AgentMessageFilesProps {
  files?: Message["files"]
  role: Message["role"]
}

export function AgentMessageFiles({ files, role }: AgentMessageFilesProps) {
  if (!files?.length) return null

  const hasNonImageFile = files.some((file) => !file.type.startsWith("image/"))
  const isAssistant = role === "assistant"

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {files.map((file) => {
        const isImage = file.type.startsWith("image/")
        const previewUrl = getFilePreviewUrl(file)

        return isImage ? (
          <div
            key={file.id}
            className={cn(
              "group relative overflow-hidden rounded-lg border bg-muted",
              isAssistant ? "h-80 w-80" : hasNonImageFile ? "h-14 w-14" : "h-20 w-20",
            )}
          >
            {previewUrl && (
              <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
            )}

            {isAssistant && previewUrl && (
              <button
                onClick={() => downloadImage(previewUrl, file.id || "image.png")}
                className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                title="Download image"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            key={file.id}
            className="flex max-w-60 items-center gap-3 rounded-xl bg-muted px-3 py-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-violet-500/40">
              <FileText className="h-5 w-5 text-white" />
            </div>

            <div className="flex min-w-0 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-black dark:text-white">
                {file.name}
              </span>
              <span className="text-xs uppercase text-muted-foreground">
                {file.type.split("/").pop()}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
