"use client"

import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share, ChevronLeft, Ruler, Package } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { SizeGuideModal } from "@/components/mobile/size-guide-modal"
import { BundleDealsModal } from "@/components/mobile/bundle-deals-modal"
import { itemsData } from "@/data/itemsData" // Declare the itemsData variable

export default function ItemPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showBundleDeals, setShowBundleDeals] = useState(false)
  const { isFavourited, addToFavourites, removeFromFavourites, isInWishlist, addToWishlist, removeFromWishlist } =
    useAuth()
  const { toast } = useToast()

  const item = itemsData[params.id as keyof typeof itemsData]

  if (!item) {
    notFound()
  }

  const itemType = item.title.toLowerCase().includes("stocking") ? "stockings" : "socks"

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
        {/* ... existing image gallery code ... */}

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

              {/* Added size guide and bundle deals buttons */}
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

          {/* ... existing description and seller info code ... */}

          {/* Location */}
          <div className="text-sm text-[#B4B6C2]">📍 {item.location}</div>
        </div>

        {/* ... existing fixed bottom actions code ... */}
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
