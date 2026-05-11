import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface ChatFileDropzoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  children: (helpers: { open: () => void }) => React.ReactNode
}

export function ChatFileDropzone({ onFilesSelected, disabled, children }: ChatFileDropzoneProps) {
  const { t } = useTranslation()
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    disabled,
    noClick: true,
    noKeyboard: true,
    multiple: true,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "text/*": [],
    },
    onDrop: onFilesSelected,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative rounded-3xl transition-colors",
        isDragActive && "ring-2 ring-violet-500 bg-violet-500/5",
      )}
    >
      <input {...getInputProps()} />

      {isDragActive && (
        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center rounded-3xl text-sm font-medium",
            "bg-violet-500/10 backdrop-blur-sm text-violet-700 dark:text-violet-300",
          )}
        >
          {t("agent.drop-files-to-attach")}
        </div>
      )}

      {children({ open })}
    </div>
  )
}
