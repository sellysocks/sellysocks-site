"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Package, Truck, CheckCircle, Clock, Star, MessageCircle, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { MobileLayout } from "@/components/mobile/mobile-layout"

// Mock orders data - in real app this would come from API
const mockOrders = [
  {
    id: "order-1",
    itemId: "1",
    itemName: "Cozy Cotton Socks",
    itemImage: "/cozy-cotton-socks.png",
    price: 25,
    seller: "Emma Rose",
    sellerId: "emmarose", // Updated from "emma-rose" to "emmarose"
    status: "delivered",
    orderDate: "2024-01-10",
    deliveryDate: "2024-01-15",
    trackingNumber: "RM123456789GB",
    canReview: true,
    hasReviewed: false,
  },
  {
    id: "order-2",
    itemId: "2",
    itemName: "Silk Stockings",
    itemImage: "/silk-stockings.png",
    price: 45,
    seller: "Sophie Luxe",
    sellerId: "1", // Updated from "sophie-luxe" to "1"
    status: "shipped",
    orderDate: "2024-01-12",
    estimatedDelivery: "2024-01-18",
    trackingNumber: "RM987654321GB",
    canReview: false,
    hasReviewed: false,
  },
  {
    id: "order-3",
    itemId: "3",
    itemName: "Athletic Ankle Socks",
    itemImage: "/lace-thigh-high-socks.png",
    price: 18,
    seller: "Emma Rose",
    sellerId: "emmarose", // Updated from "emma-rose" to "emmarose"
    status: "processing",
    orderDate: "2024-01-14",
    estimatedDelivery: "2024-01-20",
    canReview: false,
    hasReviewed: false,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "shipped":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "processing":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-4 h-4" />
    case "shipped":
      return <Truck className="w-4 h-4" />
    case "processing":
      return <Clock className="w-4 h-4" />
    default:
      return <Package className="w-4 h-4" />
  }
}

export default function OrdersPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredOrders = mockOrders.filter((order) => {
    if (selectedTab === "all") return true
    return order.status === selectedTab
  })

  return (
    <MobileLayout
      customHeader={
        <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-white">Your Orders</h1>
          <Button variant="ghost" size="sm" className="text-white hover:bg-card">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      }
    >
      <div className="p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All Orders" },
            { key: "processing", label: "Processing" },
            { key: "shipped", label: "Shipped" },
            { key: "delivered", label: "Delivered" },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={selectedTab === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTab(tab.key)}
              className={`whitespace-nowrap ${
                selectedTab === tab.key
                  ? "bg-accent text-white"
                  : "bg-card text-muted-foreground border-border hover:bg-card/80"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedTab === "all" ? "You haven't placed any orders yet" : `No ${selectedTab} orders found`}
              </p>
              <Link href="/">
                <Button className="bg-accent hover:bg-accent/90 text-white">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex gap-3">
                  {/* Item Image */}
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={order.itemImage || "/placeholder.svg"}
                      alt={order.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-white truncate">{order.itemName}</h3>
                        <p className="text-sm text-muted-foreground">by {order.seller}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">£{order.price}</p>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Ordered: {new Date(order.orderDate).toLocaleDateString()}</p>
                      {order.trackingNumber && <p>Tracking: {order.trackingNumber}</p>}
                      {order.deliveryDate && <p>Delivered: {new Date(order.deliveryDate).toLocaleDateString()}</p>}
                      {order.estimatedDelivery && !order.deliveryDate && (
                        <p>Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <Link href={`/messages/thread-${order.sellerId}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-card border-border text-muted-foreground hover:bg-card/80"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                      </Link>

                      {order.canReview && !order.hasReviewed && (
                        <Button size="sm" className="text-xs bg-accent hover:bg-accent/90 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                      )}

                      <Link href={`/item/${order.itemId}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-card border-border text-muted-foreground hover:bg-card/80"
                        >
                          View Item
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  )
}
