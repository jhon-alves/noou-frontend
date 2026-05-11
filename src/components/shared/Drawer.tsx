import * as React from "react"
import { Drawer, DrawerContent } from "../ui/drawer"
import { cn } from "@/lib/utils"

interface DrawerLayoutProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function DrawerLayout({
  open,
  onOpenChange,
  children,
  className,
  contentClassName,
}: DrawerLayoutProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className={cn("h-full lg:min-w-175 py-4 pr-5", contentClassName)}>
        <div
          data-vaul-no-drag
          className={cn(
            "flex flex-col h-full rounded-3xl bg-foreground overflow-hidden",
            className,
          )}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function DrawerBody({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto p-6 space-y-6", className)}>{children}</div>
}
