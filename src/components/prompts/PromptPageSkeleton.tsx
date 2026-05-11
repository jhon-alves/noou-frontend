import { Skeleton } from "@/components/ui/skeleton"
import { PageWrapper } from "../shared/PageWrapper"

export function PromptPageSkeleton() {
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

      <div className="flex flex-col gap-4">
        <Skeleton className="h-7 w-40 rounded-xl" />
      </div>
      <div className="flex items-center gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-3xl bg-transparent shadow-sm overflow-hidden"
          >
            <Skeleton className="h-34.5 w-full" />

            <div className="flex flex-col gap-6 p-6">
              <div className="flex flex-col gap-2 justify-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-14 rounded-full" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
