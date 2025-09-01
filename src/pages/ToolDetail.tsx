import { ArrowLeft, Calendar, ExternalLink, Heart, Share2, Copy, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"

// Mock tool data - replace with actual data from Supabase
const mockTool = {
  id: "1",
  name: "CloudFlow AI",
  description: "Transform your workflow with AI-powered automation that learns and adapts to your team's needs. Perfect for streamlining complex processes and increasing productivity across all departments.",
  fullDescription: `CloudFlow AI revolutionizes how teams handle repetitive tasks through intelligent automation. Our platform uses advanced machine learning algorithms to understand your workflow patterns and automatically optimize processes in real-time.

Key Features:
• Smart workflow automation with AI learning
• Integration with 100+ popular business tools
• Real-time analytics and optimization suggestions
• Team collaboration features with role-based access
• Custom automation builder with drag-and-drop interface
• Advanced reporting and performance tracking

Whether you're managing customer support, sales processes, or content creation workflows, CloudFlow AI adapts to your unique business needs and grows with your team.`,
  logoUrl: "",
  websiteUrl: "https://cloudflow-ai.com",
  launchDate: "2024-01-15",
  isPaid: false,
  isUpvoted: false,
  upvoteCount: 127, // This would be private in real app
  category: "Productivity",
  maker: "Alex Chen",
  tags: ["AI", "Automation", "Workflow", "Productivity", "Integration"]
}

export function ToolDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const handleBack = () => {
    navigate(-1)
  }

  const handleUpvote = () => {
    console.log("Upvote tool:", id)
    // TODO: Implement upvote functionality with Supabase
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out ${mockTool.name} - ${mockTool.description}`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        break
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-8 hover:bg-glass/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Discovery
        </Button>

        {/* Tool Header */}
        <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-8 shadow-glass mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex items-start space-x-4 mb-6 md:mb-0">
              <div className="w-20 h-20 rounded-2xl bg-glass/50 backdrop-blur-sm border border-glass-border/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {mockTool.logoUrl ? (
                  <img 
                    src={mockTool.logoUrl} 
                    alt={`${mockTool.name} logo`}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-cosmic rounded-xl" />
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-glass-foreground mb-2">
                  {mockTool.name}
                </h1>
                <p className="text-lg text-glass-foreground/80 mb-4">
                  {mockTool.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-glass-foreground/60">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Launched {new Date(mockTool.launchDate).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <span>by {mockTool.maker}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${mockTool.isPaid ? 'bg-secondary/20 text-secondary' : 'bg-accent/20 text-accent'}`}>
                    {mockTool.isPaid ? 'Paid' : 'Free'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 md:flex-shrink-0">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => window.open(mockTool.websiteUrl, '_blank')}
                className="min-w-[160px]"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Visit Website
              </Button>
              
              <Button
                variant={mockTool.isUpvoted ? "default" : "outline"}
                size="lg"
                onClick={handleUpvote}
                className="min-w-[160px]"
              >
                <Heart className={`w-5 h-5 mr-2 ${mockTool.isUpvoted ? 'fill-current' : ''}`} />
                {mockTool.isUpvoted ? 'Upvoted' : 'Upvote'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-8 shadow-glass">
              <h2 className="text-2xl font-semibold text-glass-foreground mb-6">About {mockTool.name}</h2>
              <div className="prose prose-lg text-glass-foreground/80 whitespace-pre-line">
                {mockTool.fullDescription}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share */}
            <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 shadow-glass">
              <h3 className="text-lg font-semibold text-glass-foreground mb-4 flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share this tool
              </h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleShare('twitter')}
                >
                  Share on Twitter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleShare('linkedin')}
                >
                  Share on LinkedIn
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleShare('copy')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 shadow-glass">
              <h3 className="text-lg font-semibold text-glass-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {mockTool.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-glass/20 text-glass-foreground/80 text-sm rounded-full border border-glass-border/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Comments Placeholder */}
            <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 shadow-glass">
              <h3 className="text-lg font-semibold text-glass-foreground mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Comments
              </h3>
              <p className="text-glass-foreground/60 text-center py-8">
                Comments coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}