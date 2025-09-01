import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export function Profile() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-xl text-glass-foreground/80">
            Manage your LaunchLeap profile and settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-8 shadow-cosmic mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username || 'User Avatar'}
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-glass-border/30"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-cosmic rounded-2xl shadow-glow flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-glass-foreground mb-2">
                  {profile.username || user.email}
                </h2>
                <p className="text-glass-foreground/60 text-sm mb-4">
                  {user.email}
                </p>
                
                {profile.tagline && (
                  <p className="text-xl text-primary font-medium mb-4">
                    {profile.tagline}
                  </p>
                )}
                
                {profile.bio && (
                  <p className="text-glass-foreground/80 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
                
                {!profile.tagline && !profile.bio && (
                  <p className="text-glass-foreground/50 italic">
                    No bio or tagline added yet. Click "Edit Profile" to add one!
                  </p>
                )}
              </div>

              <Link to="/settings">
                <Button variant="default" className="inline-flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 text-center shadow-glass">
            <div className="text-2xl font-bold text-primary mb-2">0</div>
            <div className="text-glass-foreground/80">Tools Submitted</div>
          </div>
          <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 text-center shadow-glass">
            <div className="text-2xl font-bold text-secondary mb-2">0</div>
            <div className="text-glass-foreground/80">Upvotes Given</div>
          </div>
          <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-6 text-center shadow-glass">
            <div className="text-2xl font-bold text-accent mb-2">
              {new Date(profile.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </div>
            <div className="text-glass-foreground/80">Member Since</div>
          </div>
        </div>
      </div>
    </div>
  )
}