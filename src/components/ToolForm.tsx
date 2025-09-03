import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Upload, X } from "lucide-react"

interface ToolFormData {
  title: string
  description: string
  url: string
  launch_date: string
  is_paid: boolean
  logo: File | null
}

export function ToolForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<ToolFormData>({
    title: '',
    description: '',
    url: '',
    launch_date: new Date().toISOString().split('T')[0],
    is_paid: false,
    logo: null
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      })
      return
    }

    setFormData({ ...formData, logo: file })
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setFormData({ ...formData, logo: null })
    setLogoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a tool.",
        variant: "destructive"
      })
      return
    }

    // Validate form
    if (!formData.title.trim() || !formData.description.trim() || !formData.url.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    // Validate URL format
    try {
      new URL(formData.url)
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      let logoUrl = null

      // Upload logo if provided
      if (formData.logo) {
        const fileExt = formData.logo.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, formData.logo)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(fileName)
        
        logoUrl = publicUrl
      }

      // Insert tool into database
      const { error: insertError } = await supabase
        .from('tools')
        .insert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          url: formData.url.trim(),
          launch_date: formData.launch_date,
          is_paid: formData.is_paid,
          logo_url: logoUrl
        })

      if (insertError) throw insertError

      toast({
        title: "Tool submitted!",
        description: "Your tool has been successfully submitted.",
      })

      // Reset form and navigate
      setFormData({
        title: '',
        description: '',
        url: '',
        launch_date: new Date().toISOString().split('T')[0],
        is_paid: false,
        logo: null
      })
      setLogoPreview(null)
      navigate('/discover')
      
    } catch (error) {
      console.error('Error submitting tool:', error)
      toast({
        title: "Submission failed",
        description: "Failed to submit tool. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Tool Name *</Label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter your tool's name"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what your tool does and who it's for"
          rows={4}
          required
        />
      </div>

      {/* URL */}
      <div className="space-y-2">
        <Label htmlFor="url">Website URL *</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://yourtool.com"
          required
        />
      </div>

      {/* Launch Date */}
      <div className="space-y-2">
        <Label htmlFor="launch_date">Launch Date</Label>
        <Input
          id="launch_date"
          type="date"
          value={formData.launch_date}
          onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
        />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>Logo (Optional)</Label>
        <div className="border-2 border-dashed border-glass-border/40 rounded-xl p-6 text-center">
          {logoPreview ? (
            <div className="relative inline-block">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-20 h-20 rounded-lg object-cover mx-auto"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6"
                onClick={removeLogo}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 text-glass-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-glass-foreground/60 mb-4">
                Drop your logo here or click to browse
              </p>
              <Button type="button" variant="outline">
                <label htmlFor="logo-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
        <p className="text-sm text-glass-foreground/60">
          Accepted formats: PNG, JPG, GIF. Max size: 5MB.
        </p>
      </div>

      {/* Paid Tool Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="is_paid"
          checked={formData.is_paid}
          onCheckedChange={(checked) => setFormData({ ...formData, is_paid: checked })}
        />
        <Label htmlFor="is_paid">This tool has paid features</Label>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="ml-2">Submitting...</span>
          </>
        ) : (
          'Submit Tool'
        )}
      </Button>
    </form>
  )
}