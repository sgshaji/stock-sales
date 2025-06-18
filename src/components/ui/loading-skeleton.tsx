
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted/60", className)}
      {...props}
    />
  )
}

interface LoadingCardProps {
  count?: number
}

function LoadingCard({ count = 1 }: LoadingCardProps) {
  return (
    <div className="content-spacing-normal">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-border/40 bg-card/95 backdrop-blur-sm p-6 content-spacing-tight animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function LoadingGrid({ count = 4 }: LoadingCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-border/40 bg-card/95 backdrop-blur-sm p-4 content-spacing-tight animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-6 w-[120px] mt-3" />
          <Skeleton className="h-8 w-[80px] mt-2" />
        </div>
      ))}
    </div>
  )
}

function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/95 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border/40">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-9 w-[100px] rounded-lg" />
        </div>
      </div>
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="p-4 flex items-center justify-between animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Skeleton, LoadingCard, LoadingGrid, LoadingTable }
