import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ToolCard } from "./ToolCard"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { ToolCardSkeleton } from "./ToolCardSkeleton"
import { TrendingUp } from "lucide-react"

interface Tool {
  id: number
  title: string
  description: string
  bio?: string
  url: string | null
  launch_date: string | null
  is_paid: boolean | null
  logo_url: string | null
  upvotes_count: number
  isUpvoted?: boolean
}

export function TrendingCarousel() {
  const { user } = useAuth()
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingTools()
  }, [])

  const fetchTrendingTools = async () => {
    try {
      setLoading(true)
      
      const { data: toolsData, error } = await supabase
        .from('tools')
        .select('*')
        .order('upvotes_count', { ascending: false })
        .limit(6)

      if (error) throw error

      let toolsWithUpvoteStatus = toolsData || []
      
      if (user && toolsWithUpvoteStatus.length > 0) {
        const toolIds = toolsWithUpvoteStatus.map(tool => tool.id)
        const { data: upvotesData } = await supabase
          .from('upvotes')
          .select('tool_id')
          .eq('user_id', user.id)
          .in('tool_id', toolIds)

        const upvotedToolIds = new Set(upvotesData?.map(upvote => upvote.tool_id) || [])
        
        toolsWithUpvoteStatus = toolsWithUpvoteStatus.map(tool => ({
          ...tool,
          upvotes_count: tool.upvotes_count || 0,
          isUpvoted: upvotedToolIds.has(tool.id)
        }))
      }

      setTools(toolsWithUpvoteStatus)
    } catch (error) {
      console.error('Error fetching trending tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpvoteChange = (toolId: string) => {
    const numericId = parseInt(toolId)
    setTools(prevTools => 
      prevTools.map(tool => 
        tool.id === numericId 
          ? { 
              ...tool, 
              isUpvoted: !tool.isUpvoted,
              upvotes_count: tool.upvotes_count + (tool.isUpvoted ? -1 : 1)
            } 
          : tool
      )
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <ToolCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (tools.length === 0) return null

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-2xl font-bold text-glass-foreground">Trending Now</h3>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {tools.map((tool) => (
            <CarouselItem key={tool.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <ToolCard
                tool={{
                  id: tool.id.toString(),
                  name: tool.title,
                  description: tool.bio || tool.description,
                  logoUrl: tool.logo_url || "",
                  websiteUrl: tool.url || "",
                  launchDate: tool.launch_date || "",
                  isPaid: tool.is_paid || false,
                  isUpvoted: tool.isUpvoted || false,
                }}
                onUpvote={handleUpvoteChange}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </div>
      </Carousel>
    </div>
  )
}
