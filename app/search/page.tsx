"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { ItemCardSkeleton } from "@/components/ui/loading-skeleton"
import { Search, Heart, Filter } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface SearchResult {
  id: string
  title: string
  price: number
  size: string
  condition: string
  usedFor: string
  images: string[]
  seller: {
    id: string
    name: string
    avatar: string
    verified: boolean
  }
  category: string
  tags: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isFavourited, addToFavourites, removeFromFavourites } = useAuth()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    size: searchParams.get("size") || "all",
    condition: searchParams.get("condition") || "all",
    usedFor: searchParams.get("usedFor") || "all",
    sortBy: searchParams.get("sortBy") || "newest",
  })
  const [showFilters, setShowFilters] = useState(false)

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      let query = supabase
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

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`,
        )
      }

      if (filters.size !== "all") {
        query = query.eq("size", filters.size.toUpperCase())
      }

      if (filters.condition !== "all") {
        query = query.eq("condition", filters.condition.replace("-", " "))
      }

      if (filters.usedFor !== "all") {
        query = query.eq("used_for", filters.usedFor.replace("-", " "))
      }

      switch (filters.sortBy) {
        case "price-low":
          query = query.order("price", { ascending: true })
          break
        case "price-high":
          query = query.order("price", { ascending: false })
          break
        case "popular":
          query = query.order("view_count", { ascending: false })
          break
        case "rating":
          query = query.order("profiles(rating)", { ascending: false })
          break
        case "newest":
        default:
          query = query.order("created_at", { ascending: false })
          break
      }

      const { data: items, error } = await query.limit(50)

      if (error) {
        console.error("Search error:", error)
        return
      }

      const formattedResults: SearchResult[] =
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
          category: item.category,
          tags: item.tags || [],
        })) || []

      setResults(formattedResults)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filters])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams({
        q: searchQuery,
        ...filters,
      })
      router.push(`/search?${params}`)
      performSearch()
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    const params = new URLSearchParams({
      q: searchQuery,
      ...newFilters,
    })
    router.push(`/search?${params}`)
  }

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

  return (
    <MobileLayout title="Search" subtitle="Find your perfect items" showBackButton={true}>
      {/* Search Bar */}
      <div className="px-4 mb-4 animate-fade-in">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B4B6C2] h-4 w-4" />
          <Input
            placeholder="Search items, sellers, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#15161C] border-[#262833] text-white placeholder:text-[#B4B6C2] mobile-input"
          />
        </form>
      </div>

      {/* Filters Toggle */}
      <div className="px-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent transition-all duration-200 active:scale-95"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 mb-6 animate-slide-up">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Select value={filters.size} onValueChange={(value) => handleFilterChange("size", value)}>
              <SelectTrigger className="bg-[#15161C] border-[#262833] text-white">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent className="bg-[#15161C] border-[#262833]">
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="s">S</SelectItem>
                <SelectItem value="m">M</SelectItem>
                <SelectItem value="l">L</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.condition} onValueChange={(value) => handleFilterChange("condition", value)}>
              <SelectTrigger className="bg-[#15161C] border-[#262833] text-white">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent className="bg-[#15161C] border-[#262833]">
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="gently-used">Gently Used</SelectItem>
                <SelectItem value="well-loved">Well Loved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.usedFor} onValueChange={(value) => handleFilterChange("usedFor", value)}>
              <SelectTrigger className="bg-[#15161C] border-[#262833] text-white">
                <SelectValue placeholder="Used For" />
              </SelectTrigger>
              <SelectContent className="bg-[#15161C] border-[#262833]">
                <SelectItem value="all">All Uses</SelectItem>
                <SelectItem value="workout">Workout</SelectItem>
                <SelectItem value="date-night">Date Night</SelectItem>
                <SelectItem value="casual">Casual Wear</SelectItem>
                <SelectItem value="special">Special Occasions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
              <SelectTrigger className="bg-[#15161C] border-[#262833] text-white">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-[#15161C] border-[#262833]">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="px-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        ) : searchQuery && results.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-[#B4B6C2] mb-4">No results found for "{searchQuery}"</div>
            <div className="text-sm text-[#B4B6C2] mb-6">Try different keywords or adjust your filters</div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilters({
                  size: "all",
                  condition: "all",
                  usedFor: "all",
                  sortBy: "newest",
                })
              }}
              className="border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent mobile-button-secondary"
            >
              Clear Search
            </Button>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4 animate-fade-in">
              <h2 className="text-lg font-semibold text-white">
                {results.length} result{results.length !== 1 ? "s" : ""} for "{searchQuery}"
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {results.map((item, index) => (
                <Card
                  key={item.id}
                  className="bg-[#15161C] border-[#262833] overflow-hidden mobile-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <OptimizedImage src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 transition-all duration-200 active:scale-90 touch-friendly"
                      onClick={() => handleFavouriteToggle(item.id)}
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors duration-200 ${isFavourited(item.id) ? "fill-[#FF4D8D] text-[#FF4D8D]" : "text-white"}`}
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
                          <OptimizedImage
                            src={item.seller.avatar}
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

                      <Button
                        size="sm"
                        asChild
                        className="h-7 text-xs bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white mobile-button-primary touch-friendly"
                      >
                        <Link href={`/item/${item.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-[#B4B6C2] mb-4">Start searching to find amazing items</div>
            <div className="text-sm text-[#B4B6C2]">Try searching for "socks", "silk", or browse by category</div>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
