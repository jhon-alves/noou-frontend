import { ReactNode } from "react"

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar px-6 md:px-8 pt-8 pb-12">
      <div className="flex flex-col gap-8">{children}</div>
    </div>
  )
}
