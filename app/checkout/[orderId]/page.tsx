"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react"
import Link from "next/link"

interface CheckoutPageProps {
  params: { orderId: string }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United Kingdom",
    instructions: "",
  })

  // Mock order data based on orderId
  const mockOrders: Record<string, any> = {
    "order-1": {
      id: "order-1",
      item: {
        id: "1",
        name: "Cozy Cotton Socks",
        price: 25,
        image: "/cozy-cotton-socks.png",
        seller: "Emma Rose",
      },
    },
    "order-2": {
      id: "order-2",
      item: {
        id: "2",
        name: "Silk Stockings",
        price: 45,
        image: "/silk-stockings.png",
        seller: "Sophie Luxe",
      },
    },
  }

  const order = mockOrders[params.orderId]

  if (!order) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-xl font-semibold text-white mb-4">Order Not Found</h1>
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </MobileLayout>
    )
  }

  const subtotal = order.item.price
  const shipping = 3.99
  const total = subtotal + shipping

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleTestPurchase = async () => {
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping fields.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate processing time
    setTimeout(() => {
      toast({
        title: "Test Purchase Successful! 🎉",
        description: "Your demo order has been created successfully.",
      })
      router.push(`/orders/${params.orderId}`)
    }, 2000)
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <Link href={`/item/${order.item.id}`}>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Checkout</h1>
            <div className="w-16" />
          </div>
        </div>

        <div className="p-4 space-y-6 pb-32">
          {/* Order Summary */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FF4D8D]" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <img
                  src={order.item.image || "/placeholder.svg"}
                  alt={order.item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-white">{order.item.name}</h3>
                  <p className="text-sm text-gray-400">by {order.item.seller}</p>
                  <p className="text-lg font-semibold text-[#FF4D8D]">£{order.item.price}</p>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">£{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Shipping
                  </span>
                  <span className="text-white">£{shipping.toFixed(2)}</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-[#FF4D8D]">£{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-300">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={shippingInfo.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-gray-300">
                  Address *
                </Label>
                <Input
                  id="address"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city" className="text-gray-300">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-gray-300">
                    Postal Code *
                  </Label>
                  <Input
                    id="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Postal code"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions" className="text-gray-300">
                  Delivery Instructions (Optional)
                </Label>
                <Textarea
                  id="instructions"
                  value={shippingInfo.instructions}
                  onChange={(e) => handleInputChange("instructions", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Any special delivery instructions..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Test Mode Payment */}
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Test Mode - Demo Purchase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-300 text-sm mb-4">
                This is a demo purchase that won't charge any real money. Perfect for testing the complete checkout
                flow!
              </p>
              <Button
                onClick={handleTestPurchase}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? "Processing Demo Purchase..." : `Complete Demo Purchase - £${total.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  )
}
