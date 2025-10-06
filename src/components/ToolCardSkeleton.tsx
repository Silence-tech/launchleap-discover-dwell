import { Skeleton } from "@/components/ui/skeleton"

export function ToolCardSkeleton() {
  return (
    <div className="group relative bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-4 sm:p-6 shadow-glass">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
            
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 sm:h-5 w-3/4" />
              <Skeleton className="h-3 sm:h-4 w-1/2" />
            </div>
          </div>

          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex-shrink-0" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-3 sm:mb-4">
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 sm:h-4 w-4/5" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Skeleton className="h-8 sm:h-9 flex-1" />
          <Skeleton className="h-8 sm:h-9 w-24 sm:w-32" />
        </div>
      </div>
    </div>
  )
}
