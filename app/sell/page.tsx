"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"
import Link from "next/link"

const PRESET_USED_FOR = [
  "Workout Sessions",
  "Date Night",
  "Running",
  "Yoga Practice",
  "Special Occasions",
  "Casual Wear",
  "Sleep",
  "Dancing",
  "Travel",
  "Work",
]

const CONDITIONS = [
  { value: "new", label: "New with Tags" },
  { value: "like-new", label: "Like New" },
  { value: "gently-used", label: "Gently Used" },
  { value: "well-loved", label: "Well Loved" },
  { value: "vintage", label: "Vintage" },
]

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]

export default function SellPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    size: "",
    condition: "",
    usedFor: "",
    customUsedFor: "",
    tags: [] as string[],
    category: "socks",
    material: "",
    care: "",
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)
  const [showPolicyModal, setShowPolicyModal] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to list items.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images.",
        variant: "destructive",
      })
      return
    }

    setImages([...images, ...files])

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedPolicy) {
      setShowPolicyModal(true)
      return
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your item.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Here you would upload images to Firebase Storage and create the item in Firestore
      // For now, we'll just show a success message
      toast({
        title: "Item listed successfully!",
        description: "Your item is now live and available for purchase.",
      })
      router.push("/sales")
    } catch (error) {
      toast({
        title: "Failed to list item",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">List Your Item</h1>
          <p className="text-muted-foreground">
            Share your personal pieces with the community. Keep it spicy, not explicit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Upload up to 5 high-quality photos of your item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Add Photo</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Cozy Cotton Socks"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell the story of this item. What makes it special? How was it used?"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (£) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="25.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="size">Size *</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Used For */}
          <Card>
            <CardHeader>
              <CardTitle>Used For</CardTitle>
              <CardDescription>What activities or occasions was this item worn for?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PRESET_USED_FOR.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={formData.usedFor === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, usedFor: preset, customUsedFor: "" })}
                  >
                    {preset}
                  </Button>
                ))}
              </div>

              <div>
                <Label htmlFor="customUsedFor">Or describe custom usage</Label>
                <Input
                  id="customUsedFor"
                  value={formData.customUsedFor}
                  onChange={(e) => setFormData({ ...formData, customUsedFor: e.target.value, usedFor: e.target.value })}
                  placeholder="Describe how you used this item..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g., 100% Cotton, Silk Blend"
                />
              </div>

              <div>
                <Label htmlFor="care">Care Instructions</Label>
                <Input
                  id="care"
                  value={formData.care}
                  onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                  placeholder="e.g., Machine wash cold, air dry"
                />
              </div>

              <div>
                <Label>Tags (up to 5)</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add tags (press Enter)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value) {
                        addTag(value)
                        e.currentTarget.value = ""
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Policy Agreement */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="policy"
                  checked={acceptedPolicy}
                  onCheckedChange={(checked) => setAcceptedPolicy(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="policy" className="text-sm font-medium">
                    I confirm that this item complies with our{" "}
                    <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-sm underline">
                          Content Policy
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Content Policy</DialogTitle>
                          <DialogDescription>
                            Please read and understand our community guidelines before listing your item.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-sm">
                          <div>
                            <h3 className="font-medium mb-2">Allowed Content</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>Used clothing items in good condition</li>
                              <li>Tasteful, suggestive content that maintains dignity</li>
                              <li>Items with personal stories and authentic experiences</li>
                              <li>Clean, well-photographed items</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Prohibited Content</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>Explicit nudity or pornographic content</li>
                              <li>Items that haven't been properly cleaned</li>
                              <li>Counterfeit or stolen goods</li>
                              <li>Items that violate local laws</li>
                              <li>Harassment or discriminatory content</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Quality Standards</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>High-quality photos showing the actual item</li>
                              <li>Honest descriptions of condition and usage</li>
                              <li>Appropriate pricing for the item's condition</li>
                              <li>Respectful communication with buyers</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                          <Button variant="outline" onClick={() => setShowPolicyModal(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              setAcceptedPolicy(true)
                              setShowPolicyModal(false)
                            }}
                          >
                            I Understand & Agree
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    *
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    By listing this item, you agree to our community standards and content guidelines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !acceptedPolicy}>
              {loading ? "Listing..." : "List Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
