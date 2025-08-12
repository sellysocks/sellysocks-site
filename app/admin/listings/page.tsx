import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AdminListings() {
  // Mock listings data
  const listings = [
    {
      id: 1,
      title: "Vintage Band T-Shirt",
      seller: "Sarah M.",
      sellerId: "sarah-m",
      price: 45,
      status: "pending_review",
      images: ["/placeholder-v18ka.png"],
      createdAt: "2024-01-15",
      category: "Clothing",
      reports: 0,
    },
    {
      id: 2,
      title: "Designer Heels",
      seller: "Emma K.",
      sellerId: "emma-k",
      price: 120,
      status: "reported",
      images: ["/elegant-high-heels.png"],
      createdAt: "2024-01-14",
      category: "Shoes",
      reports: 2,
    },
    {
      id: 3,
      title: "Cozy Sweater",
      seller: "Lisa R.",
      sellerId: "lisa-r",
      price: 35,
      status: "active",
      images: ["/cozy-sweater.png"],
      createdAt: "2024-01-13",
      category: "Clothing",
      reports: 0,
    },
    {
      id: 4,
      title: "Workout Leggings",
      seller: "Mia C.",
      sellerId: "mia-c",
      price: 28,
      status: "pending_review",
      images: ["/workout-leggings.png"],
      createdAt: "2024-01-12",
      category: "Activewear",
      reports: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending_review":
        return "secondary"
      case "reported":
        return "destructive"
      case "removed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">Manage Listings</h1>
              <p className="text-brown-600">Review and moderate marketplace listings</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400 h-4 w-4" />
              <Input placeholder="Search listings..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Listings</CardTitle>
            <CardDescription>Manage and moderate marketplace listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Image
                    src={listing.images[0] || "/placeholder.svg"}
                    alt={listing.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-brown-900">{listing.title}</h3>
                        <p className="text-sm text-brown-600">
                          by{" "}
                          <Link href={`/seller/${listing.sellerId}`} className="hover:underline">
                            {listing.seller}
                          </Link>
                        </p>
                        <p className="text-sm text-brown-500">
                          {listing.category} • Listed {listing.createdAt}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brown-900">${listing.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusColor(listing.status)}>{listing.status.replace("_", " ")}</Badge>
                          {listing.reports > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {listing.reports} reports
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/item/${listing.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    {listing.status === "pending_review" && (
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

                    {listing.status === "reported" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 hover:text-orange-700 bg-transparent"
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                    )}

                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
