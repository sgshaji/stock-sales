
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

interface LoadingCardProps {
  count?: number
}

function LoadingCard({ count = 1 }: LoadingCardProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-6 space-y-3">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      ))}
    </div>
  )
}

function LoadingGrid({ count = 4 }: LoadingCardProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-4 space-y-3">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-8 w-[60px]" />
        </div>
      ))}
    </div>
  )
}

export { Skeleton, LoadingCard, LoadingGrid }
