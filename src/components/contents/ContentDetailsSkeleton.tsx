import { Skeleton } from "@/components/ui/skeleton"
import { PageWrapper } from "../shared/PageWrapper"

export function ContentDetailsSkeleton() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-15 rounded-xl" />
          <Skeleton className="h-3 w-15 rounded-xl" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="h-9 w-40 rounded-xl" />
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 md:px-10 space-y-8 pb-8 pt-0">
        <Skeleton className="aspect-video rounded-xl" />

        <Skeleton className="h-10 w-80 rounded-xl" />

        <div className="flex items-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>

        <Skeleton className="h-4 w-30 rounded-xl" />

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full rounded-xl" />
          <Skeleton className="h-4 w-full rounded-xl" />
          <Skeleton className="h-4 w-full rounded-xl" />
        </div>

        <div className="pt-6 border-t border-[#e5e7eb] dark:border-[#374151]">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20 rounded-xl" />
              <Skeleton className="h-4 w-30 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
