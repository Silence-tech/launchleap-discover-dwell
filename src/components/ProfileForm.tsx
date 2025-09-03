import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

interface ProfileFormData {
  username: string
  tagline: string
  bio: string
}

interface ProfileFormProps {
  onSave?: () => void
}

export function ProfileForm({ onSave }: ProfileFormProps) {
  const { profile, updateProfile } = useAuth()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    tagline: '',
    bio: ''
  })
  
  const [isSaving, setIsSaving] = useState(false)

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
    
    if (!formData.username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username.",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)

    try {
      await updateProfile({
        username: formData.username.trim(),
        tagline: formData.tagline.trim() || null,
        bio: formData.bio.trim() || null
      })

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      })
      
      onSave?.()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="Your display name"
          required
        />
        <p className="text-sm text-glass-foreground/60">
          This is how others will see you on Producshine
        </p>
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          type="text"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          placeholder="A short description of what you do"
        />
        <p className="text-sm text-glass-foreground/60">
          A brief description that appears under your name
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us more about yourself..."
          rows={4}
        />
        <p className="text-sm text-glass-foreground/60">
          Share your story, interests, or what you're working on
        </p>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="ml-2">Saving...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </>
        )}
      </Button>
    </form>
  )
}