import { Skeleton } from "@/components/ui/skeleton"

export function AdminSkeleton() {
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-3xl bg-transparent shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between gap-6 p-6">
              <div className="flex flex-col gap-2 justify-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="border border-border bg-transparent shadow-sm overflow-hidden last:rounded-b-2xl first:rounded-t-2xl"
          >
            <div className="flex px-4 py-6">
              <div className="w-full flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-[20%] rounded-full" />
                <Skeleton className="h-4 w-[8%] rounded-full" />
                <Skeleton className="h-4 w-[8%] rounded-full" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
