import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function AuthButton() {
  const { user, profile, loading, signInWithGoogle, signOut } = useAuth()

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse flex items-center space-x-3">
        <div className="h-4 w-4 bg-glass/40 rounded"></div>
        <div className="h-4 w-20 bg-glass/40 rounded"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-glass-foreground/80">
          <User className="w-4 h-4" />
          <span className="text-sm">{profile?.username || user.email}</span>
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