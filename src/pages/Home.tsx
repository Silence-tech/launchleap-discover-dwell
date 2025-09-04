import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-cosmic.jpg";

interface Tool {
  id: number;
  title: string;
  description: string;
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

  // useEffect(() => {
  //   fetchFeaturedTools();
  // }, [user]);
  useEffect(() => {
    fetchFeaturedTools();
  }, []);

  const fetchFeaturedTools = async () => {
    try {
      setLoading(true);

      // Fetch top 4 tools by upvotes for homepage
      const { data: toolsData, error: toolsError } = await supabase
        .from("tools")
        .select("*")
        .order("upvotes_count", { ascending: false })
        .limit(4);

      if (toolsError) throw toolsError;

      if (user) {
        // Check which tools the user has upvoted
        const toolIds = toolsData?.map((tool) => tool.id) || [];

        if (toolIds.length > 0) {
          const { data: upvotesData, error: upvotesError } = await supabase
            .from("upvotes")
            .select("tool_id")
            .eq("user_id", user.id)
            .in("tool_id", toolIds);

          if (upvotesError) throw upvotesError;

          const upvotedToolIds = new Set(
            upvotesData?.map((upvote) => upvote.tool_id),
          );

          const toolsWithUpvoteStatus =
            toolsData?.map((tool) => ({
              ...tool,
              upvotes_count: tool.upvotes_count || 0,
              isUpvoted: upvotedToolIds.has(tool.id),
            })) || [];

          setTools(toolsWithUpvoteStatus);
        } else {
          const toolsWithDefaults =
            toolsData?.map((tool) => ({
              ...tool,
              upvotes_count: tool.upvotes_count || 0,
            })) || [];
          setTools(toolsWithDefaults);
        }
      } else {
        const toolsWithDefaults =
          toolsData?.map((tool) => ({
            ...tool,
            upvotes_count: tool.upvotes_count || 0,
          })) || [];
        setTools(toolsWithDefaults);
      }
    } catch (error) {
      console.error("Error fetching featured tools:", error);
    } finally {
      setLoading(false);
    }
  };

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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-glass/20 backdrop-blur-xl border border-glass-border/30 rounded-full px-6 py-3 mb-8 animate-float">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-glass-foreground">
                Discover Tomorrow's Tools Today
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent animate-fade-in">
              Launch Your Ideas to New Heights
            </h1>

            <p
              className="text-xl md:text-2xl text-glass-foreground/80 mb-12 leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Discover groundbreaking tools, share your creations, and connect
              with innovators shaping the future of technology.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                variant="hero"
                size="hero"
                className="min-w-[200px]"
                asChild
              >
                <Link to="/discover">
                  <Zap className="w-6 h-6 mr-2" />
                  Explore Tools
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Link>
              </Button>

              <Button
                variant="glass"
                size="lg"
                className="min-w-[200px]"
                asChild
              >
                <Link to="/submit">Submit Your Tool</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-glass/10 backdrop-blur-sm border border-glass-border/20 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-glass-foreground/80">
                Trending This Week
              </span>
            </div>

            <h2 className="text-4xl font-bold text-glass-foreground mb-4">
              Featured Discoveries
            </h2>
            <p className="text-xl text-glass-foreground/60 max-w-2xl mx-auto">
              Handpicked tools that are making waves in the tech community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
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
                      description: tool.description,
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
            <Button variant="outline" size="lg" asChild>
              <Link to="/discover">
                View All Tools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-12 shadow-cosmic">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-glass-foreground/80">Tools Discovered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">
                  10K+
                </div>
                <div className="text-glass-foreground/80">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">50+</div>
                <div className="text-glass-foreground/80">Daily Launches</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
