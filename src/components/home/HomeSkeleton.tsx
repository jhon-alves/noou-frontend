import { Skeleton } from "@/components/ui/skeleton"

export function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40 rounded-xl" />
        <Skeleton className="h-6 w-20 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
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
              <Skeleton className="h-4 w-30 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
