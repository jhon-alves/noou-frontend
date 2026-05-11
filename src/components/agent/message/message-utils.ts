import { Message } from "@/pages/agent/types/agent-types"

export function shouldRenderMessage(message: Message, isStreaming: boolean) {
  if (
    !isStreaming &&
    !message.content &&
    (!message.tools || message.tools.length === 0) &&
    (!message.files || message.files.length === 0)
  ) {
    return false
  }

  return true
}

export function getFilePreviewUrl(file: {
  type: string
  previewUrl?: string | null
  contentBase64?: string | null
}) {
  return (
    file.previewUrl ??
    (file.contentBase64 ? `data:${file.type};base64,${file.contentBase64}` : null)
  )
}

export function downloadImage(previewUrl: string, filename = "image.png") {
  const link = document.createElement("a")
  link.href = previewUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
