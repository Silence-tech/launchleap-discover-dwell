import { useState } from "react"
import { Calendar, ExternalLink, Heart, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Tool {
  id: string
  name: string
  description: string
  logoUrl: string
  websiteUrl: string
  launchDate: string
  isPaid: boolean
  isUpvoted?: boolean
}

interface ToolCardProps {
  tool: Tool
  onUpvote?: (toolId: string) => void
}

export function ToolCard({ tool, onUpvote }: ToolCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isUpvoted, setIsUpvoted] = useState(tool.isUpvoted || false)
  const [isLoading, setIsLoading] = useState(false)

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
      if (isUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .eq('tool_id', parseInt(tool.id))
          .eq('user_id', user.id)
          
        if (error) throw error
        setIsUpvoted(false)
      } else {
        // Add upvote
        const { error } = await supabase
          .from('upvotes')
          .insert({
            tool_id: parseInt(tool.id),
            user_id: user.id
          })
          
        if (error) throw error
        setIsUpvoted(true)
      }
      
      onUpvote?.(tool.id)
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
    <div className="group relative bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 shadow-glass hover:shadow-cosmic transition-all duration-500 animate-glass-morph hover:scale-[1.02]">
      {/* Floating glow effect */}
      <div className="absolute inset-0 bg-gradient-cosmic opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-glass/50 backdrop-blur-sm border border-glass-border/20 flex items-center justify-center overflow-hidden">
              {tool.logoUrl ? (
                <img 
                  src={tool.logoUrl} 
                  alt={`${tool.name} logo`}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-cosmic rounded-lg" />
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-glass-foreground group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-glass-foreground/60">
                <Calendar className="w-3 h-3" />
                <span>{new Date(tool.launchDate).toLocaleDateString()}</span>
                 <Badge variant={tool.isPaid ? "secondary" : "outline"} className="text-xs" title={tool.isPaid ? "This tool has paid features" : "This tool is free to use"}>
                  <Tag className="w-3 h-3 mr-1" />
                  {tool.isPaid ? "Paid" : "Free"}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleUpvote}
            disabled={isLoading}
            className={`rounded-xl transition-all duration-200 ${
              isUpvoted 
                ? 'text-red-500 bg-red-50/10 hover:text-red-600 hover:bg-red-50/20' 
                : 'text-glass-foreground/60 hover:text-red-500 hover:bg-red-50/10'
            }`}
          >
            <Heart className={`w-5 h-5 transition-all duration-200 ${isUpvoted ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Description */}
        <p className="text-glass-foreground/80 text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="glass"
            size="sm"
            onClick={() => window.open(tool.websiteUrl, '_blank')}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Visit
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/tool/${tool.id}`} className="flex items-center">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}