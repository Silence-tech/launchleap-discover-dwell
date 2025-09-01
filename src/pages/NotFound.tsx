import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-24 h-24 bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl shadow-glass mx-auto mb-8 flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-glass-foreground/80 mb-8">
          Oops! This page seems to have launched into space
        </p>
        
        <Button variant="hero" size="lg" asChild>
          <a href="/">
            <Home className="w-5 h-5 mr-2" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
