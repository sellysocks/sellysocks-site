"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronLeft,
  MoreHorizontal,
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Star,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock order data with escrow information
const mockOrderDetails = {
  "order-1": {
    id: "order-1",
    paymentIntentId: "pi_test123",
    item: {
      id: "2",
      title: "Silk Stockings",
      image: "/silk-stockings.png",
      price: 45,
      size: "M",
      condition: "Gently Used",
      usedFor: "Special Occasions",
    },
    seller: {
      id: "sophie-luxe",
      name: "Sophie",
      avatar: "/diverse-woman-avatar.png",
      verified: true,
      stripeAccountId: "acct_seller123",
    },
    buyer: {
      id: "current-user",
      email: "buyer@example.com",
    },
    pricing: {
      itemPrice: 45,
      platformFee: 4.5,
      shippingCost: 3.99,
      total: 53.49,
    },
    status: "delivered",
    payoutStatus: "released", // hold, eligible, released, failed
    orderDate: "2024-01-20T10:00:00Z",
    paidDate: "2024-01-20T10:05:00Z",
    shippedDate: "2024-01-21T14:30:00Z",
    deliveredDate: "2024-01-23T16:45:00Z",
    payoutDate: "2024-01-24T09:00:00Z",
    trackingNumber: "RM123456789GB",
    shippingInfo: {
      fullName: "John Doe",
      address: "123 Main Street",
      city: "London",
      postalCode: "SW1A 1AA",
      country: "United Kingdom",
    },
    timeline: [
      { status: "paid", date: "2024-01-20T10:05:00Z", description: "Payment confirmed" },
      { status: "processing", date: "2024-01-20T10:30:00Z", description: "Order being prepared" },
      { status: "shipped", date: "2024-01-21T14:30:00Z", description: "Package dispatched" },
      { status: "delivered", date: "2024-01-23T16:45:00Z", description: "Package delivered" },
      { status: "payout_released", date: "2024-01-24T09:00:00Z", description: "Payout released to seller" },
    ],
  },
}

interface OrderDetailPageProps {
  params: {
    orderId: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { user, profile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const order = mockOrderDetails[params.orderId as keyof typeof mockOrderDetails]

  useEffect(() => {
    if (!user || !profile) {
      router.push("/auth/signin")
      return
    }
  }, [user, profile, router])

  if (!user || !profile) {
    return null
  }

  if (!order) {
    notFound()
  }

  const handleMarkDelivered = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${order.id}/mark-delivered`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Order marked as delivered",
          description: "Payout will be released to the seller within 24 hours.",
        })
        // Refresh page or update state
        window.location.reload()
      } else {
        throw new Error("Failed to mark as delivered")
      }
    } catch (error) {
      toast({
        title: "Failed to update order",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "payout_released":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "shipped":
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getPayoutStatusText = (status: string) => {
    switch (status) {
      case "hold":
        return "Funds on hold"
      case "eligible":
        return "Ready for payout"
      case "released":
        return "Payout completed"
      case "failed":
        return "Payout failed"
      default:
        return "Processing"
    }
  }

  const getPayoutStatusColor = (status: string) => {
    switch (status) {
      case "released":
        return "default"
      case "eligible":
        return "secondary"
      case "hold":
        return "outline"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-white font-medium">Order Details</div>
            <div className="text-xs text-muted-foreground">#{order.id}</div>
          </div>

          <Button variant="ghost" size="sm" className="text-white hover:bg-card">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 space-y-6">
        {/* Order Status */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-white">Order Status</h3>
              <p className="text-sm text-muted-foreground">Current status and tracking</p>
            </div>
            <Badge variant={order.status === "delivered" ? "default" : "secondary"} className="capitalize">
              {order.status}
            </Badge>
          </div>

          {order.trackingNumber && (
            <div className="bg-background rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-white">Tracking Number</span>
              </div>
              <p className="text-sm font-mono text-muted-foreground">{order.trackingNumber}</p>
            </div>
          )}

          {order.status !== "delivered" && (
            <Button
              onClick={handleMarkDelivered}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white"
            >
              {loading ? "Updating..." : "Mark as Delivered"}
            </Button>
          )}
        </div>

        {/* Payout Information */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-white">Payout Status</h3>
              <p className="text-sm text-muted-foreground">Seller payment information</p>
            </div>
            <Badge variant={getPayoutStatusColor(order.payoutStatus)}>{getPayoutStatusText(order.payoutStatus)}</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Seller amount</span>
              <span className="text-white">{formatCurrency(order.pricing.itemPrice - order.pricing.platformFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform fee</span>
              <span className="text-white">{formatCurrency(order.pricing.platformFee)}</span>
            </div>
            {order.payoutDate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payout date</span>
                <span className="text-white">{formatDate(order.payoutDate)}</span>
              </div>
            )}
            {order.payoutStatus === "eligible" && (
              <div className="text-xs text-muted-foreground">
                Payout will be released within 24 hours of delivery confirmation
              </div>
            )}
          </div>
        </div>

        {/* Item Details */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-medium text-white mb-4">Item Details</h3>

          <div className="flex gap-3 mb-4">
            <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              <img
                src={order.item.image || "/placeholder.svg"}
                alt={order.item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white line-clamp-2">{order.item.title}</h4>
              <div className="flex gap-1 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Size {order.item.size}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {order.item.condition}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Used for: {order.item.usedFor}</p>
              <p className="text-lg font-semibold text-white mt-2">{formatCurrency(order.item.price)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
              <Link href={`/item/${order.item.id}`}>
                <Package className="w-4 h-4 mr-2" />
                View Item
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
              <Link href={`/messages`}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Seller
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-medium text-white mb-4">Order Timeline</h3>

          <div className="space-y-4">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex items-start gap-3">
                {getStatusIcon(event.status)}
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{event.description}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(event.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-medium text-white mb-4">Shipping Information</h3>

          <div className="space-y-2 text-sm">
            <div className="text-white">{order.shippingInfo.fullName}</div>
            <div className="text-muted-foreground">{order.shippingInfo.address}</div>
            <div className="text-muted-foreground">
              {order.shippingInfo.city}, {order.shippingInfo.postalCode}
            </div>
            <div className="text-muted-foreground">{order.shippingInfo.country}</div>
          </div>
        </div>

        {/* Actions */}
        {order.status === "delivered" && (
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-medium text-white mb-4">Order Actions</h3>

            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                <Star className="w-4 h-4 mr-2" />
                Leave a Review
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Package className="w-4 h-4 mr-2" />
                Buy Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
