"use client"

import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Heart } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function SellersPage() {
  const { isCreatorFavourited, addCreatorToFavourites, removeCreatorFromFavourites } = useAuth()
  const [sellers, setSellers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    const fetchSellers = async () => {
      const supabase = createClient()

      try {
        let query = supabase.from("profiles").select(`
            *,
            items!inner (
              id,
              status
            )
          `)

        // Apply filters
        if (verifiedFilter === "verified") {
          query = query.eq("verified", true)
        }

        if (searchQuery.trim()) {
          query = query.or(
            `username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`,
          )
        }

        // Apply sorting
        switch (sortBy) {
          case "rating":
            query = query.order("rating", { ascending: false })
            break
          case "sales":
            query = query.order("items_sold", { ascending: false })
            break
          case "newest":
            query = query.order("created_at", { ascending: false })
            break
          case "items":
            // This would need a more complex query to count active items
            query = query.order("created_at", { ascending: false })
            break
        }

        const { data: sellersData, error } = await query.limit(20)

        if (error) {
          console.error("Error fetching sellers:", error)
          return
        }

        const processedSellers =
          sellersData?.map((seller) => ({
            ...seller,
            itemCount: seller.items?.filter((item: any) => item.status === "active").length || 0,
          })) || []

        setSellers(processedSellers)
      } catch (error) {
        console.error("Error fetching sellers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSellers()
  }, [searchQuery, verifiedFilter, sortBy])

  const handleCreatorFavouriteToggle = async (sellerId: string) => {
    try {
      if (isCreatorFavourited(sellerId)) {
        await removeCreatorFromFavourites(sellerId)
      } else {
        await addCreatorToFavourites(sellerId)
      }
    } catch (error) {
      console.error("Error toggling creator favourite:", error)
    }
  }

  if (loading) {
    return (
      <MobileLayout title="Meet the Sellers" subtitle="Discover amazing creators and their stories">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#B4B6C2]">Loading sellers...</div>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout title="Meet the Sellers" subtitle="Discover amazing creators and their stories">
      {/* Search & Filters */}
      <div className="px-4 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B4B6C2] h-4 w-4" />
          <Input
            placeholder="Search sellers..."
            className="pl-10 bg-[#15161C] border-[#262833] text-white placeholder:text-[#B4B6C2]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger className="w-28 bg-[#15161C] border-[#262833] text-white">
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent className="bg-[#15161C] border-[#262833]">
              <SelectItem value="all">All Sellers</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-28 bg-[#15161C] border-[#262833] text-white">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-[#15161C] border-[#262833]">
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="sales">Most Sales</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="items">Most Items</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="px-4">
        {sellers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {sellers.map((seller) => (
              <Card key={seller.id} className="bg-[#15161C] border-[#262833] overflow-hidden">
                <CardContent className="p-4">
                  {/* Avatar & Basic Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={seller.avatar_url || "/placeholder.svg"}
                        alt={seller.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {seller.verified && (
                        <Badge className="absolute -top-1 -right-1 bg-[#FF4D8D] text-white px-1 text-xs border-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-lg mb-1">{seller.username || seller.full_name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-white">{seller.rating || 0}</span>
                        <span className="text-sm text-[#B4B6C2]">({seller.review_count || 0})</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#B4B6C2]">
                        <span>{seller.items_sold || 0} sold</span>
                        <span>{seller.itemCount} available</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent"
                      onClick={() => handleCreatorFavouriteToggle(seller.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${isCreatorFavourited(seller.id) ? "fill-[#FF4D8D] text-[#FF4D8D]" : ""}`}
                      />
                    </Button>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-[#B4B6C2] mb-3 line-clamp-2">
                    {seller.bio || "This seller hasn't added a bio yet."}
                  </p>

                  {/* Tags */}
                  {seller.tags && seller.tags.length > 0 && (
                    <div className="flex gap-1 mb-3 flex-wrap">
                      {seller.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-[#262833] text-[#B4B6C2] border-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Action */}
                  <Button asChild className="w-full bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
                    <Link href={`/seller/${seller.id}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-[#B4B6C2] mb-2">No sellers found</div>
            <div className="text-sm text-[#B4B6C2]">
              {searchQuery
                ? "Try adjusting your search terms."
                : "Sellers will appear here once they join the platform."}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
