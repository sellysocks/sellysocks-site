"use client"

import { useState } from "react"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { Search, Package, MessageCircle, Star } from "lucide-react"
import Link from "next/link"

// Mock data for buyer's orders
const mockOrders = [
  {
    id: "order-1",
    itemId: "2",
    itemTitle: "Silk Stockings",
    itemImage: "/silk-stockings.png",
    sellerName: "Sophie",
    sellerId: "sophie-luxe",
    price: 45,
    status: "delivered",
    orderDate: "2024-01-20",
    deliveryDate: "2024-01-23",
    trackingNumber: "RM123456789GB",
    canReview: true,
  },
  {
    id: "order-2",
    itemId: "3",
    itemTitle: "Athletic Ankle Socks",
    itemImage: "/placeholder-niqvm.png",
    sellerName: "Maya",
    sellerId: "maya-active",
    price: 18,
    status: "shipped",
    orderDate: "2024-01-22",
    estimatedDelivery: "2024-01-25",
    trackingNumber: "RM987654321GB",
    canReview: false,
  },
  {
    id: "order-3",
    itemId: "4",
    itemTitle: "Lace Thigh Highs",
    itemImage: "/lace-thigh-high-socks.png",
    sellerName: "Aria",
    sellerId: "aria-elegant",
    price: 35,
    status: "processing",
    orderDate: "2024-01-24",
    estimatedDelivery: "2024-01-27",
    canReview: false,
  },
]

export default function OrdersPage() {
  const { user, profile } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  if (!user || !profile) {
    return (
      <MobileLayout title="Sign In Required" showBack={false} showPublic={false} showSettings={false} showMenu={false}>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-4">Sign In Required</h2>
          <p className="text-[#B4B6C2] mb-6">You need to be signed in to view your orders.</p>
          <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </MobileLayout>
    )
  }

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "processing":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered"
      case "shipped":
        return "Shipped"
      case "processing":
        return "Processing"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  return (
    <MobileLayout title="My Orders" subtitle="Track your purchases and manage orders">
      {/* Filters */}
      <div className="px-4 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B4B6C2] h-4 w-4" />
          <Input
            placeholder="Search orders..."
            className="pl-10 bg-[#15161C] border-[#262833] text-white placeholder:text-[#B4B6C2]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full bg-[#15161C] border-[#262833] text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#15161C] border-[#262833]">
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="px-4 space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-[#15161C] border-[#262833]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Item Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#262833] flex-shrink-0">
                  <img
                    src={order.itemImage || "/placeholder.svg"}
                    alt={order.itemTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-white text-sm line-clamp-1">{order.itemTitle}</h3>
                      <p className="text-xs text-[#B4B6C2]">
                        Sold by{" "}
                        <Link href={`/seller/${order.sellerId}`} className="text-[#FF4D8D] hover:underline">
                          {order.sellerName}
                        </Link>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-sm">£{order.price}</div>
                      <Badge variant={getStatusColor(order.status)} className="text-xs mt-1">
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="text-xs text-[#B4B6C2] mb-3">
                    <div>Ordered: {new Date(order.orderDate).toLocaleDateString()}</div>
                    {order.deliveryDate && <div>Delivered: {new Date(order.deliveryDate).toLocaleDateString()}</div>}
                    {order.estimatedDelivery && !order.deliveryDate && (
                      <div>Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</div>
                    )}
                    {order.trackingNumber && <div className="font-mono">Tracking: {order.trackingNumber}</div>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent text-xs h-7"
                    >
                      <Link href={`/item/${order.itemId}`}>
                        <Package className="h-3 w-3 mr-1" />
                        View Item
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent text-xs h-7"
                    >
                      <Link href={`/messages`}>
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Message
                      </Link>
                    </Button>
                    {order.canReview && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent text-xs h-7"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#B4B6C2] mb-4">
              {searchTerm || statusFilter !== "all"
                ? "No orders found matching your criteria."
                : "You haven't made any purchases yet."}
            </div>
            <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
