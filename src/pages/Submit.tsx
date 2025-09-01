import { useState } from "react"
import { Upload, Globe, Calendar, DollarSign, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function Submit() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    websiteUrl: "",
    launchDate: "",
    isPaid: false,
    logo: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submit tool:", formData)
    // TODO: Implement tool submission with Supabase
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }))
    }
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
                onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                placeholder="https://your-tool.com"
                className="h-12 bg-glass/30 backdrop-blur-sm border-glass-border/40"
                required
              />
            </div>

            {/* Launch Date */}
            <div>
              <Label htmlFor="launchDate" className="text-lg font-semibold text-glass-foreground mb-2 block">
                <Calendar className="w-5 h-5 inline mr-2" />
                Launch Date
              </Label>
              <Input
                id="launchDate"
                type="date"
                value={formData.launchDate}
                onChange={(e) => setFormData(prev => ({ ...prev, launchDate: e.target.value }))}
                className="h-12 bg-glass/30 backdrop-blur-sm border-glass-border/40"
                required
              />
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
                    <p className="text-sm text-glass-foreground/60">PNG, JPG up to 2MB</p>
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
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Launch Your Tool
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
            <li>• Logo should be high-quality (PNG/JPG, max 2MB)</li>
            <li>• All submissions are reviewed before going live</li>
          </ul>
        </div>
      </div>
    </div>
  )
}