"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Mock data for seller's items
const mockItems = [
  {
    id: "1",
    title: "Cozy Cotton Socks",
    price: 25,
    size: "M",
    condition: "Gently Used",
    status: "active",
    views: 127,
    likes: 23,
    images: ["/cozy-cotton-socks.png"],
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    title: "Athletic Compression Socks",
    price: 30,
    size: "M",
    condition: "Well Loved",
    status: "sold",
    views: 89,
    likes: 15,
    images: ["/placeholder-31rk0.png"],
    createdAt: "2024-01-18",
    soldAt: "2024-01-25",
    soldPrice: 30,
  },
  {
    id: "3",
    title: "Yoga Practice Socks",
    price: 22,
    size: "M",
    condition: "Gently Used",
    status: "pending",
    views: 45,
    likes: 8,
    images: ["/placeholder-sgri9.png"],
    createdAt: "2024-01-15",
  },
]

const mockOrders = [
  {
    id: "order-1",
    itemId: "2",
    itemTitle: "Athletic Compression Socks",
    buyerName: "Sarah M.",
    price: 30,
    platformFee: 3,
    netEarnings: 27,
    status: "completed",
    orderDate: "2024-01-25",
    shippingStatus: "delivered",
  },
]

export default function SalesPage() {
  const { user, profile } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view your sales.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Sales</h1>
            <p className="text-muted-foreground">Manage your listings and track your sales</p>
          </div>
          <Button asChild>
            <Link href="/sell">
              <Plus className="h-4 w-4 mr-2" />
              List New Item
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">My Items ({mockItems.length})</TabsTrigger>
            <TabsTrigger value="orders">Sales History ({mockOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="mt-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search your items..."
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
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="removed">Removed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant={
                          item.status === "active"
                            ? "default"
                            : item.status === "sold"
                              ? "secondary"
                              : item.status === "pending"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {item.status === "active"
                          ? "Live"
                          : item.status === "sold"
                            ? "Sold"
                            : item.status === "pending"
                              ? "Pending"
                              : "Removed"}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/item/${item.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Item
                            </Link>
                          </DropdownMenuItem>
                          {item.status === "active" && (
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                      <span className="font-bold text-primary">£{item.price}</span>
                    </div>

                    <div className="flex gap-1 mb-3 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        Size {item.size}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.condition}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.views} views</span>
                      <span>{item.likes} likes</span>
                      <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    {item.status === "sold" && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="text-xs text-green-600">
                          Sold on {new Date(item.soldAt!).toLocaleDateString()} for £{item.soldPrice}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No items found matching your criteria.</div>
                <Button asChild>
                  <Link href="/sell">List Your First Item</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium mb-1">{order.itemTitle}</h3>
                        <p className="text-sm text-muted-foreground">Sold to {order.buyerName}</p>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Sale Price:</span>
                        <div className="font-medium">£{order.price}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Platform Fee:</span>
                        <div className="font-medium">-£{order.platformFee}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Your Earnings:</span>
                        <div className="font-medium text-green-600">£{order.netEarnings}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Order Date:</span>
                        <div className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockOrders.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">No sales yet. Start by listing some items!</div>
                  <Button asChild>
                    <Link href="/sell">List Your First Item</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
