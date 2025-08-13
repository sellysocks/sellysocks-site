"use client"

import { useState } from "react"
import { MobileLayout } from "@/components/mobile/mobile-layout"
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
      <MobileLayout title="Sign In Required" showBack={false} showPublic={false} showSettings={false} showMenu={false}>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-4">Sign In Required</h2>
          <p className="text-[#B4B6C2] mb-6">You need to be signed in to view your sales.</p>
          <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </MobileLayout>
    )
  }

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <MobileLayout title="My Sales" subtitle="Manage your listings and track sales">
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Your Items</h2>
            <p className="text-sm text-[#B4B6C2]">{mockItems.length} total items</p>
          </div>
          <Button asChild size="sm" className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            <Link href="/sell">
              <Plus className="h-4 w-4 mr-1" />
              List Item
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#15161C] border border-[#262833]">
            <TabsTrigger value="items" className="data-[state=active]:bg-[#FF4D8D] data-[state=active]:text-white">
              My Items ({mockItems.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#FF4D8D] data-[state=active]:text-white">
              Sales ({mockOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="mt-6">
            {/* Filters */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B4B6C2] h-4 w-4" />
                <Input
                  placeholder="Search your items..."
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
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="removed">Removed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="bg-[#15161C] border-[#262833]">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#262833] flex-shrink-0 relative">
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1">
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
                            className="text-xs px-1 py-0"
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
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-white text-sm line-clamp-1">{item.title}</h3>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="secondary" className="text-xs bg-[#262833] text-[#B4B6C2] border-0">
                                Size {item.size}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-[#262833] text-[#B4B6C2]">
                                {item.condition}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#FF4D8D] text-sm">£{item.price}</div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-8 h-8 p-0 border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#15161C] border-[#262833]">
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
                                <DropdownMenuItem className="text-red-400">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#B4B6C2]">
                          <span>{item.views} views</span>
                          <span>{item.likes} likes</span>
                          <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>

                        {item.status === "sold" && (
                          <div className="mt-2 pt-2 border-t border-[#262833]">
                            <div className="text-xs text-green-400">
                              Sold on {new Date(item.soldAt!).toLocaleDateString()} for £{item.soldPrice}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-[#B4B6C2] mb-4">No items found matching your criteria.</div>
                <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
                  <Link href="/sell">List Your First Item</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="space-y-3">
              {mockOrders.map((order) => (
                <Card key={order.id} className="bg-[#15161C] border-[#262833]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-white text-sm mb-1">{order.itemTitle}</h3>
                        <p className="text-xs text-[#B4B6C2]">Sold to {order.buyerName}</p>
                      </div>
                      <Badge variant="secondary" className="bg-[#262833] text-[#B4B6C2] border-0">
                        Completed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#B4B6C2]">Sale Price:</span>
                        <div className="font-medium text-white">£{order.price}</div>
                      </div>
                      <div>
                        <span className="text-[#B4B6C2]">Platform Fee:</span>
                        <div className="font-medium text-white">-£{order.platformFee}</div>
                      </div>
                      <div>
                        <span className="text-[#B4B6C2]">Your Earnings:</span>
                        <div className="font-medium text-green-400">£{order.netEarnings}</div>
                      </div>
                      <div>
                        <span className="text-[#B4B6C2]">Order Date:</span>
                        <div className="font-medium text-white">{new Date(order.orderDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockOrders.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-[#B4B6C2] mb-4">No sales yet. Start by listing some items!</div>
                  <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
                    <Link href="/sell">List Your First Item</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
