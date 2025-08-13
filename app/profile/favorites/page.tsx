"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProfileFavoritesPage() {
  const { profile } = useAuth()
  const router = useRouter()

  // Mock favorites data - in real app this would come from API
  const hasFavorites = false

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-medium">Favorites</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {hasFavorites ? (
          <div className="space-y-4">
            {/* Favorite items would go here */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="text-white font-medium">Sample Favorite</div>
              <div className="text-muted-foreground text-sm">By @creator • $30</div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💖</span>
            </div>
            <div>
              <h2 className="text-white font-medium mb-2">Nothing saved yet</h2>
              <p className="text-muted-foreground text-sm mb-4">Discover unique pieces from your favorite creators</p>
              <Link href="/sellers">
                <Button className="bg-accent hover:bg-accent/90 text-white">Browse creators</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
