import { Home, Search, Plus, TrendingUp, User, Settings, Moon, Sun } from "lucide-react"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { AuthButton } from "@/components/AuthButton"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: Search },
  { name: "Submit Tool", href: "/submit", icon: Plus },
  { name: "Trending", href: "/trending", icon: TrendingUp },
  { name: "Profile", href: "/profile", icon: User },
]

export function Sidebar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-80 backdrop-blur-xl bg-sidebar border-r border-sidebar-border shadow-glass">
      <div className="flex flex-col h-full">
        {/* Logo & Auth */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-cosmic rounded-xl shadow-glow flex items-center justify-center animate-cosmic-pulse">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">LaunchLeap</span>
          </div>
        </div>

        {/* Auth Section */}
        <div className="px-6 py-4 border-b border-sidebar-border/30">
          <AuthButton />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-sidebar-foreground hover:bg-glass hover:text-primary hover:shadow-glass"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
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

          <NavLink
            to="/settings"
            className="group flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-glass hover:text-primary hover:shadow-glass transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  )
}