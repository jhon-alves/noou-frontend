import { ChevronLeft, RefreshCw } from "lucide-react"
import { JSX, PropsWithChildren, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { Button } from "../ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

interface BreadcrumbData {
  label: string
  href?: string
}

interface PageHeaderProps extends PropsWithChildren {
  title?: string
  titleComponent?: JSX.Element
  subtitle?: string
  breadcrumbs?: BreadcrumbData[]
  hasRefresh?: boolean
}

export function PageHeader({
  title,
  titleComponent,
  subtitle,
  breadcrumbs = [],
  hasRefresh = true,
  children,
}: PageHeaderProps) {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [spinning, setSpinning] = useState(false)

  const handleRefreshData = () => {
    setSpinning(true)
    qc.invalidateQueries()
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <div className="space-y-4">
      {breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1

              return (
                <BreadcrumbItem key={index}>
                  {item.href && !isLast ? (
                    <BreadcrumbLink onClick={() => navigate(item.href!)} className="cursor-pointer">
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}

                  {!isLast && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex items-center gap-4">
        <button
          className="size-10 rounded-full flex items-center justify-center bg-[#f5f5f5] dark:bg-[#262f45] hover:bg-[#ebebed] dark:hover:bg-[#3d3d48] transition-colors cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="text-[#111827] dark:text-white" />
        </button>
        {title && <h1 className="text-2xl text-[#111827] dark:text-white">{title}</h1>}
        {titleComponent && titleComponent}
      </div>

      {subtitle && (
        <div className="flex items-center justify-between lg:h-12">
          <p className="text-[#666f8d] dark:text-[#9ca3af]">{subtitle}</p>
          <div className="flex items-center gap-3">
            {hasRefresh && (
              <Button onClick={handleRefreshData} disabled={spinning}>
                <RefreshCw
                  className={cn("size-5 text-white dark:text-black", spinning ? "spin-once" : "")}
                />
              </Button>
            )}
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
