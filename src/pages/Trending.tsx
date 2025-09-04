import { useState, useEffect } from "react";
import { TrendingUp, ExternalLink, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { UpvoteButton } from "@/components/UpvoteButton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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

export function Trending() {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetchTrendingTools()
  // }, [user])
  useEffect(() => {
    fetchTrendingTools();
  }, []);

  const fetchTrendingTools = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tools ordered by upvotes_count (trending)
      const { data: toolsData, error: toolsError } = await supabase
        .from("tools")
        .select("*")
        .order("upvotes_count", { ascending: false })
        .order("created_at", { ascending: false });

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
              upvotes_count: (tool as any).upvotes_count || 0,
              isUpvoted: upvotedToolIds.has(tool.id),
            })) || [];

          setTools(toolsWithUpvoteStatus);
        } else {
          const toolsWithDefaults =
            toolsData?.map((tool) => ({
              ...tool,
              upvotes_count: (tool as any).upvotes_count || 0,
            })) || [];
          setTools(toolsWithDefaults);
        }
      } else {
        const toolsWithDefaults =
          toolsData?.map((tool) => ({
            ...tool,
            upvotes_count: (tool as any).upvotes_count || 0,
          })) || [];
        setTools(toolsWithDefaults);
      }
    } catch (error) {
      console.error("Error fetching trending tools:", error);
      setError("Failed to load trending tools. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvoteChange = (
    toolId: number,
    isUpvoted: boolean,
    newCount: number,
  ) => {
    setTools(
      (prevTools) =>
        prevTools
          .map((tool) =>
            tool.id === toolId
              ? { ...tool, isUpvoted, upvotes_count: newCount }
              : tool,
          )
          .sort((a, b) => b.upvotes_count - a.upvotes_count), // Re-sort by upvotes
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchTrendingTools}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Trending Tools
            </h1>
          </div>
          <p className="text-xl text-glass-foreground/80">
            Discover the most popular tools loved by the community
          </p>
        </div>

        {/* Tools List */}
        {tools.length === 0 ? (
          <div className="text-center py-20">
            <TrendingUp className="w-16 h-16 text-glass-foreground/40 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-glass-foreground mb-2">
              No trending tools yet
            </h3>
            <p className="text-glass-foreground/60">
              Be the first to discover and upvote amazing tools!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tools.map((tool, index) => (
              <div
                key={tool.id}
                className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 shadow-glass hover:shadow-cosmic transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-cosmic rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Logo */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-glass/50 backdrop-blur-sm border border-glass-border/20 flex items-center justify-center overflow-hidden">
                    {tool.logo_url ? (
                      <img
                        src={tool.logo_url}
                        alt={`${tool.title} logo`}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-cosmic rounded-lg" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-glass-foreground mb-1">
                          {tool.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-glass-foreground/60 mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {tool.launch_date
                                ? new Date(
                                    tool.launch_date,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
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

                      {/* Upvote Button */}
                      <UpvoteButton
                        toolId={tool.id}
                        isUpvoted={tool.isUpvoted || false}
                        upvotesCount={tool.upvotes_count}
                        onUpvoteChange={handleUpvoteChange}
                      />
                    </div>

                    <p className="text-glass-foreground/80 mb-4 line-clamp-2">
                      {tool.description}
                    </p>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Button
                        variant="glass"
                        size="sm"
                        onClick={() =>
                          tool.url && window.open(tool.url, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Link
                          to={`/tool/${tool.id}`}
                          className="flex items-center"
                        >
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
