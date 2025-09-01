// LaunchLeap - Product Discovery Platform

import { ArrowRight, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6 animate-fade-in">
        <div className="w-20 h-20 bg-gradient-cosmic rounded-2xl shadow-cosmic mx-auto mb-8 flex items-center justify-center animate-cosmic-pulse">
          <Rocket className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
          Welcome to LaunchLeap
        </h1>
        
        <p className="text-xl text-glass-foreground/80 mb-8 leading-relaxed">
          Your gateway to discovering and sharing the next generation of digital tools and innovations.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button variant="hero" size="lg">
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button variant="glass" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
