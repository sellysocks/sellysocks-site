"use client"

import React from "react"

import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share, ChevronLeft, Ruler, Package, Heart, MessageCircle, ShoppingBag, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { SizeGuideModal } from "@/components/mobile/size-guide-modal"
import { BundleDealsModal } from "@/components/mobile/bundle-deals-modal"
import { itemsData } from "@/data/itemsData"
import Image from "next/image"

export default function ItemPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showBundleDeals, setShowBundleDeals] = useState(false)
  const {
    isFavourited,
    addToFavourites,
    removeFromFavourites,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    addToRecentlyViewed,
  } = useAuth()
  const { toast } = useToast()

  const item = itemsData[params.id as keyof typeof itemsData]

  if (!item) {
    notFound()
  }

  React.useEffect(() => {
    addToRecentlyViewed(item.id)
  }, [item.id, addToRecentlyViewed])

  const itemType = item.title.toLowerCase().includes("stocking") ? "stockings" : "socks"
  const isFav = isFavourited(item.id)
  const isWishlisted = isInWishlist(item.id)

  const handleFavouriteToggle = () => {
    if (isFav) {
      removeFromFavourites(item.id)
      toast({ description: "Removed from favourites" })
    } else {
      addToFavourites(item.id)
      toast({ description: "Added to favourites" })
    }
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(item.id)
      toast({ description: "Removed from wishlist" })
    } else {
      addToWishlist(item.id, item.price)
      toast({ description: "Added to wishlist" })
    }
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
        <div className="relative aspect-square bg-[#262833] mb-4">
          <Image
            src={item.images[currentImageIndex] || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover"
          />

          {/* Image Navigation */}
          {item.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {item.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {item.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}

          {/* Favourite and Wishlist buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavouriteToggle}
              className="p-2 bg-black/50 text-white hover:bg-black/70"
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-[#FF4D8D] text-[#FF4D8D]" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlistToggle}
              className="p-2 bg-black/50 text-white hover:bg-black/70"
            >
              <ShoppingBag className={`h-4 w-4 ${isWishlisted ? "fill-[#FF4D8D] text-[#FF4D8D]" : ""}`} />
            </Button>
          </div>
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

              {/* Size guide and bundle deals buttons */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSizeGuide(true)}
                  className="border-[#262833] text-[#B4B6C2] hover:bg-[#15161C] bg-transparent text-xs"
                >
                  <Ruler className="h-3 w-3 mr-1" />
                  Size Guide
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBundleDeals(true)}
                  className="border-[#262833] text-[#B4B6C2] hover:bg-[#15161C] bg-transparent text-xs"
                >
                  <Package className="h-3 w-3 mr-1" />
                  Bundle Deals
                </Button>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#FF4D8D]">£{item.price}</span>
              <p className="text-sm text-[#B4B6C2]">{item.shipping}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Description</h3>
            <p className="text-[#B4B6C2] leading-relaxed">{item.description}</p>
          </div>

          <div className="bg-[#262833] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={item.seller.avatar || "/placeholder.svg"}
                  alt={item.seller.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{item.seller.name}</span>
                    {item.seller.verified && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#B4B6C2]">
                    <span>⭐ {item.seller.rating}</span>
                    <span>•</span>
                    <span>{item.seller.reviews} reviews</span>
                  </div>
                </div>
              </div>
              <Link href={`/seller/${item.seller.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#FF4D8D] text-[#FF4D8D] hover:bg-[#FF4D8D]/10 bg-transparent"
                >
                  View Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Location */}
          <div className="text-sm text-[#B4B6C2]">📍 {item.location}</div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-[#15161C] border-t border-[#262833] p-4">
          <div className="flex gap-3">
            <Link href={`/messages/thread-${item.seller.id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-[#262833] text-white hover:bg-[#262833] bg-transparent"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </Link>
            <Link href={`/checkout/order-${item.id}`} className="flex-1">
              <Button className="w-full bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} itemType={itemType} />

      <BundleDealsModal
        isOpen={showBundleDeals}
        onClose={() => setShowBundleDeals(false)}
        currentItem={{
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.images[0],
        }}
      />
    </MobileLayout>
  )
}
