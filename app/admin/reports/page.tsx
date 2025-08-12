import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle, MessageSquare, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AdminReports() {
  // Mock reports data
  const reports = [
    {
      id: 1,
      type: "inappropriate_content",
      itemId: 2,
      itemTitle: "Designer Heels",
      sellerId: "emma-k",
      sellerName: "Emma K.",
      reporterId: "anonymous",
      reporterName: "Anonymous User",
      reason: "Item appears to be counterfeit",
      description: "The brand logo looks fake and the quality seems poor based on the photos.",
      status: "open",
      createdAt: "2024-01-15T10:30:00Z",
      priority: "high",
      itemImage: "/elegant-high-heels.png",
    },
    {
      id: 2,
      type: "seller_behavior",
      itemId: null,
      itemTitle: null,
      sellerId: "mia-c",
      sellerName: "Mia C.",
      reporterId: "user123",
      reporterName: "Sarah M.",
      reason: "Harassment in messages",
      description: "Seller sent inappropriate messages after I asked questions about sizing.",
      status: "investigating",
      createdAt: "2024-01-14T15:45:00Z",
      priority: "high",
      itemImage: null,
    },
    {
      id: 3,
      type: "transaction_issue",
      itemId: 5,
      itemTitle: "Vintage Jacket",
      sellerId: "lisa-r",
      sellerName: "Lisa R.",
      reporterId: "buyer456",
      reporterName: "Emma K.",
      reason: "Item not as described",
      description: "Item has significant damage that was not mentioned in the listing.",
      status: "resolved",
      createdAt: "2024-01-12T09:15:00Z",
      priority: "medium",
      itemImage: "/vintage-jacket.png",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "investigating":
        return "secondary"
      case "resolved":
        return "default"
      case "dismissed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      case "low":
        return "text-green-600"
      default:
        return "text-brown-600"
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">Manage Reports</h1>
              <p className="text-brown-600">Handle user reports and disputes</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400 h-4 w-4" />
              <Input placeholder="Search reports..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${getPriorityColor(report.priority)}`} />
                      Report #{report.id} - {report.reason}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
                      <Badge variant="outline" className={getPriorityColor(report.priority)}>
                        {report.priority} priority
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Report Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-medium text-brown-900 mb-2">Report Details</h4>
                      <p className="text-sm text-brown-700 bg-brown-50 p-3 rounded-lg">{report.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-brown-900 mb-1">Reported By</h5>
                        <p className="text-sm text-brown-600">{report.reporterName}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-brown-900 mb-1">Report Type</h5>
                        <p className="text-sm text-brown-600">{report.type.replace("_", " ")}</p>
                      </div>
                    </div>

                    {report.itemId && (
                      <div className="flex items-center gap-3 p-3 bg-brown-50 rounded-lg">
                        {report.itemImage && (
                          <Image
                            src={report.itemImage || "/placeholder.svg"}
                            alt={report.itemTitle || ""}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h5 className="font-medium text-brown-900">Reported Item</h5>
                          <p className="text-sm text-brown-600">
                            <Link href={`/item/${report.itemId}`} className="hover:underline">
                              {report.itemTitle}
                            </Link>
                          </p>
                          <p className="text-xs text-brown-500">
                            by{" "}
                            <Link href={`/seller/${report.sellerId}`} className="hover:underline">
                              {report.sellerName}
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-brown-900 mb-3">Actions</h4>
                      <div className="space-y-2">
                        {report.status === "open" && (
                          <>
                            <Button size="sm" className="w-full">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Start Investigation
                            </Button>
                            <Button size="sm" variant="outline" className="w-full bg-transparent">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </>
                        )}

                        {report.status === "investigating" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-green-600 hover:text-green-700 bg-transparent"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve Report
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Dismiss Report
                            </Button>
                          </>
                        )}

                        {report.itemId && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-orange-600 hover:text-orange-700 bg-transparent"
                          >
                            Remove Listing
                          </Button>
                        )}
                      </div>
                    </div>

                    {report.status === "investigating" && (
                      <div>
                        <h5 className="font-medium text-brown-900 mb-2">Add Notes</h5>
                        <Textarea placeholder="Investigation notes..." className="text-sm" rows={3} />
                        <Button size="sm" className="mt-2 w-full">
                          Save Notes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
