import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AdminPayouts() {
  // Mock payouts data
  const payouts = [
    {
      id: 1,
      sellerId: "sarah-m",
      sellerName: "Sarah M.",
      sellerAvatar: "/curly-haired-woman.png",
      amount: 40.5,
      platformFee: 4.5,
      originalAmount: 45.0,
      status: "pending_release",
      orderId: "ORD-001",
      itemTitle: "Vintage Band T-Shirt",
      buyerName: "Emma K.",
      completedAt: "2024-01-14T10:30:00Z",
      eligibleAt: "2024-01-21T10:30:00Z",
      trackingAdded: true,
      daysRemaining: 3,
    },
    {
      id: 2,
      sellerId: "lisa-r",
      sellerName: "Lisa R.",
      sellerAvatar: "/blonde-woman-portrait.png",
      amount: 108.0,
      platformFee: 12.0,
      originalAmount: 120.0,
      status: "ready_to_release",
      orderId: "ORD-002",
      itemTitle: "Designer Heels",
      buyerName: "Mia C.",
      completedAt: "2024-01-10T15:45:00Z",
      eligibleAt: "2024-01-17T15:45:00Z",
      trackingAdded: true,
      daysRemaining: 0,
    },
    {
      id: 3,
      sellerId: "emma-k",
      sellerName: "Emma K.",
      sellerAvatar: "/short-haired-woman.png",
      amount: 31.5,
      platformFee: 3.5,
      originalAmount: 35.0,
      status: "on_hold",
      orderId: "ORD-003",
      itemTitle: "Cozy Sweater",
      buyerName: "Sarah M.",
      completedAt: "2024-01-13T09:15:00Z",
      eligibleAt: null,
      trackingAdded: false,
      daysRemaining: null,
    },
    {
      id: 4,
      sellerId: "mia-c",
      sellerName: "Mia C.",
      sellerAvatar: "/woman-dark-hair.png",
      amount: 25.2,
      platformFee: 2.8,
      originalAmount: 28.0,
      status: "released",
      orderId: "ORD-004",
      itemTitle: "Workout Leggings",
      buyerName: "Lisa R.",
      completedAt: "2024-01-08T14:20:00Z",
      eligibleAt: "2024-01-15T14:20:00Z",
      trackingAdded: true,
      daysRemaining: null,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_release":
        return "secondary"
      case "ready_to_release":
        return "default"
      case "on_hold":
        return "destructive"
      case "released":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_release":
        return <Clock className="h-4 w-4" />
      case "ready_to_release":
        return <CheckCircle className="h-4 w-4" />
      case "on_hold":
        return <AlertCircle className="h-4 w-4" />
      case "released":
        return <DollarSign className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">Manage Payouts</h1>
              <p className="text-brown-600">Review and release seller payouts</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400 h-4 w-4" />
              <Input placeholder="Search payouts..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seller Payouts</CardTitle>
            <CardDescription>Manage seller payment releases and holds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Image
                    src={payout.sellerAvatar || "/placeholder.svg"}
                    alt={payout.sellerName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-brown-900 flex items-center gap-2">
                          {payout.sellerName}
                          <Badge variant={getStatusColor(payout.status)} className="flex items-center gap-1">
                            {getStatusIcon(payout.status)}
                            {payout.status.replace("_", " ")}
                          </Badge>
                        </h3>
                        <p className="text-sm text-brown-600">
                          Order #{payout.orderId} • {payout.itemTitle}
                        </p>
                        <p className="text-sm text-brown-500">
                          Sold to {payout.buyerName} • {new Date(payout.completedAt).toLocaleDateString()}
                        </p>

                        {payout.status === "pending_release" && payout.daysRemaining !== null && (
                          <p className="text-xs text-orange-600 mt-1">
                            {payout.daysRemaining} days remaining until eligible
                          </p>
                        )}

                        {payout.status === "on_hold" && !payout.trackingAdded && (
                          <p className="text-xs text-red-600 mt-1">Waiting for tracking information</p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-brown-900">${payout.amount.toFixed(2)}</p>
                        <p className="text-xs text-brown-500">
                          ${payout.originalAmount.toFixed(2)} - ${payout.platformFee.toFixed(2)} fee
                        </p>

                        {payout.eligibleAt && (
                          <p className="text-xs text-brown-500 mt-1">
                            Eligible: {new Date(payout.eligibleAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {payout.status === "ready_to_release" && (
                      <Button size="sm" className="text-green-600 hover:text-green-700">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Release
                      </Button>
                    )}

                    {payout.status === "on_hold" && (
                      <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700 bg-transparent">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Eligible
                      </Button>
                    )}

                    <Link href={`/admin/orders/${payout.orderId}`}>
                      <Button size="sm" variant="outline">
                        View Order
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
