import { X } from "lucide-react"
import { toast as sonnerToast } from "sonner"

type UseToastProps = {
  type: "success" | "warning" | "error" | "info"
  title: string
  description: string
}

export function toast({ type, title, description }: UseToastProps) {
  const variantClasses = {
    success: "bg-green-600!",
    warning: "bg-yellow-600!",
    error: "bg-red-500!",
    info: "bg-blue-600!",
  }

  const options = {
    description,
    action: (
      <button
        onClick={() => sonnerToast.dismiss()}
        className="absolute! top-3! right-3! inline-flex! size-5! items-center! justify-center! rounded-full! bg-transparent! border-0! shadow-none! text-white! hover:bg-white/10! transition-colors! cursor-pointer!"
        aria-label="Close button"
      >
        <X className="size-4 text-white" />
      </button>
    ),
    duration: 5000,
    className: `relative rounded-2xl! p-4! border-0! text-white! ${variantClasses[type]}`,
  }

  switch (type) {
    case "success":
      return sonnerToast.success(title, options)
    case "warning":
      return sonnerToast.warning(title, options)
    case "error":
      return sonnerToast.error(title, options)
    case "info":
      return sonnerToast.info(title, options)
  }
}
