"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfilePictureUploaderProps {
  currentImage?: string
  onImageChange: (imageUrl: string | null) => void
  size?: "sm" | "md" | "lg"
}

export function ProfilePictureUploader({ currentImage, onImageChange, size = "lg" }: ProfilePictureUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setPreview(imageUrl)
        onImageChange(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer overflow-hidden bg-card`}
          onClick={handleClick}
        >
          {preview ? (
            <img src={preview || "/placeholder.svg"} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {preview && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={handleClick} className="text-accent hover:text-accent/80">
          {preview ? "Change Photo" : "Add Photo"}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}
