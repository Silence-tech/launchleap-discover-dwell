import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-20 animate-fade-in">
      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-glass/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-float">
        <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-glass-foreground/40" />
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold text-glass-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-glass-foreground/60 mb-6 sm:mb-8 max-w-md mx-auto px-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          onClick={onAction}
          className="min-w-[120px] sm:min-w-[160px]"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
