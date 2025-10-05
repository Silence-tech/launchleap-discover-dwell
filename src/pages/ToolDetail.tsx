import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ExternalLink, Heart, Share2, Twitter, Linkedin, Copy, Calendar, DollarSign, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { LoadingSpinner } from "@/components/LoadingSpinner"

interface Tool {
  id: number
  title: string
  bio: string
  full_description: string
  url: string
  launch_date: string
  is_paid: boolean
  logo_url: string | null
  tags: string[]
  upvotes_count: number
  user_id: string
  isUpvoted?: boolean
}

export function ToolDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpvoting, setIsUpvoting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchTool()
    }
  }, [id])

  const fetchTool = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch tool data
      const { data: toolData, error: toolError } = await supabase
        .from('tools')
        .select('*')
        .eq('id', parseInt(id))
        .single()

      if (toolError) {
        if (toolError.code === 'PGRST116') {
          setError('Tool not found')
        } else {
          throw toolError
        }
        return
      }

      let isUpvoted = false
      
      // Check if user has upvoted this tool
      if (user) {
        const { data: upvoteData } = await supabase
          .from('upvotes')
          .select('id')
          .eq('tool_id', parseInt(id))
          .eq('user_id', user.id)
          .single()
        
        isUpvoted = !!upvoteData
      }

      setTool({
        ...toolData,
        bio: toolData.bio || toolData.description, // Fallback to description if bio is null
        full_description: toolData.full_description || toolData.description, // Fallback to description
        isUpvoted,
        tags: toolData.tags || []
      })
    } catch (error: any) {
      console.error('Error fetching tool:', error)
      setError('Failed to load tool details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upvote tools.",
        variant: "destructive"
      })
      return
    }

    if (!tool) return

    setIsUpvoting(true)

    try {
      if (tool.isUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .eq('tool_id', tool.id)
          .eq('user_id', user.id)

        if (error) throw error

        setTool(prev => prev ? {
          ...prev,
          isUpvoted: false,
          upvotes_count: prev.upvotes_count - 1
        } : null)
      } else {
        // Add upvote
        const { error } = await supabase
          .from('upvotes')
          .insert({
            tool_id: tool.id,
            user_id: user.id
          })

        if (error) throw error

        setTool(prev => prev ? {
          ...prev,
          isUpvoted: true,
          upvotes_count: prev.upvotes_count + 1
        } : null)
      }
    } catch (error: any) {
      console.error('Error updating upvote:', error)
      toast({
        title: "Error",
        description: "Failed to update upvote. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpvoting(false)
    }
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out ${tool?.title} on Producshine!`

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Tool link has been copied to your clipboard.",
        })
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-glass-foreground mb-4">
            {error || 'Tool not found'}
          </h2>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Button 
          onClick={handleBack}
          variant="ghost" 
          className="mb-8 hover:bg-glass/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-8 mb-8 shadow-glass">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-glass-border/30">
                {tool.logo_url ? (
                  <img 
                    src={tool.logo_url} 
                    alt={`${tool.title} logo`}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {tool.title.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Tool Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-glass-foreground mb-2">
                    {tool.title}
                  </h1>
                  <p className="text-lg text-glass-foreground/80 mb-4">
                    {tool.bio}
                  </p>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-glass-foreground/70">
                    {tool.launch_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Launched {new Date(tool.launch_date).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {tool.is_paid ? 'Paid' : 'Free'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleUpvote}
                    variant={tool.isUpvoted ? "default" : "outline"}
                    disabled={isUpvoting}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${tool.isUpvoted ? 'fill-current' : ''}`} />
                    {tool.upvotes_count} {tool.isUpvoted ? 'Upvoted' : 'Upvote'}
                  </Button>
                  
                  <Button
                    onClick={() => window.open(tool.url, '_blank')}
                    variant="hero"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Tool
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-8 shadow-glass">
              <h2 className="text-2xl font-bold text-glass-foreground mb-6">About {tool.title}</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-glass-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {tool.full_description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share */}
            <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-6 shadow-glass">
              <h3 className="text-lg font-semibold text-glass-foreground mb-4">Share this tool</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleShare('twitter')}
                  className="flex-1"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleShare('linkedin')}
                  className="flex-1"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleShare('copy')}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-glass-foreground mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-glass/30 backdrop-blur-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-6 shadow-glass">
              <h3 className="text-lg font-semibold text-glass-foreground mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-glass-foreground/70">Total Upvotes</span>
                  <span className="font-semibold text-glass-foreground">{tool.upvotes_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-glass-foreground/70">Pricing</span>
                  <Badge variant={tool.is_paid ? "destructive" : "default"}>
                    {tool.is_paid ? "Paid" : "Free"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}