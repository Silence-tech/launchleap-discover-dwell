import { useState, useEffect } from "react";
import { Search, Filter, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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

  // useEffect(() => {
  //   fetchTools()
  // }, [user, selectedFilter])
  useEffect(() => {
    fetchTools();
  }, [selectedFilter]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tools with different ordering based on filter
      let query = supabase.from("tools").select("*");

      if (selectedFilter === "newest") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("upvotes_count", { ascending: false });
      }

      const { data: toolsData, error: toolsError } = await query;

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
      console.error("Error fetching tools:", error);
      setError("Failed to load tools. Please try again.");
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

  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          <Button onClick={fetchTools}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
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
                  className="rounded-full"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <div
              key={tool.id}
              className="group relative bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 shadow-glass hover:shadow-cosmic transition-all duration-500 animate-glass-morph hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Floating glow effect */}
              <div className="absolute inset-0 bg-gradient-cosmic opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500" />

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

                {/* Description */}
                <p className="text-glass-foreground/80 text-sm mb-4 line-clamp-2">
                  {tool.description}
                </p>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => tool.url && window.open(tool.url, "_blank")}
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
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-glass/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-glass-foreground/40" />
            </div>
            <h3 className="text-2xl font-semibold text-glass-foreground mb-2">
              No tools found
            </h3>
            <p className="text-glass-foreground/60 mb-8">
              Try adjusting your search terms or filters
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
