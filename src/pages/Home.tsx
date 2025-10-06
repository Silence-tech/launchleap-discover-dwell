import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { ToolCardSkeleton } from "@/components/ToolCardSkeleton";
import { TrendingCarousel } from "@/components/TrendingCarousel";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-cosmic.jpg";

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

export function Home() {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedTools()
  }, []) // Empty dependency array - only run once on mount

  const fetchFeaturedTools = async () => {
    try {
      setLoading(true)
      
      // Fetch top 4 tools by upvotes with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const { data: toolsData, error } = await supabase
        .from('tools')
        .select('*')
        .order('upvotes_count', { ascending: false })
        .limit(4)
        .abortSignal(controller.signal)

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
      console.error('Error fetching featured tools:', error)
      setTools([]) // Set empty array on error to prevent infinite loading
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 animate-cosmic-pulse"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-cosmic opacity-10 animate-float" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-glass/20 backdrop-blur-xl border border-glass-border/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-float text-sm sm:text-base">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-glass-foreground">
                Discover Tomorrow's Tools Today
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent animate-fade-in px-4">
              Launch Your Ideas to New Heights
            </h1>

            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-glass-foreground/80 mb-8 sm:mb-12 leading-relaxed animate-fade-in px-4"
              style={{ animationDelay: "0.2s" }}
            >
              Discover groundbreaking tools, share your creations, and connect
              with innovators shaping the future of technology.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-in px-4"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                variant="hero"
                size="hero"
                className="w-full sm:w-auto sm:min-w-[200px] active:scale-95 touch-manipulation"
                asChild
              >
                <Link to="/discover">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Explore Tools
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                </Link>
              </Button>

              <Button
                variant="glass"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[200px] active:scale-95 touch-manipulation"
                asChild
              >
                <Link to="/submit">Submit Your Tool</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Carousel Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <TrendingCarousel />
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-glass/10 backdrop-blur-sm border border-glass-border/20 rounded-full px-4 py-2 mb-4 animate-float">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-glass-foreground/80">
                Top Picks This Week
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-glass-foreground mb-4">
              Featured Discoveries
            </h2>
            <p className="text-base sm:text-xl text-glass-foreground/60 max-w-2xl mx-auto px-4">
              Handpicked tools that are making waves in the tech community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <ToolCardSkeleton key={i} />
                ))}
              </>
            ) : (
              tools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
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
                    onUpvote={(toolId) => {
                      const numericId = parseInt(toolId);
                      const tool = tools.find((t) => t.id === numericId);
                      if (tool) {
                        handleUpvoteChange(
                          numericId,
                          !tool.isUpvoted,
                          tool.upvotes_count + (tool.isUpvoted ? -1 : 1),
                        );
                      }
                    }}
                  />
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild className="active:scale-95 touch-manipulation">
              <Link to="/discover">
                View All Tools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ScrollToTop />

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-cosmic animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">500+</div>
                <div className="text-sm sm:text-base text-glass-foreground/80">Tools Discovered</div>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary mb-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm sm:text-base text-glass-foreground/80">Active Users</div>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">50+</div>
                <div className="text-sm sm:text-base text-glass-foreground/80">Daily Launches</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
