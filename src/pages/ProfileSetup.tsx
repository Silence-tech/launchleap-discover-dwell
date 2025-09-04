import { ProfileForm } from "@/components/ProfileForm"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export function ProfileSetup() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const handleSave = () => {
    if (profile?.username) {
      navigate(`/profile/${profile.username}`)
    } else {
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-xl text-glass-foreground/80">
            Set up your profile to start sharing and discovering amazing tools
          </p>
        </div>

        <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-2xl p-8 shadow-glass">
          <ProfileForm onSave={handleSave} />
        </div>
      </div>
    </div>
  )
}