"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Shield, Truck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock order data
const mockOrders = {
  "order-1": {
    id: "order-1",
    item: {
      id: "1",
      title: "Cozy Cotton Socks",
      image: "/cozy-cotton-socks.png",
      price: 25,
      size: "M",
      condition: "Gently Used",
      usedFor: "Workout Sessions",
    },
    seller: {
      id: "emma-rose",
      name: "Emma Rose",
      avatar: "/diverse-woman-avatar.png",
      verified: true,
    },
    buyer: {
      id: "current-user",
      email: "buyer@example.com",
    },
    pricing: {
      itemPrice: 25,
      platformFee: 2.5, // 10%
      shippingCost: 3.99,
      total: 31.49,
    },
    status: "pending_payment",
    createdAt: "2024-01-25T12:00:00Z",
  },
}

interface CheckoutPageProps {
  params: {
    orderId: string
  }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United Kingdom",
  })
  const [specialInstructions, setSpecialInstructions] = useState("")

  const order = mockOrders[params.orderId as keyof typeof mockOrders]

  useEffect(() => {
    if (profile) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: profile.displayName || "",
      }))
    }
  }, [profile])

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to complete checkout.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!order) {
    notFound()
  }

  const handleStripeCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          shippingInfo,
          specialInstructions,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePayPalCheckout = async () => {
    toast({
      title: "PayPal integration coming soon",
      description: "PayPal payments will be available in a future update.",
    })
  }

  const isFormValid = shippingInfo.fullName && shippingInfo.address && shippingInfo.city && shippingInfo.postalCode

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/item/${order.item.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold">Checkout</h1>
              <p className="text-muted-foreground">Complete your purchase securely</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>Where should we send your item?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        placeholder="Postal code"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={shippingInfo.country} disabled className="bg-muted" />
                  </div>

                  <div>
                    <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Any special delivery instructions..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className={`cursor-pointer transition-colors ${
                        paymentMethod === "stripe" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setPaymentMethod("stripe")}
                    >
                      <CardContent className="p-4 text-center">
                        <CreditCard className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="font-medium mb-1">Credit/Debit Card</h3>
                        <p className="text-xs text-muted-foreground">Secure payment via Stripe</p>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-colors ${
                        paymentMethod === "paypal" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setPaymentMethod("paypal")}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="h-8 w-8 mx-auto mb-2 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PP</span>
                        </div>
                        <h3 className="font-medium mb-1">PayPal</h3>
                        <p className="text-xs text-muted-foreground">Coming soon</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Shield className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-800">
                      Your payment is secured with 256-bit SSL encryption. We never store your payment details.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Item */}
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={order.item.image || "/placeholder.svg"}
                        alt={order.item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">{order.item.title}</h3>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Size {order.item.size}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {order.item.condition}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Used for: {order.item.usedFor}</p>
                    </div>
                  </div>

                  {/* Seller */}
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                    <img
                      src={order.seller.avatar || "/placeholder.svg"}
                      alt={order.seller.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{order.seller.name}</span>
                        {order.seller.verified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Item price</span>
                      <span>£{order.pricing.itemPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform fee (10%)</span>
                      <span>£{order.pricing.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>£{order.pricing.shippingCost.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>£{order.pricing.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {paymentMethod === "stripe" && (
                      <Button className="w-full" onClick={handleStripeCheckout} disabled={loading || !isFormValid}>
                        {loading ? "Processing..." : `Pay £${order.pricing.total.toFixed(2)} with Stripe`}
                      </Button>
                    )}

                    {paymentMethod === "paypal" && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={handlePayPalCheckout}
                        disabled={!isFormValid}
                      >
                        Pay with PayPal (Coming Soon)
                      </Button>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Payment is held securely until delivery is confirmed</p>
                    <p>• Seller receives payout after successful delivery</p>
                    <p>• Full refund if item doesn't match description</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
