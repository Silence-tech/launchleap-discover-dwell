import { Calendar, ExternalLink, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

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
  const handleUpvote = () => {
    onUpvote?.(tool.id)
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
                {tool.isPaid ? (
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                    Paid
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    Free
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleUpvote}
            className={`rounded-xl ${tool.isUpvoted ? 'text-primary bg-primary/10' : 'text-glass-foreground/60'}`}
          >
            <Heart className={`w-5 h-5 ${tool.isUpvoted ? 'fill-current' : ''}`} />
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
          <Button variant="outline" size="sm">
            <Link to={`/tool/${tool.id}`} className="flex items-center">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}