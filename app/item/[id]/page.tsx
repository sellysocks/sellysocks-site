"use client"

import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { notFound } from "next/navigation"

// Mock data for items
const itemsData = {
  "1": {
    id: "1",
    title: "Cozy Cotton Socks",
    price: 25,
    size: "M",
    condition: "Gently Used",
    usedFor: "Workout Sessions",
    description:
      "Super soft cotton socks that have been worn for my morning yoga sessions. They're incredibly comfortable and have that perfect worn-in feel. Perfect for someone who loves that cozy, lived-in comfort.",
    images: ["/cozy-cotton-socks.png", "/sock-detail-1.png", "/sock-detail-2.png"],
    seller: {
      id: "emma",
      name: "Emma",
      avatar: "/diverse-woman-avatar.png",
      verified: true,
      rating: 4.9,
      sales: 23,
    },
    shipping: "Free shipping",
    location: "London, UK",
  },
  "2": {
    id: "2",
    title: "Silk Stockings",
    price: 45,
    size: "S",
    condition: "Like New",
    usedFor: "Date Night",
    description:
      "Luxurious silk stockings worn only once for a special evening out. They have that perfect silky smooth texture and elegant sheen. Perfect for someone who appreciates fine lingerie.",
    images: ["/silk-stockings.png", "/silk-stockings-detail.png"],
    seller: {
      id: "sophie",
      name: "Sophie",
      avatar: "/woman-avatar-2.png",
      verified: false,
      rating: 4.7,
      sales: 15,
    },
    shipping: "£3 shipping",
    location: "Manchester, UK",
  },
  "3": {
    id: "3",
    title: "Athletic Ankle Socks",
    price: 18,
    size: "L",
    condition: "Well Loved",
    usedFor: "Running",
    description:
      "My favorite running socks that have been with me through countless morning jogs. They have that perfect broken-in comfort and moisture-wicking properties. Great for active lifestyles.",
    images: ["/placeholder-niqvm.png"],
    seller: {
      id: "maya",
      name: "Maya",
      avatar: "/woman-avatar-3.png",
      verified: true,
      rating: 4.8,
      sales: 31,
    },
    shipping: "Free shipping",
    location: "Birmingham, UK",
  },
}

export default function ItemPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  const item = itemsData[params.id as keyof typeof itemsData]

  if (!item) {
    notFound()
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length)
  }

  return (
    <MobileLayout
      customHeader={
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-[#262833]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-semibold text-white text-center flex-1 mx-4 truncate">{item.title}</h1>
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-[#262833]">
            <Share className="h-5 w-5" />
          </Button>
        </div>
      }
      showBack={false}
    >
      <div className="pb-20">
        {/* Image Gallery */}
        <div className="relative aspect-square bg-[#15161C] mb-4">
          <img
            src={item.images[currentImageIndex] || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover"
          />

          {/* Image Navigation */}
          {item.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Image Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-[#FF4D8D]" : "bg-white/50"}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-[#FF4D8D] text-[#FF4D8D]" : ""}`} />
          </Button>
        </div>

        <div className="px-4 space-y-4">
          {/* Title and Price */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-2">{item.title}</h1>
              <div className="flex gap-2 flex-wrap mb-2">
                <Badge variant="secondary" className="bg-[#262833] text-[#B4B6C2] border-0">
                  Size {item.size}
                </Badge>
                <Badge variant="outline" className="border-[#262833] text-[#B4B6C2]">
                  {item.condition}
                </Badge>
              </div>
              <p className="text-sm text-[#B4B6C2]">Used for: {item.usedFor}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#FF4D8D]">£{item.price}</span>
              <p className="text-sm text-[#B4B6C2]">{item.shipping}</p>
            </div>
          </div>

          {/* Description */}
          <Card className="bg-[#15161C] border-[#262833]">
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2">Description</h3>
              <p className="text-[#B4B6C2] text-sm leading-relaxed">{item.description}</p>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card className="bg-[#15161C] border-[#262833]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.seller.avatar || "/placeholder.svg"}
                    alt={item.seller.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{item.seller.name}</span>
                      {item.seller.verified && (
                        <Badge variant="secondary" className="text-xs px-1 bg-[#FF4D8D] text-white border-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#B4B6C2]">
                      <span>⭐ {item.seller.rating}</span>
                      <span>Sold {item.seller.sales}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#262833] text-[#B4B6C2] hover:bg-[#15161C] bg-transparent"
                  asChild
                >
                  <Link href={`/sellers/${item.seller.id}`}>View Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <div className="text-sm text-[#B4B6C2]">📍 {item.location}</div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-16 left-0 right-0 bg-[#0A0B0F] border-t border-[#262833] p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-[#FF4D8D] text-[#FF4D8D] hover:bg-[#FF4D8D]/10 bg-transparent"
              asChild
            >
              <Link href={`/messages/thread-${item.seller.id}`}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Link>
            </Button>
            <Button size="lg" className="flex-1 bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white" asChild>
              <Link href={`/checkout/order-${item.id}`}>Buy Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
