import { useState } from "react"
import { Search, Filter, TrendingUp, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToolCard } from "@/components/ToolCard"

// Mock data - replace with actual data from Supabase
const mockTools = [
  {
    id: "1",
    name: "CloudFlow AI",
    description: "Transform your workflow with AI-powered automation that learns and adapts to your team's needs. Perfect for streamlining complex processes.",
    logoUrl: "",
    websiteUrl: "https://example.com",
    launchDate: "2024-01-15",
    isPaid: false,
    isUpvoted: false,
  },
  {
    id: "2", 
    name: "DesignSpark Pro",
    description: "Create stunning visuals with our advanced design toolkit. Perfect for teams and solo creators who need professional-grade design tools.",
    logoUrl: "",
    websiteUrl: "https://example.com",
    launchDate: "2024-01-10",
    isPaid: true,
    isUpvoted: true,
  },
  {
    id: "3",
    name: "DataSync Hub",
    description: "Seamlessly connect all your data sources with our powerful integration platform. Build workflows that sync data across 100+ applications.",
    logoUrl: "",
    websiteUrl: "https://example.com", 
    launchDate: "2024-01-08",
    isPaid: false,
    isUpvoted: false,
  },
  {
    id: "4",
    name: "CodeMentor AI",
    description: "Get instant code reviews and suggestions from our advanced AI programming assistant. Support for 20+ programming languages.",
    logoUrl: "",
    websiteUrl: "https://example.com",
    launchDate: "2024-01-05",
    isPaid: true,
    isUpvoted: false,
  },
  {
    id: "5",
    name: "TaskFlow Manager",
    description: "Organize your team's work with intuitive project management tools. Features real-time collaboration and smart scheduling.",
    logoUrl: "",
    websiteUrl: "https://example.com",
    launchDate: "2024-01-12",
    isPaid: false,
    isUpvoted: true,
  },
  {
    id: "6",
    name: "VideoEdit Studio",
    description: "Professional video editing made simple. Create stunning videos with AI-powered effects and automated workflows.",
    logoUrl: "",
    websiteUrl: "https://example.com",
    launchDate: "2024-01-07",
    isPaid: true,
    isUpvoted: false,
  }
]

export function Discover() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("trending")
  
  const filters = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "newest", label: "Newest", icon: Clock },
    { id: "featured", label: "Featured", icon: Star },
  ]

  const handleUpvote = (toolId: string) => {
    console.log("Upvote tool:", toolId)
    // TODO: Implement upvote functionality with Supabase
  }

  const filteredTools = mockTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Discover Amazing Tools
          </h1>
          <p className="text-xl text-glass-foreground/80">
            Explore the latest innovations and find tools that supercharge your productivity
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
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ToolCard tool={tool} onUpvote={handleUpvote} />
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredTools.length > 0 && (
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
  )
}