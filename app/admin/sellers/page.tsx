import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Eye, CheckCircle, XCircle, Shield, Star, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AdminSellers() {
  // Mock sellers data
  const sellers = [
    {
      id: "sarah-m",
      name: "Sarah M.",
      email: "sarah@example.com",
      avatar: "/curly-haired-woman.png",
      status: "verified",
      joinedAt: "2023-12-01",
      totalSales: 15,
      totalRevenue: 680,
      rating: 4.8,
      activeListings: 3,
      pendingVerification: false,
    },
    {
      id: "emma-k",
      name: "Emma K.",
      email: "emma@example.com",
      avatar: "/short-haired-woman.png",
      status: "pending_verification",
      joinedAt: "2024-01-10",
      totalSales: 2,
      totalRevenue: 145,
      rating: 5.0,
      activeListings: 1,
      pendingVerification: true,
    },
    {
      id: "lisa-r",
      name: "Lisa R.",
      email: "lisa@example.com",
      avatar: "/blonde-woman-portrait.png",
      status: "active",
      joinedAt: "2024-01-05",
      totalSales: 8,
      totalRevenue: 320,
      rating: 4.6,
      activeListings: 2,
      pendingVerification: false,
    },
    {
      id: "mia-c",
      name: "Mia C.",
      email: "mia@example.com",
      avatar: "/woman-dark-hair.png",
      status: "suspended",
      joinedAt: "2023-11-20",
      totalSales: 12,
      totalRevenue: 540,
      rating: 3.2,
      activeListings: 0,
      pendingVerification: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "default"
      case "active":
        return "secondary"
      case "pending_verification":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">Manage Sellers</h1>
              <p className="text-brown-600">Verify and manage seller accounts</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400 h-4 w-4" />
              <Input placeholder="Search sellers..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Sellers</CardTitle>
            <CardDescription>Manage seller accounts and verifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sellers.map((seller) => (
                <div key={seller.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Image
                    src={seller.avatar || "/placeholder.svg"}
                    alt={seller.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-brown-900 flex items-center gap-2">
                          {seller.name}
                          {seller.status === "verified" && <Shield className="h-4 w-4 text-blue-600" />}
                        </h3>
                        <p className="text-sm text-brown-600">{seller.email}</p>
                        <p className="text-sm text-brown-500">Joined {seller.joinedAt}</p>
                      </div>

                      <div className="text-right">
                        <Badge variant={getStatusColor(seller.status)}>{seller.status.replace("_", " ")}</Badge>
                        {seller.pendingVerification && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Verification Pending
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-2 text-sm text-brown-600">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {seller.totalSales} sales
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {seller.rating} rating
                      </div>
                      <div>${seller.totalRevenue} revenue</div>
                      <div>{seller.activeListings} active listings</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/seller/${seller.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    {seller.status === "pending_verification" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 bg-transparent"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {seller.status === "verified" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 hover:text-orange-700 bg-transparent"
                      >
                        Suspend
                      </Button>
                    )}

                    {seller.status === "suspended" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 bg-transparent"
                      >
                        Reactivate
                      </Button>
                    )}
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
