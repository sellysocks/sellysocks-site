"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Mock items data - in real app this would come from API
const itemsData = {
  "1": {
    id: "1",
    title: "Cozy Cotton Socks",
    price: 25,
    image: "/cozy-cotton-socks.png",
    seller: "Emma",
  },
  "2": {
    id: "2",
    title: "Silk Stockings",
    price: 45,
    image: "/silk-stockings.png",
    seller: "Sophie",
  },
  "3": {
    id: "3",
    title: "Athletic Ankle Socks",
    price: 18,
    image: "/placeholder-niqvm.png",
    seller: "Maya",
  },
}

const creatorsData = {
  "emma-rose": {
    id: "emma-rose",
    name: "Emma Rose",
    displayName: "Emma",
    avatar: "/diverse-woman-avatar.png",
    verified: true,
    stats: { rating: 4.9, reviewCount: 23, itemsSold: 47 },
  },
  "sophie-luxe": {
    id: "sophie-luxe",
    name: "Sophie Luxe",
    displayName: "Sophie",
    avatar: "/woman-avatar-3.png",
    verified: true,
    stats: { rating: 4.8, reviewCount: 67, itemsSold: 89 },
  },
}

export default function ProfileFavoritesPage() {
  const { profile, removeFromFavourites, removeCreatorFromFavourites } = useAuth()
  const router = useRouter()

  const favouriteItems = (profile?.favourites || [])
    .map((id) => itemsData[id as keyof typeof itemsData])
    .filter(Boolean)

  const favouriteCreators = (profile?.favouriteCreators || [])
    .map((id) => creatorsData[id as keyof typeof creatorsData])
    .filter(Boolean)

  const hasFavorites = favouriteItems.length > 0 || favouriteCreators.length > 0

  const handleRemoveFavourite = async (itemId: string) => {
    try {
      await removeFromFavourites(itemId)
    } catch (error) {
      console.error("Error removing favourite:", error)
    }
  }

  const handleRemoveCreatorFavourite = async (creatorId: string) => {
    try {
      await removeCreatorFromFavourites(creatorId)
    } catch (error) {
      console.error("Error removing creator favourite:", error)
    }
  }

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
          <div className="space-y-6">
            {favouriteCreators.length > 0 && (
              <div>
                <h2 className="text-white font-medium mb-3">Favourite Creators</h2>
                <div className="space-y-3">
                  {favouriteCreators.map((creator) => (
                    <div key={creator.id} className="bg-card rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-3">
                        <img
                          src={creator.avatar || "/placeholder.svg"}
                          alt={creator.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <Link href={`/seller/${creator.id}`}>
                            <div className="text-white font-medium hover:text-accent flex items-center gap-2">
                              {creator.displayName}
                              {creator.verified && <span className="text-[#FF4D8D] text-sm">✓</span>}
                            </div>
                          </Link>
                          <div className="text-muted-foreground text-sm">
                            {creator.stats.rating} ⭐ • {creator.stats.itemsSold} sold
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCreatorFavourite(creator.id)}
                          className="text-muted-foreground hover:text-white p-2"
                        >
                          <Heart className="h-4 w-4 fill-[#FF4D8D] text-[#FF4D8D]" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favourite Items */}
            {favouriteItems.length > 0 && (
              <div>
                <h2 className="text-white font-medium mb-3">Favourite Items</h2>
                <div className="space-y-4">
                  {favouriteItems.map((item) => (
                    <div key={item.id} className="bg-card rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <Link href={`/item/${item.id}`}>
                            <div className="text-white font-medium hover:text-accent">{item.title}</div>
                          </Link>
                          <div className="text-muted-foreground text-sm">
                            By @{item.seller} • £{item.price}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFavourite(item.id)}
                          className="text-muted-foreground hover:text-white p-2"
                        >
                          <Heart className="h-4 w-4 fill-[#FF4D8D] text-[#FF4D8D]" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
