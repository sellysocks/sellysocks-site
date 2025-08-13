"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { SectionCard } from "@/components/mobile/section-card"
import { FormField } from "@/components/mobile/form-field"
import { PhotoUploader } from "@/components/mobile/photo-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Globe, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const SIZES = ["XS", "S", "M", "L", "XL", "One Size"]
const CONDITIONS = ["New", "Like New", "Gently Used", "Worn"]
const CATEGORIES = ["Casual", "Athletic", "Designer", "Novelty", "Other"]

interface FormData {
  title: string
  description: string
  price: string
  size: string
  condition: string
  category: string
  brand: string
  color: string
  tags: string[]
  location: string
  visibility: string
}

interface FormErrors {
  title?: string
  description?: string
  price?: string
  photos?: string
}

export default function SellPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    size: "",
    condition: "",
    category: "",
    brand: "",
    color: "",
    tags: [],
    location: "",
    visibility: "public",
  })

  const [photos, setPhotos] = useState<File[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")

  if (!user) {
    return (
      <MobileLayout title="Sign In Required" showBack={false} showPublic={false} showSettings={false} showMenu={false}>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-4">Sign In Required</h2>
          <p className="text-[#B4B6C2] mb-6">You need to be signed in to list items.</p>
          <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </MobileLayout>
    )
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (photos.length === 0) {
      newErrors.photos = "At least one photo is required"
    } else if (photos.length > 5) {
      newErrors.photos = "Maximum 5 photos allowed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      // TODO: Firebase integration - upload photos to Storage and save item to Firestore
      console.log("Form data:", formData)
      console.log("Photos:", photos)

      toast({
        title: "Your item is listed!",
        description: "Your item is now available for purchase.",
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

  const handleSaveDraft = () => {
    // TODO: Save draft to local storage or Firebase
    toast({
      title: "Draft saved",
      description: "Your listing has been saved as a draft.",
    })
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <MobileLayout title="Sell Your Items" subtitle="Share your pre-loved pieces">
      <div className="space-y-4">
        {/* Photo Upload Card */}
        <SectionCard>
          <PhotoUploader maxPhotos={5} onPhotosChange={setPhotos} />
          {errors.photos && <p className="text-sm text-[#FF4D8D] mt-2">{errors.photos}</p>}
        </SectionCard>

        {/* Item Details Card */}
        <SectionCard title="Item Details">
          <div className="space-y-4">
            <FormField label="Title" required error={errors.title}>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Cozy Cotton Ankle Socks"
                className="bg-[#0B0B10] border-[#262833] text-white placeholder:text-[#B4B6C2] rounded-xl"
              />
            </FormField>

            <FormField
              label="Description"
              required
              error={errors.description}
              helper="Describe your item, its history, and what makes it special..."
            >
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell the story of this item..."
                rows={5}
                className="bg-[#0B0B10] border-[#262833] text-white placeholder:text-[#B4B6C2] rounded-xl resize-none"
              />
            </FormField>

            <FormField label="Price" required error={errors.price}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">£</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="25.00"
                  className="bg-[#0B0B10] border-[#262833] text-white placeholder:text-[#B4B6C2] rounded-xl pl-8"
                />
              </div>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Size">
                <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                  <SelectTrigger className="bg-[#0B0B10] border-[#262833] text-white rounded-xl">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#15161C] border-[#262833]">
                    {SIZES.map((size) => (
                      <SelectItem key={size} value={size} className="text-white hover:bg-[#262833]">
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Condition">
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger className="bg-[#0B0B10] border-[#262833] text-white rounded-xl">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#15161C] border-[#262833]">
                    {CONDITIONS.map((condition) => (
                      <SelectItem key={condition} value={condition} className="text-white hover:bg-[#262833]">
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField label="Category">
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-[#0B0B10] border-[#262833] text-white rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#15161C] border-[#262833]">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-[#262833]">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Brand">
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Optional"
                  className="bg-[#0B0B10] border-[#262833] text-white placeholder:text-[#B4B6C2] rounded-xl"
                />
              </FormField>

              <FormField label="Color">
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Optional"
                  className="bg-[#0B0B10] border-[#262833] text-white placeholder:text-[#B4B6C2] rounded-xl"
                />
              </FormField>
            </div>

            <FormField label="Tags" helper="Up to 5 tags">
              <div className="space-y-3">
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-[#FF4D8D] text-white hover:bg-[#FF4D8D]/90 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag and press Enter"
                  disabled={formData.tags.length >= 5}
                  className="bg-[#0B0B10] border-[#262833] text-white placeholder:text-[#B4B6C2] rounded-xl"
                />
              </div>
            </FormField>

            <FormField label="Location">
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Optional"
                className="bg-[#0B0B10] border-[#262833] text-white placeholder:text-[#B4B6C2] rounded-xl"
              />
            </FormField>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-[#B4B6C2]" />
                <span className="text-white font-medium">Visibility</span>
              </div>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value })}
              >
                <SelectTrigger className="w-auto bg-transparent border-none text-[#FF4D8D] p-0 h-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#15161C] border-[#262833]">
                  <SelectItem value="public" className="text-white hover:bg-[#262833]">
                    Public
                  </SelectItem>
                  <SelectItem value="followers" className="text-white hover:bg-[#262833]">
                    Followers Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-[#0B0B10] border-t border-[#262833]">
        <div className="max-w-md mx-auto flex space-x-3">
          <Button
            variant="ghost"
            onClick={handleSaveDraft}
            className="flex-1 text-[#B4B6C2] hover:text-white hover:bg-[#15161C] rounded-xl"
          >
            Save Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white rounded-xl font-medium"
          >
            {loading ? "Listing..." : "List Item"}
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
