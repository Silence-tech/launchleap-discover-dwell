import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface UpvoteButtonProps {
  toolId: number
  isUpvoted: boolean
  upvotesCount: number
  onUpvoteChange?: (toolId: number, isUpvoted: boolean, newCount: number) => void
}

export function UpvoteButton({ toolId, isUpvoted, upvotesCount, onUpvoteChange }: UpvoteButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentIsUpvoted, setCurrentIsUpvoted] = useState(isUpvoted)
  const [currentCount, setCurrentCount] = useState(upvotesCount)

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upvote tools.",
      })
      return
    }

    setIsLoading(true)
    
    try {
      if (currentIsUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .eq('tool_id', toolId)
          .eq('user_id', user.id)
          
        if (error) throw error
        
        const newCount = Math.max(0, currentCount - 1)
        setCurrentIsUpvoted(false)
        setCurrentCount(newCount)
        onUpvoteChange?.(toolId, false, newCount)
      } else {
        // Add upvote
        const { error } = await supabase
          .from('upvotes')
          .insert({
            tool_id: toolId,
            user_id: user.id
          })
          
        if (error) throw error
        
        const newCount = currentCount + 1
        setCurrentIsUpvoted(true)
        setCurrentCount(newCount)
        onUpvoteChange?.(toolId, true, newCount)
      }
    } catch (error) {
      console.error('Error toggling upvote:', error)
      toast({
        title: "Error",
        description: "Failed to update upvote. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleUpvote}
      disabled={isLoading}
      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
        currentIsUpvoted 
          ? 'text-red-500 bg-red-50/10 hover:text-red-600 hover:bg-red-50/20' 
          : 'text-glass-foreground/60 hover:text-red-500 hover:bg-red-50/10'
      }`}
    >
      <Heart className={`w-4 h-4 transition-all duration-200 ${currentIsUpvoted ? 'fill-current' : ''}`} />
    </Button>
  )
}