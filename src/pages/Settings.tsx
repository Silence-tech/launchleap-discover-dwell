import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export function Settings() {
  const { user, profile, loading, updateProfile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    username: '',
    tagline: '',
    bio: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        tagline: profile.tagline || '',
        bio: profile.bio || ''
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateProfile({
        username: formData.username,
        tagline: formData.tagline,
        bio: formData.bio
      })

      toast({
        title: 'Profile updated!',
        description: 'Your profile has been successfully updated.',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

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
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-xl text-glass-foreground/80">
            Update your profile information and preferences
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-8 shadow-cosmic">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4 pb-6 border-b border-glass-border/30">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-glass-border/30"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-cosmic rounded-xl shadow-glow flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-glass-foreground">Profile Picture</h3>
                <p className="text-sm text-glass-foreground/60">
                  Avatar management coming soon
                </p>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-glass-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Your display name"
                className="bg-glass/30 backdrop-blur-sm border-glass-border/40"
              />
              <p className="text-sm text-glass-foreground/60">
                This is how others will see you on LaunchLeap
              </p>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline" className="text-glass-foreground">
                Tagline
              </Label>
              <Input
                id="tagline"
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="A short description of what you do"
                className="bg-glass/30 backdrop-blur-sm border-glass-border/40"
              />
              <p className="text-sm text-glass-foreground/60">
                A brief description that appears under your name
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-glass-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us more about yourself..."
                rows={4}
                className="bg-glass/30 backdrop-blur-sm border-glass-border/40 resize-none"
              />
              <p className="text-sm text-glass-foreground/60">
                Share your story, interests, or what you're working on
              </p>
            </div>

            {/* Account Info */}
            <div className="space-y-4 pt-6 border-t border-glass-border/30">
              <h3 className="text-lg font-semibold text-glass-foreground">Account Information</h3>
              <div className="bg-glass/20 backdrop-blur-sm border border-glass-border/30 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-glass-foreground">Email</p>
                    <p className="text-sm text-glass-foreground/60">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}