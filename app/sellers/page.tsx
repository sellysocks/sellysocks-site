"use client"

import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Heart } from "lucide-react"
import Link from "next/link"

// Mock sellers data
const sellers = [
  {
    id: "emma-rose",
    name: "Emma Rose",
    displayName: "Emma",
    avatar: "/diverse-woman-avatar.png",
    bio: "Fitness enthusiast sharing my workout essentials. Every item has been part of my daily routine.",
    verified: true,
    stats: {
      itemsSold: 47,
      rating: 4.9,
      reviewCount: 23,
      joinedDate: "2024-01-15",
    },
    tags: ["Fitness", "Cotton", "Athletic"],
    itemCount: 12,
  },
  {
    id: "sophie-luxe",
    name: "Sophie Luxe",
    displayName: "Sophie",
    avatar: "/woman-avatar-2.png",
    bio: "Luxury lingerie collector. I curate the finest pieces and share them with those who appreciate quality.",
    verified: false,
    stats: {
      itemsSold: 23,
      rating: 4.7,
      reviewCount: 15,
      joinedDate: "2024-02-20",
    },
    tags: ["Luxury", "Silk", "Lingerie"],
    itemCount: 8,
  },
  {
    id: "maya-active",
    name: "Maya Active",
    displayName: "Maya",
    avatar: "/woman-avatar-3.png",
    bio: "Marathon runner and yoga instructor. My items have supported me through countless miles and poses.",
    verified: true,
    stats: {
      itemsSold: 89,
      rating: 5.0,
      reviewCount: 41,
      joinedDate: "2023-11-10",
    },
    tags: ["Running", "Yoga", "Performance"],
    itemCount: 18,
  },
  {
    id: "aria-elegant",
    name: "Aria Elegant",
    displayName: "Aria",
    avatar: "/woman-avatar-4.png",
    bio: "Fashion model sharing pieces from photoshoots and special events. Each item tells a story.",
    verified: true,
    stats: {
      itemsSold: 156,
      rating: 4.8,
      reviewCount: 78,
      joinedDate: "2023-08-05",
    },
    tags: ["Fashion", "Designer", "Events"],
    itemCount: 25,
  },
  {
    id: "luna-cozy",
    name: "Luna Cozy",
    displayName: "Luna",
    avatar: "/curly-haired-woman.png",
    bio: "Homebody who loves soft, comfortable pieces. Perfect for those who appreciate the cozy life.",
    verified: false,
    stats: {
      itemsSold: 34,
      rating: 4.6,
      reviewCount: 19,
      joinedDate: "2024-03-12",
    },
    tags: ["Cozy", "Soft", "Comfort"],
    itemCount: 9,
  },
  {
    id: "zara-bold",
    name: "Zara Bold",
    displayName: "Zara",
    avatar: "/confident-short-hair-woman.png",
    bio: "Bold and adventurous. My collection reflects my daring lifestyle and love for unique experiences.",
    verified: true,
    stats: {
      itemsSold: 67,
      rating: 4.9,
      reviewCount: 32,
      joinedDate: "2023-12-18",
    },
    tags: ["Bold", "Unique", "Adventure"],
    itemCount: 14,
  },
]

export default function SellersPage() {
  return (
    <MobileLayout title="Meet the Sellers" subtitle="Discover amazing creators and their stories">
      {/* Search & Filters */}
      <div className="px-4 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B4B6C2] h-4 w-4" />
          <Input
            placeholder="Search sellers..."
            className="pl-10 bg-[#15161C] border-[#262833] text-white placeholder:text-[#B4B6C2]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Select>
            <SelectTrigger className="w-28 bg-[#15161C] border-[#262833] text-white">
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent className="bg-[#15161C] border-[#262833]">
              <SelectItem value="all">All Sellers</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
            </SelectContent>
          </Select>

          <Select>
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
        <div className="grid grid-cols-1 gap-4">
          {sellers.map((seller) => (
            <Card key={seller.id} className="bg-[#15161C] border-[#262833] overflow-hidden">
              <CardContent className="p-4">
                {/* Avatar & Basic Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={seller.avatar || "/placeholder.svg"}
                      alt={seller.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {seller.verified && (
                      <Badge className="absolute -top-1 -right-1 bg-[#FF4D8D] text-white px-1 text-xs border-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg mb-1">{seller.displayName}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{seller.stats.rating}</span>
                      <span className="text-sm text-[#B4B6C2]">({seller.stats.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#B4B6C2]">
                      <span>{seller.stats.itemsSold} sold</span>
                      <span>{seller.itemCount} available</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Bio */}
                <p className="text-sm text-[#B4B6C2] mb-3 line-clamp-2">{seller.bio}</p>

                {/* Tags */}
                <div className="flex gap-1 mb-3 flex-wrap">
                  {seller.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-[#262833] text-[#B4B6C2] border-0">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action */}
                <Button asChild className="w-full bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
                  <Link href={`/seller/${seller.id}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-6">
          <Button
            variant="outline"
            size="sm"
            className="border-[#262833] text-[#B4B6C2] hover:bg-[#15161C] bg-transparent"
          >
            Load More Sellers
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
