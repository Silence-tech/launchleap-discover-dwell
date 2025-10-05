import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import producshineLogoUrl from "@/assets/producshine-logo.png";

interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-xl bg-sidebar border-b border-sidebar-border shadow-glass md:hidden">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl shadow-glow flex items-center justify-center">
            <img
              src={producshineLogoUrl}
              alt="Producshine"
              className="w-8 h-8"
            />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Producshine
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="rounded-xl hover:bg-glass"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>
    </header>
  );
}
