import { cn } from "@/lib/utils"

export function FormContent({ className, children }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>
}
