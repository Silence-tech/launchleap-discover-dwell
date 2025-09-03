import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'

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

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)

    if (error) throw error
    await refreshProfile()
  }

  const signInWithGoogle = async () => {
    // Use Replit domain for OAuth redirect in production, fallback to current origin for local dev
    // IMPORTANT: Add these URLs to Supabase Dashboard → Authentication → URL Configuration → Redirect URLs:
    // - https://b5aef72d-cab7-41e7-98ad-72b42c9a583f-00-g1lw2e9ri9rr.janeway.replit.dev/
    // - https://your-production-domain.com/ (if deploying elsewhere)
    // - http://localhost:8080/ (for local development)
    const redirectUrl = process.env.NODE_ENV === 'production' || window.location.hostname.includes('replit.dev')
      ? 'https://b5aef72d-cab7-41e7-98ad-72b42c9a583f-00-g1lw2e9ri9rr.janeway.replit.dev/'
      : `${window.location.origin}/`
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setSession(null)
    setProfile(null)
    navigate('/')
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id)
            setProfile(profileData)
            
            // If this is a new login (SIGNED_IN event) and no profile exists yet, redirect to profile setup
            if (event === 'SIGNED_IN' && !profileData) {
              navigate('/profile')
            }
          }, 0)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithGoogle,
        signOut,
        updateProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}