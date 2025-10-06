import { useState, useEffect } from "react";
import { Search, Filter, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolCardSkeleton } from "@/components/ToolCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ScrollToTop } from "@/components/ScrollToTop";
import { UpvoteButton } from "@/components/UpvoteButton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ExternalLink, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface Tool {
  id: number;
  title: string;
  description: string;
  bio?: string; // Add bio field
  url: string | null;
  launch_date: string | null;
  is_paid: boolean | null;
  logo_url: string | null;
  upvotes_count: number;
  user_id: string | null;
  created_at: string;
  isUpvoted?: boolean;
}

export function Discover() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("newest");
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = [
    { id: "newest", label: "Newest", icon: Clock },
    { id: "featured", label: "Featured", icon: Star },
  ];

  useEffect(() => {
    fetchTools()
  }, [selectedFilter]) // Only depend on selectedFilter, not user

  const fetchTools = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      let query = supabase.from('tools').select('*')
      
      // Apply sorting based on filter
      if (selectedFilter === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (selectedFilter === 'featured') {
        query = query.order('upvotes_count', { ascending: false })
      }
      
      const { data: toolsData, error } = await query.abortSignal(controller.signal)
      
      clearTimeout(timeoutId)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Check if user has upvoted any of these tools
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
      } else {
        toolsWithUpvoteStatus = toolsWithUpvoteStatus.map(tool => ({
          ...tool,
          upvotes_count: tool.upvotes_count || 0
        }))
      }

      setTools(toolsWithUpvoteStatus)
    } catch (error) {
      console.error('Error fetching tools:', error)
      setError('Failed to load tools. Please try again.')
      setTools([]) // Ensure tools array is set even on error
    } finally {
      setLoading(false)
    }
  }

  const handleUpvoteChange = (
    toolId: number,
    isUpvoted: boolean,
    newCount: number,
  ) => {
    setTools((prevTools) =>
      prevTools.map((tool) =>
        tool.id === toolId
          ? { ...tool, isUpvoted, upvotes_count: newCount }
          : tool,
      ),
    );
  };

  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon={Search}
          title="Failed to load tools"
          description={error}
          actionLabel="Try Again"
          onAction={fetchTools}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Discover Amazing Tools
          </h1>
          <p className="text-xl text-glass-foreground/80">
            Explore the latest innovations and find tools that supercharge your
            productivity
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 shadow-glass">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-glass-foreground/60 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for tools, categories, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 bg-glass/30 backdrop-blur-sm border-glass-border/40 text-lg"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 text-glass-foreground/80">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>

              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.id)}
                  className="rounded-full min-h-[44px] touch-manipulation active:scale-95"
                >
                  <filter.icon className="w-4 h-4 mr-1" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-glass-foreground/70">
            Showing {filteredTools.length} tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </>
          ) : filteredTools.map((tool, index) => (
            <div
              key={tool.id}
              className="group relative bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 shadow-glass hover:shadow-cosmic active:scale-[0.98] transition-all duration-500 animate-glass-morph hover:scale-[1.02] animate-fade-in touch-manipulation"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Floating glow effect */}
              <div className="absolute inset-0 bg-gradient-cosmic opacity-0 group-hover:opacity-20 group-active:opacity-20 rounded-2xl transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-glass/50 backdrop-blur-sm border border-glass-border/20 flex items-center justify-center overflow-hidden">
                      {tool.logo_url ? (
                        <img
                          src={tool.logo_url}
                          alt={`${tool.title} logo`}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-cosmic rounded-lg" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-glass-foreground group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-glass-foreground/60">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {tool.launch_date
                            ? new Date(tool.launch_date).toLocaleDateString()
                            : "N/A"}
                        </span>
                        <Badge
                          variant={tool.is_paid ? "secondary" : "outline"}
                          className="text-xs"
                          title={
                            tool.is_paid
                              ? "This tool has paid features"
                              : "This tool is free to use"
                          }
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tool.is_paid ? "Paid" : "Free"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <UpvoteButton
                    toolId={tool.id}
                    isUpvoted={tool.isUpvoted || false}
                    upvotesCount={tool.upvotes_count}
                    onUpvoteChange={handleUpvoteChange}
                  />
                </div>

                {/* Description - Use bio if available */}
                <p className="text-glass-foreground/80 text-sm mb-4 line-clamp-2">
                  {tool.bio || tool.description}
                </p>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => tool.url && window.open(tool.url, "_blank")}
                    className="flex-1 min-h-[44px] active:scale-95 touch-manipulation"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visit
                  </Button>
                  <Button variant="outline" size="sm" className="min-h-[44px] active:scale-95 touch-manipulation">
                    <Link to={`/tool/${tool.id}`} className="flex items-center">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredTools.length > 6 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Tools
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredTools.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              icon={Search}
              title="No tools found"
              description="Try adjusting your search terms or filters"
              actionLabel="Clear Search"
              onAction={() => setSearchQuery("")}
            />
          </div>
        )}
      </div>
      
      <ScrollToTop />
    </div>
  );
}
