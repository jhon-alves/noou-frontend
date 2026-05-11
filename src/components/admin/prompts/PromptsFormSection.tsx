import { ReactNode } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminFormSectionProps {
  index: number
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export function PromptsFormSection({
  index,
  title,
  description,
  open,
  onOpenChange,
  children,
}: AdminFormSectionProps) {
  const ChevronIcon = open ? ChevronDown : ChevronRight

  return (
    <section className="rounded-2xl border border-border bg-background/40">
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors",
          "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
        )}
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-6 shrink-0 items-center justify-center border-[1.5px] border-black dark:border-white rounded-full">
            <span className="absolute text-[10px] font-semibold text-black dark:text-white">
              {index}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className={cn("text-sm font-semibold text-neutral-500 dark:text-neutral-100")}>
              {title}
            </h3>

            {description && (
              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>

        <ChevronIcon className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && <div className="border-t border-border px-4 py-5">{children}</div>}
    </section>
  )
}
