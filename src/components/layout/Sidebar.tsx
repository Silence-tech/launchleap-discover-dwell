import {
  Home,
  Search,
  Plus,
  TrendingUp,
  User,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/hooks/useAuth";
import producshineLogoUrl from "@/assets/producshine-logo.png";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: Search },
  { name: "Submit Tool", href: "/submit", icon: Plus },
  { name: "Trending", href: "/trending", icon: TrendingUp },
  { name: "Profile", href: "/profile", icon: User },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNavClick = () => {
    // Close mobile menu when navigation item is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed left-0 top-0 z-40 h-screen w-80 backdrop-blur-xl bg-sidebar border-r border-sidebar-border shadow-glass transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:block`}>
        <div className="flex flex-col h-full">
        {/* Logo & Auth */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl shadow-glow flex items-center justify-center">
              <img
                src={producshineLogoUrl}
                alt="Producshine"
                className="w-8 h-8"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Producshine
            </span>
          </div>
        </div>

        {/* Auth Section */}
        <div className="px-6 py-4 border-b border-sidebar-border/30">
          <AuthButton />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4 space-y-2">
          {navigation.map((item) => {
            const requiresAuth =
              item.name === "Submit Tool" || item.name === "Profile";
            const isDisabled = requiresAuth && !user;

            if (isDisabled) {
              return (
                <div
                  key={item.name}
                  className="group flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sidebar-foreground/50 cursor-not-allowed opacity-60"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={({ isActive }) => {
                  // Fix highlighting for trending tab
                  const isTrendingActive =
                    item.name === "Trending" &&
                    window.location.pathname === "/trending";
                  const isDiscoverActive =
                    item.name === "Discover" &&
                    (window.location.pathname === "/discover" ||
                      window.location.pathname === "/trending");
                  const actuallyActive =
                    item.name === "Trending"
                      ? isTrendingActive
                      : item.name === "Discover"
                        ? isActive && !isTrendingActive
                        : isActive;

                  return `group flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                    actuallyActive
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-sidebar-foreground hover:bg-glass hover:text-primary hover:shadow-glass"
                  }`;
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-6 pb-4 space-y-2">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="w-full justify-start px-4 py-3 rounded-xl hover:bg-glass hover:shadow-glass"
          >
            {theme === "light" ? (
              <>
                <Moon className="w-5 h-5 mr-3" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 mr-3" />
                <span>Light Mode</span>
              </>
            )}
          </Button>

          {user ? (
            <NavLink
              to="/settings"
              onClick={handleNavClick}
              className="group flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-glass hover:text-primary hover:shadow-glass transition-all duration-300"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </NavLink>
          ) : (
            <div className="group flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sidebar-foreground/50 cursor-not-allowed opacity-60">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </div>
          )}
        </div>
      </div>
      </aside>
    </>
  );
}
