import { Skeleton } from "@/components/ui/skeleton"

export function AgentSkeleton() {
  return (
    <div className="h-full flex flex-col justify-between px-7 pt-2">
      <div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-15 rounded-xl" />
            <Skeleton className="h-3 w-15 rounded-xl" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-8 w-40 rounded-xl" />
          </div>
        </div>

        <div className="flex items-center justify-center flex-col gap-4 mt-8">
          <Skeleton className="size-18 rounded-full" />
          <Skeleton className="h-6 w-40 rounded-xl" />
          <div className="flex flex-col items-center justify-center gap-2">
            <Skeleton className="h-3 w-150 rounded-xl" />
            <Skeleton className="h-3 w-120 rounded-xl" />
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <Skeleton className="h-3 w-25 rounded-xl" />
            <Skeleton className="h-7 w-18 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3">
        <div className="w-full flex flex-col gap-10 px-3 pb-3 rounded-3xl border transition-colors bg-white dark:bg-[#2d2d38] border-[#e3e6ea] dark:border-[#2d2d38]">
          <Skeleton className="h-4 w-100 rounded-xl mt-5" />
          <div className="flex items-center justify-between">
            <Skeleton className="size-8 rounded-xl" />
            <Skeleton className="size-10 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-3 w-100 rounded-xl" />
      </div>
    </div>
  )
}
