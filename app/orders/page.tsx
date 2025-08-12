"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view your orders.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
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
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track your purchases and manage your orders</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                          <h3 className="font-medium mb-1 line-clamp-1">{order.itemTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            Sold by{" "}
                            <Link href={`/seller/${order.sellerId}`} className="text-primary hover:underline">
                              {order.sellerName}
                            </Link>
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">£{order.price}</div>
                          <Badge variant={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Order Date:</span>
                          <div>{new Date(order.orderDate).toLocaleDateString()}</div>
                        </div>
                        {order.deliveryDate && (
                          <div>
                            <span className="text-muted-foreground">Delivered:</span>
                            <div>{new Date(order.deliveryDate).toLocaleDateString()}</div>
                          </div>
                        )}
                        {order.estimatedDelivery && !order.deliveryDate && (
                          <div>
                            <span className="text-muted-foreground">Estimated Delivery:</span>
                            <div>{new Date(order.estimatedDelivery).toLocaleDateString()}</div>
                          </div>
                        )}
                        {order.trackingNumber && (
                          <div>
                            <span className="text-muted-foreground">Tracking:</span>
                            <div className="font-mono text-xs">{order.trackingNumber}</div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/item/${order.itemId}`}>
                            <Package className="h-4 w-4 mr-2" />
                            View Item
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/messages`}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message Seller
                          </Link>
                        </Button>
                        {order.canReview && (
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4 mr-2" />
                            Leave Review
                          </Button>
                        )}
                        {order.status === "shipped" && order.trackingNumber && (
                          <Button variant="outline" size="sm">
                            Track Package
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No orders found matching your criteria."
                  : "You haven't made any purchases yet."}
              </div>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
