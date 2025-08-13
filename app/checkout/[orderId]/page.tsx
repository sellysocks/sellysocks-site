"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, MoreHorizontal, Shield, Truck, CreditCard } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { notFound } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

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
      stripeAccountId: "acct_seller123",
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

interface CheckoutFormProps {
  order: any
  clientSecret: string
}

function CheckoutForm({ order, clientSecret }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United Kingdom",
  })
  const [specialInstructions, setSpecialInstructions] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order_id=${order.id}`,
        shipping: {
          name: shippingInfo.fullName,
          address: {
            line1: shippingInfo.address,
            city: shippingInfo.city,
            postal_code: shippingInfo.postalCode,
            country: "GB",
          },
        },
      },
    })

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  const isFormValid = shippingInfo.fullName && shippingInfo.address && shippingInfo.city && shippingInfo.postalCode

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-white font-medium">Checkout</div>
            <div className="text-xs text-muted-foreground">Complete your purchase</div>
          </div>

          <Button variant="ghost" size="sm" className="text-white hover:bg-card">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 space-y-6">
        {/* Order Summary */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex gap-3 mb-4">
            <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              <img
                src={order.item.image || "/placeholder.svg"}
                alt={order.item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white line-clamp-2">{order.item.title}</h3>
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
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg mb-4">
            <img
              src={order.seller.avatar || "/placeholder.svg"}
              alt={order.seller.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-white">{order.seller.name}</span>
                {order.seller.verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Item price</span>
              <span className="text-white">£{order.pricing.itemPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform fee (10%)</span>
              <span className="text-white">£{order.pricing.platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-white">£{order.pricing.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span className="text-white">Total</span>
              <span className="text-white">£{order.pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-accent" />
            <h3 className="font-medium text-white">Shipping Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-white">
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={shippingInfo.fullName}
                onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                placeholder="Your full name"
                className="bg-background border-border text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-white">
                Address *
              </Label>
              <Input
                id="address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                placeholder="Street address"
                className="bg-background border-border text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-white">
                  City *
                </Label>
                <Input
                  id="city"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  placeholder="City"
                  className="bg-background border-border text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode" className="text-white">
                  Postal Code *
                </Label>
                <Input
                  id="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                  placeholder="Postal code"
                  className="bg-background border-border text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="instructions" className="text-white">
                Special Instructions (Optional)
              </Label>
              <Textarea
                id="instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special delivery instructions..."
                className="bg-background border-border text-white"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-accent" />
            <h3 className="font-medium text-white">Payment Method</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement
              options={{
                layout: "tabs",
                paymentMethodOrder: ["apple_pay", "google_pay", "card"],
              }}
            />

            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Shield className="w-4 h-4 text-green-400" />
              <p className="text-sm text-green-400">
                Your payment is secured with 256-bit SSL encryption. We never store your payment details.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              disabled={loading || !stripe || !isFormValid}
            >
              {loading ? "Processing..." : `Pay £${order.pricing.total.toFixed(2)}`}
            </Button>
          </form>

          <div className="text-xs text-muted-foreground space-y-1 mt-4">
            <p>• Payment is held securely until delivery is confirmed</p>
            <p>• Seller receives payout after successful delivery</p>
            <p>• Full refund if item doesn't match description</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CheckoutPageProps {
  params: {
    orderId: string
  }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)

  const order = mockOrders[params.orderId as keyof typeof mockOrders]

  useEffect(() => {
    if (!user || !profile) {
      router.push("/auth/signin")
      return
    }

    if (!order) {
      notFound()
      return
    }

    // Create payment intent
    createPaymentIntent()
  }, [user, profile, order])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: Math.round(order.pricing.total * 100), // Convert to cents
          sellerAccountId: order.seller.stripeAccountId,
          platformFee: Math.round(order.pricing.platformFee * 100),
        }),
      })

      const { clientSecret } = await response.json()
      setClientSecret(clientSecret)
    } catch (error) {
      toast({
        title: "Failed to initialize payment",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || !profile) {
    return null
  }

  if (!order) {
    notFound()
  }

  if (loading || !clientSecret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading checkout...</div>
      </div>
    )
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#FF4D8D",
        colorBackground: "#15161C",
        colorText: "#ffffff",
        colorDanger: "#df1b41",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm order={order} clientSecret={clientSecret} />
    </Elements>
  )
}
