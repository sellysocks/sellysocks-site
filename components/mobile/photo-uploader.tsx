"use client"

import type React from "react"

import { useState } from "react"
import { X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PhotoUploaderProps {
  maxPhotos?: number
  onPhotosChange?: (photos: File[]) => void
}

export function PhotoUploader({ maxPhotos = 5, onPhotosChange }: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<File[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })

    const newPhotos = [...photos, ...validFiles].slice(0, maxPhotos)
    setPhotos(newPhotos)
    onPhotosChange?.(newPhotos)
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    onPhotosChange?.(newPhotos)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Photos</h3>
        <label htmlFor="photo-upload">
          <Button
            type="button"
            variant="ghost"
            className="text-[#FF4D8D] hover:bg-[#15161C] text-sm font-medium"
            asChild
          >
            <span>Add Photos</span>
          </Button>
        </label>
      </div>

      <input id="photo-upload" type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />

      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={URL.createObjectURL(photo) || "/placeholder.svg"}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-[#FF4D8D] text-white rounded-full p-1 shadow-lg"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {photos.length < maxPhotos && (
            <label
              htmlFor="photo-upload"
              className={cn(
                "aspect-square border-2 border-dashed border-[#262833] rounded-xl",
                "flex flex-col items-center justify-center cursor-pointer",
                "hover:border-[#FF4D8D] transition-colors",
              )}
            >
              <Camera className="h-6 w-6 text-[#B4B6C2] mb-1" />
              <span className="text-xs text-[#B4B6C2]">Add</span>
            </label>
          )}
        </div>
      ) : (
        <label
          htmlFor="photo-upload"
          className={cn(
            "border-2 border-dashed border-[#262833] rounded-xl p-8",
            "flex flex-col items-center justify-center cursor-pointer",
            "hover:border-[#FF4D8D] transition-colors",
          )}
        >
          <Camera className="h-8 w-8 text-[#B4B6C2] mb-2" />
          <span className="text-sm text-[#B4B6C2] text-center">
            Tap to add photos
            <br />
            <span className="text-xs">JPG/PNG, max 10MB each</span>
          </span>
        </label>
      )}

      <p className="text-xs text-[#B4B6C2]">
        {photos.length} of {maxPhotos} photos added
      </p>
    </div>
  )
}
