"use client"

import { useAuth } from "@/components/auth-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import Link from "next/link"

export function RecentlyViewed() {
  const { getRecentlyViewed, clearRecentlyViewed } = useAuth()
  const recentlyViewed = getRecentlyViewed()

  if (recentlyViewed.length === 0) {
    return null
  }

  const handleClearHistory = async () => {
    try {
      await clearRecentlyViewed()
    } catch (error) {
      console.error("Error clearing recently viewed:", error)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#FF4D8D]" />
          <h2 className="text-lg font-semibold text-white">Recently Viewed</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearHistory}
          className="text-gray-400 hover:text-white text-xs"
        >
          Clear All
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recentlyViewed.slice(0, 10).map((item) => (
          <Link key={item.itemId} href={`/item/${item.itemId}`} className="flex-shrink-0">
            <Card className="bg-gray-900 border-gray-800 p-3 w-32 hover:bg-gray-800 transition-colors">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-20 object-cover rounded-lg mb-2"
              />
              <h3 className="text-white text-xs font-medium line-clamp-2 mb-1">{item.title}</h3>
              <p className="text-[#FF4D8D] text-xs font-semibold">£{item.price}</p>
              <p className="text-gray-400 text-xs mt-1">{new Date(item.viewedAt).toLocaleDateString()}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
