"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, Package, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye } from "lucide-react"
import Link from "next/link"

// Mock admin order data
const mockAdminOrders = [
  {
    id: "order-1",
    paymentIntentId: "pi_test123",
    itemTitle: "Silk Stockings",
    sellerName: "Sophie",
    buyerEmail: "buyer@example.com",
    amount: 5349, // £53.49 in pence
    platformFee: 450, // £4.50 in pence
    sellerAmount: 4050, // £40.50 in pence
    status: "delivered",
    payoutStatus: "hold",
    createdAt: "2024-01-20T10:00:00Z",
    paidAt: "2024-01-20T10:05:00Z",
    deliveredAt: "2024-01-23T16:45:00Z",
    canReleasePayout: true,
    canRefund: true,
  },
  {
    id: "order-2",
    paymentIntentId: "pi_test456",
    itemTitle: "Athletic Ankle Socks",
    sellerName: "Maya",
    buyerEmail: "customer@example.com",
    amount: 2199, // £21.99 in pence
    platformFee: 220, // £2.20 in pence
    sellerAmount: 1799, // £17.99 in pence
    status: "shipped",
    payoutStatus: "hold",
    createdAt: "2024-01-22T14:00:00Z",
    paidAt: "2024-01-22T14:05:00Z",
    canReleasePayout: false,
    canRefund: true,
  },
  {
    id: "order-3",
    paymentIntentId: "pi_test789",
    itemTitle: "Lace Thigh Highs",
    sellerName: "Aria",
    buyerEmail: "user@example.com",
    amount: 3899, // £38.99 in pence
    platformFee: 390, // £3.90 in pence
    sellerAmount: 3509, // £35.09 in pence
    status: "delivered",
    payoutStatus: "released",
    createdAt: "2024-01-18T09:00:00Z",
    paidAt: "2024-01-18T09:05:00Z",
    deliveredAt: "2024-01-20T11:30:00Z",
    payoutAt: "2024-01-21T10:00:00Z",
    canReleasePayout: false,
    canRefund: false,
  },
]

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState(mockAdminOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [payoutFilter, setPayoutFilter] = useState("all")
  const [loading, setLoading] = useState<string | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayout = payoutFilter === "all" || order.payoutStatus === payoutFilter

    return matchesSearch && matchesStatus && matchesPayout
  })

  const handleReleasePayout = async (orderId: string) => {
    setLoading(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/release-payout`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Payout released",
          description: "The payout has been manually released to the seller.",
        })

        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, payoutStatus: "released", payoutAt: new Date().toISOString(), canReleasePayout: false }
              : order,
          ),
        )
      } else {
        throw new Error("Failed to release payout")
      }
    } catch (error) {
      toast({
        title: "Failed to release payout",
        description: "Please try again or check the logs.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleRefundOrder = async (orderId: string) => {
    setLoading(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Refund processed",
          description: "The order has been refunded to the buyer.",
        })

        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, status: "refunded", payoutStatus: "cancelled", canRefund: false, canReleasePayout: false }
              : order,
          ),
        )
      } else {
        throw new Error("Failed to process refund")
      }
    } catch (error) {
      toast({
        title: "Failed to process refund",
        description: "Please try again or check the logs.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount / 100)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "shipped":
        return <Package className="w-4 h-4 text-blue-500" />
      case "refunded":
        return <RefreshCw className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getPayoutStatusColor = (status: string) => {
    switch (status) {
      case "released":
        return "default"
      case "hold":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">Order Management</h1>
          <p className="text-brown-600">Manage payments, payouts, and refunds</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={payoutFilter} onValueChange={setPayoutFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payout Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payouts</SelectItem>
                  <SelectItem value="hold">On Hold</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(order.status)}
                      <h3 className="font-semibold text-brown-900">{order.itemTitle}</h3>
                      <Badge variant="outline">#{order.id}</Badge>
                    </div>
                    <p className="text-sm text-brown-600">
                      Seller: <span className="font-medium">{order.sellerName}</span> • Buyer:{" "}
                      <span className="font-medium">{order.buyerEmail}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brown-900">{formatCurrency(order.amount)}</div>
                    <Badge variant={getPayoutStatusColor(order.payoutStatus)} className="mt-1">
                      {order.payoutStatus === "hold" ? "Payout On Hold" : `Payout ${order.payoutStatus}`}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-brown-600">Platform Fee:</span>
                    <span className="font-medium text-brown-900 ml-2">{formatCurrency(order.platformFee)}</span>
                  </div>
                  <div>
                    <span className="text-brown-600">Seller Amount:</span>
                    <span className="font-medium text-brown-900 ml-2">{formatCurrency(order.sellerAmount)}</span>
                  </div>
                  <div>
                    <span className="text-brown-600">Order Date:</span>
                    <span className="font-medium text-brown-900 ml-2">{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {order.deliveredAt && (
                  <div className="text-sm text-brown-600 mb-4">
                    <span>Delivered:</span>
                    <span className="font-medium text-brown-900 ml-2">{formatDate(order.deliveredAt)}</span>
                  </div>
                )}

                {order.payoutAt && (
                  <div className="text-sm text-brown-600 mb-4">
                    <span>Payout Released:</span>
                    <span className="font-medium text-brown-900 ml-2">{formatDate(order.payoutAt)}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-brown-200">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </Button>

                  {order.canReleasePayout && (
                    <Button
                      size="sm"
                      onClick={() => handleReleasePayout(order.id)}
                      disabled={loading === order.id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {loading === order.id ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <DollarSign className="w-4 h-4 mr-2" />
                      )}
                      Release Payout
                    </Button>
                  )}

                  {order.canRefund && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRefundOrder(order.id)}
                      disabled={loading === order.id}
                    >
                      {loading === order.id ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Refund Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-brown-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-brown-900 mb-2">No orders found</h3>
                <p className="text-brown-600">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
