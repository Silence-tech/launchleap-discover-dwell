import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolCard } from "@/components/ToolCard"
import { Link } from "react-router-dom"
import heroImage from "@/assets/hero-cosmic.jpg"

// Mock data - replace with actual data from Supabase
const mockTools = [
  {
    id: "1",
    name: "CloudFlow AI",
    description: "Transform your workflow with AI-powered automation that learns and adapts to your team's needs.",
    logoUrl: "",
    websiteUrl: "https://example.com",
    launchDate: "2024-01-15",
    isPaid: false,
    isUpvoted: false,
  },
  {
    id: "2", 
    name: "DesignSpark Pro",
    description: "Create stunning visuals with our advanced design toolkit. Perfect for teams and solo creators.",
    logoUrl: "",
    websiteUrl: "https://example.com",
    launchDate: "2024-01-10",
    isPaid: true,
    isUpvoted: true,
  },
  {
    id: "3",
    name: "DataSync Hub",
    description: "Seamlessly connect all your data sources with our powerful integration platform.",
    logoUrl: "",
    websiteUrl: "https://example.com", 
    launchDate: "2024-01-08",
    isPaid: false,
    isUpvoted: false,
  },
  {
    id: "4",
    name: "CodeMentor AI",
    description: "Get instant code reviews and suggestions from our advanced AI programming assistant.",
    logoUrl: "",
    websiteUrl: "https://example.com",
    launchDate: "2024-01-05",
    isPaid: true,
    isUpvoted: false,
  },
]

export function Home() {
  const handleUpvote = (toolId: string) => {
    console.log("Upvote tool:", toolId)
    // TODO: Implement upvote functionality with Supabase
  }

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
              <span className="text-glass-foreground">Discover Tomorrow's Tools Today</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent animate-fade-in">
              Launch Your Ideas to New Heights
            </h1>
            
            <p className="text-xl md:text-2xl text-glass-foreground/80 mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover groundbreaking tools, share your creations, and connect with innovators 
              shaping the future of technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button variant="hero" size="hero" className="min-w-[200px]" asChild>
                <Link to="/discover">
                  <Zap className="w-6 h-6 mr-2" />
                  Explore Tools
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Link>
              </Button>
              
              <Button variant="glass" size="lg" className="min-w-[200px]" asChild>
                <Link to="/submit">
                  Submit Your Tool
                </Link>
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
              <span className="text-sm text-glass-foreground/80">Trending This Week</span>
            </div>
            
            <h2 className="text-4xl font-bold text-glass-foreground mb-4">
              Featured Discoveries
            </h2>
            <p className="text-xl text-glass-foreground/60 max-w-2xl mx-auto">
              Handpicked tools that are making waves in the tech community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {mockTools.map((tool, index) => (
              <div 
                key={tool.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ToolCard tool={tool} onUpvote={handleUpvote} />
              </div>
            ))}
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
                <div className="text-4xl font-bold text-secondary mb-2">10K+</div>
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
  )
}