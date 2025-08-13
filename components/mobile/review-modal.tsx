"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  order: {
    id: string
    itemId: string
    itemTitle: string
    itemImage: string
    sellerName: string
    sellerId: string
    price: number
  }
  onReviewSubmitted: () => void
}

export function ReviewModal({ isOpen, onClose, order, onReviewSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { profile } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!profile || rating === 0) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          sellerId: order.sellerId,
          itemId: order.itemId,
          rating,
          comment: comment.trim(),
          reviewerId: profile.uid,
          reviewerName: profile.displayName || "Anonymous",
          reviewerAvatar: profile.avatar,
        }),
      })

      if (response.ok) {
        onReviewSubmitted()
        onClose()
        // Reset form
        setRating(0)
        setComment("")
      } else {
        console.error("Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-[#15161C] border-[#262833]">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Write a Review</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-[#B4B6C2] hover:text-white p-1">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Item Info */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-[#0A0B0F] rounded-lg">
            <img
              src={order.itemImage || "/placeholder.svg"}
              alt={order.itemTitle}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-white text-sm">{order.itemTitle}</h3>
              <p className="text-xs text-[#B4B6C2]">Sold by {order.sellerName}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-[#B4B6C2]"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Comment <span className="text-[#B4B6C2]">(optional)</span>
            </label>
            <Textarea
              placeholder="Share your experience with this seller..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-[#0A0B0F] border-[#262833] text-white placeholder:text-[#B4B6C2] resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-[#B4B6C2] mt-1">{comment.length}/500</div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
