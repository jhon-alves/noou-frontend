import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "../ui/card"

export function SecretSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card
          key={i}
          className="flex justify-between border border-border bg-transparent p-6 rounded-xl"
        >
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-25" />
            <Skeleton className="h-5.5 w-50" />
          </div>
          <Skeleton className="size-6 rounded-full" />
        </Card>
      ))}
    </div>
  )
}
