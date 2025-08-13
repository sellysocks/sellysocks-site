"use client"

import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search } from "lucide-react"
import Link from "next/link"

// Mock data for demo
const featuredItems = [
  {
    id: "1",
    title: "Cozy Cotton Socks",
    price: 25,
    size: "M",
    condition: "Gently Used",
    usedFor: "Workout Sessions",
    images: ["/cozy-cotton-socks.png"],
    seller: { name: "Emma", avatar: "/diverse-woman-avatar.png", verified: true },
  },
  {
    id: "2",
    title: "Silk Stockings",
    price: 45,
    size: "S",
    condition: "Like New",
    usedFor: "Date Night",
    images: ["/silk-stockings.png"],
    seller: { name: "Sophie", avatar: "/woman-avatar-2.png", verified: false },
  },
  {
    id: "3",
    title: "Athletic Ankle Socks",
    price: 18,
    size: "L",
    condition: "Well Loved",
    usedFor: "Running",
    images: ["/placeholder-niqvm.png"],
    seller: { name: "Maya", avatar: "/woman-avatar-3.png", verified: true },
  },
  {
    id: "4",
    title: "Lace Thigh Highs",
    price: 35,
    size: "M",
    condition: "Gently Used",
    usedFor: "Special Occasions",
    images: ["/lace-thigh-high-socks.png"],
    seller: { name: "Aria", avatar: "/woman-avatar-4.png", verified: true },
  },
]

export default function HomePage() {
  return (
    <MobileLayout title="Selly Socks" subtitle="Discover unique pieces with stories" showBack={false}>
      {/* Hero Section */}
      <div className="px-4 py-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Smelly. Personal. Yours.</h1>
        <p className="text-[#B4B6C2] mb-6 text-sm">
          The social marketplace where creators share their most intimate items with devoted fans.
        </p>
        <div className="flex flex-col gap-3">
          <Button size="sm" asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            <Link href="/sellers">Meet the Sellers</Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="border-[#262833] text-[#B4B6C2] hover:bg-[#15161C] bg-transparent"
          >
            <Link href="/auth/signup">Join the Community</Link>
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="px-4 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B4B6C2] h-4 w-4" />
          <Input
            placeholder="Search items..."
            className="pl-10 bg-[#15161C] border-[#262833] text-white placeholder:text-[#B4B6C2]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Select>
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

          <Select>
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

          <Select>
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

        <div className="grid grid-cols-2 gap-3 mb-6">
          {featuredItems.map((item) => (
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
                >
                  <Heart className="h-4 w-4 text-white" />
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
                  </div>

                  <Button size="sm" asChild className="h-7 text-xs bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
                    <Link href={`/item/${item.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            className="border-[#262833] text-[#B4B6C2] hover:bg-[#15161C] bg-transparent"
          >
            Load More Items
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
