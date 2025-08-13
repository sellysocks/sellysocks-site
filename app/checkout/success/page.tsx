"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, MessageCircle, Home } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the order details using the session ID
    // For now, we'll use mock data
    setTimeout(() => {
      setOrderDetails({
        id: "order-1",
        item: {
          title: "Cozy Cotton Socks",
          image: "/cozy-cotton-socks.png",
          price: 25,
        },
        seller: {
          name: "Emma Rose",
          avatar: "/diverse-woman-avatar.png",
        },
        total: 31.49,
        estimatedDelivery: "2-3 business days",
      })
      setLoading(false)
    }, 1000)
  }, [sessionId])

  if (loading) {
    return (
      <MobileLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your order...</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">Your order has been confirmed and the seller has been notified.</p>
          </div>

          {/* ... existing order details and content ... */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Confirmation</CardTitle>
              <CardDescription>Order #{orderDetails.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={orderDetails.item.image || "/placeholder.svg"}
                    alt={orderDetails.item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{orderDetails.item.title}</h3>
                  <p className="text-sm text-muted-foreground">Sold by {orderDetails.seller.name}</p>
                  <p className="font-bold text-primary">£{orderDetails.total}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Estimated delivery: {orderDetails.estimatedDelivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Payment Confirmed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ... existing next steps and action buttons ... */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Seller prepares your item</h4>
                  <p className="text-sm text-muted-foreground">
                    The seller will carefully package your item and prepare it for shipping.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Item ships with tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive tracking information once the item is shipped.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Delivery and confirmation</h4>
                  <p className="text-sm text-muted-foreground">
                    Once delivered, confirm receipt to release payment to the seller.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/orders">
                <Package className="h-4 w-4 mr-2" />
                View Order Status
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/messages">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Seller
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <div className="mt-12 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Need help with your order?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
