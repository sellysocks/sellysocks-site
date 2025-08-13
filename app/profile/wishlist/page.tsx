"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Bell, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { useToast } from "@/hooks/use-toast"

// Mock item data - in production this would come from your database
const mockItems = {
  "1": {
    id: "1",
    title: "Cozy Cotton Socks",
    price: 12.99,
    originalPrice: 15.99,
    image: "/cozy-cotton-socks.png",
    seller: "Emma Rose",
    onSale: true,
  },
  "2": {
    id: "2",
    title: "Silk Stockings",
    price: 24.99,
    originalPrice: 24.99,
    image: "/silk-stockings.png",
    seller: "Sophie Luxe",
    onSale: false,
  },
  "3": {
    id: "3",
    title: "Athletic Ankle Socks",
    price: 18.99,
    originalPrice: 22.99,
    image: "/placeholder-rp0b5.png",
    seller: "FitWear Co",
    onSale: true,
  },
}

export default function WishlistPage() {
  const { profile, removeFromWishlist, updatePriceAlert } = useAuth()
  const { toast } = useToast()
  const [priceAlertValues, setPriceAlertValues] = useState<Record<string, string>>({})

  const wishlistItems = profile?.wishlist || []
  const priceAlerts = profile?.priceAlerts || []

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await removeFromWishlist(itemId)
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePriceAlert = async (itemId: string) => {
    const targetPrice = Number.parseFloat(priceAlertValues[itemId])
    if (isNaN(targetPrice) || targetPrice <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price for the alert",
        variant: "destructive",
      })
      return
    }

    try {
      await updatePriceAlert(itemId, targetPrice)
      toast({
        title: "Price alert updated",
        description: `You'll be notified when the price drops to £${targetPrice.toFixed(2)}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update price alert",
        variant: "destructive",
      })
    }
  }

  const customHeader = (
    <div className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
      <Link href="/profile">
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <h1 className="text-lg font-semibold text-white">Wishlist</h1>
      <div className="w-8" />
    </div>
  )

  if (wishlistItems.length === 0) {
    return (
      <MobileLayout customHeader={customHeader}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-6 max-w-sm">
            Save items you want to buy later and get notified when they go on sale
          </p>
          <Link href="/">
            <Button className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout customHeader={customHeader}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Bell className="h-3 w-3" />
            Price alerts enabled
          </div>
        </div>

        {wishlistItems.map((wishlistItem) => {
          const item = mockItems[wishlistItem.itemId as keyof typeof mockItems]
          if (!item) return null

          const priceAlert = priceAlerts.find((alert) => alert.itemId === wishlistItem.itemId)
          const currentPriceAlertValue =
            priceAlertValues[wishlistItem.itemId] || priceAlert?.targetPrice?.toString() || ""

          return (
            <Card key={wishlistItem.itemId} className="bg-gray-900 border-gray-800 p-4">
              <div className="flex gap-3">
                <Link href={`/item/${item.id}`}>
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link href={`/item/${item.id}`}>
                        <h3 className="font-medium text-white text-sm line-clamp-2 hover:text-[#FF4D8D]">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">by {item.seller}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white font-semibold">£{item.price}</span>
                    {item.onSale && (
                      <>
                        <span className="text-xs text-gray-400 line-through">£{item.originalPrice}</span>
                        <Badge variant="secondary" className="bg-[#FF4D8D] text-white text-xs px-1.5 py-0.5">
                          Sale
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Price Alert Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">Price Alert</span>
                      </div>
                      <Switch checked={wishlistItem.priceAlertEnabled} className="scale-75" />
                    </div>

                    {wishlistItem.priceAlertEnabled && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Target price"
                          value={currentPriceAlertValue}
                          onChange={(e) =>
                            setPriceAlertValues((prev) => ({
                              ...prev,
                              [wishlistItem.itemId]: e.target.value,
                            }))
                          }
                          className="h-7 text-xs bg-gray-800 border-gray-700 text-white flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdatePriceAlert(wishlistItem.itemId)}
                          className="h-7 px-2 text-xs bg-[#FF4D8D] hover:bg-[#FF4D8D]/90"
                        >
                          Set
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </MobileLayout>
  )
}
