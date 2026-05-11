import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "../ui/card"

export function IntegrationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-9 w-1/3" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4 border-b pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-1/5" />
            <Skeleton className="h-7 w-15 rounded-full" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-1/5" />
            <Skeleton className="h-7 w-15 rounded-full" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-1/5" />
            <Skeleton className="h-7 w-15 rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-1/5" />
          <Skeleton className="h-7 w-15 rounded-full" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-1/5" />
          <Skeleton className="h-7 w-15 rounded-full" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-9 w-25 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}
