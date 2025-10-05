import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      {/* Mobile Header - only visible on mobile */}
      <MobileHeader
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Sidebar - desktop always visible, mobile controlled by state */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main content - add top padding on mobile for fixed header */}
      <main className="md:ml-80 min-h-screen pt-16 md:pt-0">
        <div className="animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
