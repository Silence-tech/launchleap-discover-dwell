import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, Globe, Calendar as CalendarIcon, DollarSign, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function Submit() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    websiteUrl: "",
    launchDate: undefined as Date | undefined,
    isPaid: false,
    logo: null as File | null,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a tool.",
      })
      navigate('/')
    }
  }, [user, loading, navigate, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🚀 Form submission started')
    
    if (!user) {
      console.error('❌ No user found, cannot submit')
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a tool.",
        variant: "destructive"
      })
      return
    }
    
    setSubmitting(true)
    console.log('⏳ Setting submitting state to true')

    try {
      let logoUrl = null
      
      // Upload logo if provided
      if (formData.logo) {
        console.log('📁 Starting logo upload:', formData.logo.name)
        
        const fileExt = formData.logo.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        
        console.log('📤 Uploading logo with filename:', fileName)
        
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, formData.logo)
          
        if (uploadError) {
          console.error('❌ Logo upload failed:', uploadError)
          throw new Error(`Logo upload failed: ${uploadError.message}`)
        }
        
        console.log('✅ Logo uploaded successfully')
        
        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(fileName)
          
        logoUrl = publicUrl
        console.log('🔗 Logo public URL generated:', logoUrl)
      } else {
        console.log('📄 No logo provided, proceeding without logo')
      }

      // Insert tool record
      console.log('💾 Inserting tool record into database')
      
      const toolData = {
        title: formData.name,
        description: formData.description,
        url: formData.websiteUrl,
        launch_date: formData.launchDate ? format(formData.launchDate, 'yyyy-MM-dd') : null,
        is_paid: formData.isPaid,
        logo_url: logoUrl,
        user_id: user.id
      }
      
      console.log('📋 Tool data to insert:', toolData)
      
      const { error: insertError, data: insertedData } = await supabase
        .from('tools')
        .insert(toolData)
        .select()

      if (insertError) {
        console.error('❌ Database insertion failed:', insertError)
        throw new Error(`Database insertion failed: ${insertError.message}`)
      }
      
      console.log('✅ Tool successfully inserted:', insertedData)

      toast({
        title: "Tool submitted successfully!",
        description: "Your tool has been added to Producshine.",
      })

      console.log('🧹 Resetting form data')
      
      // Reset form and clear file input
      setFormData({
        name: "",
        description: "",
        websiteUrl: "",
        launchDate: undefined,
        isPaid: false,
        logo: null,
      })
      
      // Clear file input specifically
      const fileInput = document.getElementById('logo') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
        console.log('🗑️ File input cleared')
      }
      
      console.log('🎯 Navigating to discover page')
      navigate('/discover')
      
    } catch (error: any) {
      console.error('💥 Submission error caught:', error)
      
      let errorMessage = "Failed to submit tool. Please try again."
      
      if (error.message) {
        if (error.message.includes('Logo upload failed')) {
          errorMessage = "Logo upload failed. Please check your file and try again."
        } else if (error.message.includes('Database insertion failed')) {
          errorMessage = "Failed to save your tool. Please check your information and try again."
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      console.log('🏁 Setting submitting state to false')
      setSubmitting(false)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
      
      setFormData(prev => ({ ...prev, logo: file }))
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value.trim()
    
    // Auto-format URL if it doesn't start with protocol
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it's a valid domain-like format
      if (url.includes('.') || url.includes('localhost')) {
        url = `https://${url}`
      }
    }
    
    setFormData(prev => ({ ...prev, websiteUrl: url }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-glass/20 backdrop-blur-xl border border-glass-border/30 rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-glass-foreground">Share Your Innovation</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Submit Your Tool
          </h1>
          <p className="text-xl text-glass-foreground/80 max-w-2xl mx-auto">
            Join the community of innovators and showcase your creation to thousands of potential users.
          </p>
        </div>

        {/* Form */}
        <div className="bg-gradient-card backdrop-blur-xl border border-glass-border/30 rounded-3xl p-8 shadow-glass">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tool Name */}
            <div>
              <Label htmlFor="name" className="text-lg font-semibold text-glass-foreground mb-2 block">
                Tool Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your tool's name"
                className="h-12 bg-glass/30 backdrop-blur-sm border-glass-border/40"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-lg font-semibold text-glass-foreground mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what your tool does and why it's amazing..."
                className="min-h-[120px] bg-glass/30 backdrop-blur-sm border-glass-border/40"
                required
              />
            </div>

            {/* Website URL */}
            <div>
              <Label htmlFor="websiteUrl" className="text-lg font-semibold text-glass-foreground mb-2 block">
                <Globe className="w-5 h-5 inline mr-2" />
                Website URL
              </Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleUrlChange}
                placeholder="your-tool.com (https:// will be added automatically)"
                className="h-12 bg-glass/30 backdrop-blur-sm border-glass-border/40"
                required
              />
              <p className="text-sm text-glass-foreground/60 mt-1">
                Just enter your domain - we'll add https:// automatically
              </p>
            </div>

            {/* Launch Date */}
            <div>
              <Label className="text-lg font-semibold text-glass-foreground mb-2 block">
                <CalendarIcon className="w-5 h-5 inline mr-2" />
                Launch Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal bg-glass/30 backdrop-blur-sm border-glass-border/40 hover:bg-glass/40",
                      !formData.launchDate && "text-glass-foreground/60"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.launchDate ? (
                      format(formData.launchDate, "PPP")
                    ) : (
                      <span>Pick your launch date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gradient-card backdrop-blur-xl border border-glass-border/30" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.launchDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, launchDate: date }))}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Logo Upload */}
            <div>
              <Label htmlFor="logo" className="text-lg font-semibold text-glass-foreground mb-2 block">
                <Upload className="w-5 h-5 inline mr-2" />
                Logo
              </Label>
              <div className="relative">
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="sr-only"
                />
                <Label 
                  htmlFor="logo" 
                  className="flex items-center justify-center h-32 bg-glass/20 backdrop-blur-sm border-2 border-dashed border-glass-border/40 rounded-xl cursor-pointer hover:bg-glass/30 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-glass-foreground/60 mx-auto mb-2" />
                    <p className="text-glass-foreground/80">
                      {formData.logo ? formData.logo.name : "Click to upload logo"}
                    </p>
                    <p className="text-sm text-glass-foreground/60">PNG, JPG up to 5MB</p>
                  </div>
                </Label>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between p-4 bg-glass/20 backdrop-blur-sm rounded-xl border border-glass-border/30">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-glass-foreground" />
                <div>
                  <div className="font-semibold text-glass-foreground">Paid Tool</div>
                  <div className="text-sm text-glass-foreground/60">Is your tool a paid service?</div>
                </div>
              </div>
              <Switch
                checked={formData.isPaid}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: checked }))}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                type="submit" 
                variant="hero" 
                size="hero" 
                className="w-full"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current mr-2"></div>
                ) : (
                  <Sparkles className="w-6 h-6 mr-2" />
                )}
                {submitting ? 'Submitting...' : 'Launch Your Tool'}
              </Button>
              
              <p className="text-center text-sm text-glass-foreground/60 mt-4">
                By submitting, you agree to our terms and conditions
              </p>
            </div>
          </form>
        </div>

        {/* Requirements Note */}
        <div className="mt-8 p-6 bg-glass/10 backdrop-blur-sm border border-glass-border/20 rounded-2xl">
          <h3 className="font-semibold text-glass-foreground mb-2">Submission Guidelines</h3>
          <ul className="text-sm text-glass-foreground/70 space-y-1">
            <li>• Your tool should be live and accessible</li>
            <li>• Provide a clear, descriptive name and description</li>
            <li>• Logo should be high-quality (PNG/JPG, max 5MB)</li>
            <li>• All submissions are reviewed before going live</li>
          </ul>
        </div>
      </div>
    </div>
  )
}