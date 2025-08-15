"use client"

import type React from "react"

import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function HomePage() {
  const { isFavourited, addToFavourites, removeFromFavourites } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [displayedItems, setDisplayedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMoreItems, setHasMoreItems] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const router = useRouter()

  const ITEMS_PER_PAGE = 8

  const fetchItems = async (page = 0, append = false) => {
    const supabase = createClient()

    try {
      const { data: items, error } = await supabase
        .from("items")
        .select(`
          *,
          profiles:seller_id (
            id,
            username,
            avatar_url,
            verified
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)

      if (error) {
        console.error("Error fetching items:", error)
        return
      }

      const formattedItems =
        items?.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          size: item.size,
          condition: item.condition,
          usedFor: item.used_for,
          images: item.images || [],
          seller: {
            id: item.profiles.id,
            name: item.profiles.username,
            avatar: item.profiles.avatar_url,
            verified: item.profiles.verified,
          },
        })) || []

      if (append) {
        setDisplayedItems((prev) => [...prev, ...formattedItems])
      } else {
        setDisplayedItems(formattedItems)
      }

      setHasMoreItems(formattedItems.length === ITEMS_PER_PAGE)
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleFavouriteToggle = async (itemId: string) => {
    try {
      if (isFavourited(itemId)) {
        await removeFromFavourites(itemId)
      } else {
        await addToFavourites(itemId)
      }
    } catch (error) {
      console.error("Error toggling favourite:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchItems(nextPage, true)
  }

  if (loading) {
    return (
      <MobileLayout
        customHeader={
          <div className="flex justify-center py-2">
            <img src="/selly-socks-outline-logo.png" alt="Selly Socks" className="h-8 w-auto" />
          </div>
        }
        showBack={false}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-[#B4B6C2]">Loading items...</div>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout
      customHeader={
        <div className="flex justify-center py-2">
          <img src="/selly-socks-outline-logo.png" alt="Selly Socks" className="h-8 w-auto" />
        </div>
      }
      showBack={false}
    >
      <div className="px-4 mb-4">
        <h1 className="text-lg font-medium text-white text-center">Find your favourite creators used items 😈</h1>
      </div>

      {/* Search & Filters */}
      <div className="px-4 mb-6">
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B4B6C2] h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#15161C] border-[#262833] text-white placeholder:text-[#B4B6C2]"
          />
        </form>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Select defaultValue="">
            <SelectTrigger className="w-24 bg-[#15161C] border-[#262833] text-white">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="bg-[#15161C] border-[#262833]">
              <SelectItem value="xs">XS</SelectItem>
              <SelectItem value="s">S</SelectItem>
              <SelectItem value="m">M</SelectItem>
              <SelectItem value="l">L</SelectItem>
              <SelectItem value="xl">XL</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="">
            <SelectTrigger className="w-32 bg-[#15161C] border-[#262833] text-white">
              <SelectValue placeholder="Used For" />
            </SelectTrigger>
            <SelectContent className="bg-[#15161C] border-[#262833]">
              <SelectItem value="workout">Workout</SelectItem>
              <SelectItem value="date">Date Night</SelectItem>
              <SelectItem value="casual">Casual Wear</SelectItem>
              <SelectItem value="special">Special Occasions</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="">
            <SelectTrigger className="w-24 bg-[#15161C] border-[#262833] text-white">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-[#15161C] border-[#262833]">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured Items Grid */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-white mb-4">Featured Items</h2>

        {displayedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {displayedItems.map((item) => (
                <Card key={item.id} className="bg-[#15161C] border-[#262833] overflow-hidden">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
                      onClick={() => handleFavouriteToggle(item.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${isFavourited(item.id) ? "fill-[#FF4D8D] text-[#FF4D8D]" : "text-white"}`}
                      />
                    </Button>
                  </div>

                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm text-white line-clamp-1">{item.title}</h3>
                      <span className="font-bold text-[#FF4D8D] text-sm">£{item.price}</span>
                    </div>

                    <div className="flex gap-1 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs bg-[#262833] text-[#B4B6C2] border-0">
                        Size {item.size}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-[#262833] text-[#B4B6C2]">
                        {item.condition}
                      </Badge>
                    </div>

                    <div className="text-xs text-[#B4B6C2] mb-2">Used for: {item.usedFor}</div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link href={`/seller/${item.seller.id}`} className="flex items-center gap-2 hover:opacity-80">
                          <img
                            src={item.seller.avatar || "/placeholder.svg"}
                            alt={item.seller.name}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-xs font-medium text-white">{item.seller.name}</span>
                          {item.seller.verified && (
                            <Badge variant="secondary" className="text-xs px-1 bg-[#FF4D8D] text-white border-0">
                              ✓
                            </Badge>
                          )}
                        </Link>
                      </div>

                      <Button size="sm" asChild className="h-7 text-xs bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
                        <Link href={`/item/${item.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMoreItems && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#262833] text-[#B4B6C2] hover:bg-[#15161C] bg-transparent"
                  onClick={handleLoadMore}
                >
                  Load More Items
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-[#B4B6C2] mb-2">No items available yet</div>
            <div className="text-sm text-[#B4B6C2]">Items will appear here once sellers start listing them.</div>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
