import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Settings, Calendar, Mail, User } from "lucide-react"
import { Link } from "react-router-dom"

interface Profile {
  id: string
  user_id: string
  username: string | null
  tagline: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { user, profile: currentUserProfile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [profileData, setProfileData] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) return
      
      setLoading(true)
      
      try {
        if (username) {
          // Fetch profile by username (public profile view)
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .maybeSingle()

          if (error) throw error

          if (data) {
            setProfileData(data)
            setIsOwnProfile(user?.id === data.user_id)
          } else {
            navigate('/') // Profile not found, redirect to home
            return
          }
        } else if (user && currentUserProfile) {
          // No username in URL, show current user's profile
          setProfileData(currentUserProfile)
          setIsOwnProfile(true)
        } else if (!user) {
          // Not logged in and no username, redirect to login
          navigate('/login')
          return
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username, user, currentUserProfile, authLoading, navigate])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!profileData) {
    return null
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            {isOwnProfile ? "Your Profile" : `${profileData.username}'s Profile`}
          </h1>
          <p className="text-xl text-glass-foreground/80">
            {isOwnProfile ? "Manage your Producshine profile and settings" : "Discover this user's contributions to Producshine"}
          </p>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-8 shadow-glass mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-glass/50 backdrop-blur-sm border-2 border-glass-border/20 flex items-center justify-center overflow-hidden">
                {profileData.avatar_url ? (
                  <img 
                    src={profileData.avatar_url} 
                    alt="Profile avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-12 h-12 text-glass-foreground/60" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-glass-foreground mb-2">
                    {profileData.username || "Anonymous User"}
                  </h1>
                  {profileData.tagline && (
                    <p className="text-lg text-glass-foreground/80 mb-4">
                      {profileData.tagline}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-glass-foreground/60">
                    {isOwnProfile && user?.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {new Date(profileData.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button - only show for own profile */}
                {isOwnProfile && (
                  <Button variant="outline" className="mt-4 md:mt-0" asChild>
                    <Link to="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                )}
              </div>

              {/* Bio */}
              {profileData.bio && (
                <div className="mt-6 p-4 bg-glass/20 backdrop-blur-sm rounded-lg border border-glass-border/20">
                  <p className="text-glass-foreground/80 leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>
              )}
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
              {new Date(profileData.created_at).toLocaleDateString('en-US', { 
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