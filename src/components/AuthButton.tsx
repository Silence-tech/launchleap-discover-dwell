import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User } from "lucide-react"

// Mock auth state - replace with actual Supabase auth
const mockUser = null // Set to user object when authenticated

export function AuthButton() {
  const handleSignIn = () => {
    console.log("Sign in with Google")
    // TODO: Implement Google OAuth with Supabase
  }

  const handleSignOut = () => {
    console.log("Sign out")
    // TODO: Implement sign out with Supabase
  }

  if (mockUser) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-glass-foreground/80">
          <User className="w-4 h-4" />
          <span className="text-sm">user@example.com</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-1" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button variant="glass" size="sm" onClick={handleSignIn}>
      <LogIn className="w-4 h-4 mr-1" />
      Sign In with Google
    </Button>
  )
}