"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Star } from "lucide-react"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { useToast } from "@/hooks/use-toast"

// Mock order data - in real app this would come from API
const getOrderById = (orderId: string) => {
  const orders = [
    {
      id: "order-1",
      itemId: "1",
      itemName: "Cozy Cotton Socks",
      itemImage: "/cozy-cotton-socks.png",
      price: 25,
      seller: "Emma Rose",
      sellerId: "emmarose",
    },
  ]
  return orders.find((order) => order.id === orderId)
}

export default function ReviewPage({ params }: { params: { orderId: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const order = getOrderById(params.orderId)

  if (!order) {
    return (
      <MobileLayout>
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-white mb-2">Order not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </MobileLayout>
    )
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback",
      })
      setIsSubmitting(false)
      router.push("/profile/orders")
    }, 1000)
  }

  return (
    <MobileLayout
      customHeader={
        <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-white">Write Review</h1>
          <div className="w-10" />
        </div>
      }
    >
      <div className="p-4 space-y-6">
        {/* Item Info */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={order.itemImage || "/placeholder.svg"}
                alt={order.itemName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{order.itemName}</h3>
              <p className="text-sm text-muted-foreground">by {order.seller}</p>
              <p className="text-sm font-semibold text-white">£{order.price}</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Rate this item</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="p-1">
                <Star
                  className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {rating === 0 && "Tap to rate"}
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>
        </div>

        {/* Review Text */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Write your review</h3>
          <Textarea
            placeholder="Share your experience with this item..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[120px] bg-card border-border text-white placeholder:text-muted-foreground"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitReview}
          disabled={isSubmitting || rating === 0}
          className="w-full bg-accent hover:bg-accent/90 text-white"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </MobileLayout>
  )
}
