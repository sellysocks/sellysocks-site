"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Star } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfileReviewsPage() {
  const { profile } = useAuth()
  const router = useRouter()

  const hasReviews = profile?.stats.reviewCount && profile.stats.reviewCount > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-medium">Reviews</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Rating Summary */}
        <div className="bg-card rounded-xl p-4 border border-border mb-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-white mb-1">{profile?.stats.rating || "0.0"}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= (profile?.stats.rating || 0) ? "text-yellow-400 fill-current" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <div className="text-muted-foreground text-sm">{profile?.stats.reviewCount || 0} reviews</div>
          </div>
        </div>

        {hasReviews ? (
          <div className="space-y-4">
            {/* Reviews would go here */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-muted-foreground text-xs">2 days ago</span>
              </div>
              <p className="text-white text-sm">Great seller, item exactly as described!</p>
              <p className="text-muted-foreground text-xs mt-1">@buyer123</p>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h2 className="text-white font-medium mb-2">No reviews yet</h2>
              <p className="text-muted-foreground text-sm">Reviews from buyers will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
