import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Package, DollarSign, AlertTriangle, TrendingUp, Eye, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  // Mock admin stats
  const stats = {
    totalUsers: 1247,
    activeListings: 89,
    pendingReviews: 12,
    totalRevenue: 15420,
    pendingPayouts: 8,
    openReports: 3,
  }

  const recentActivity = [
    { id: 1, type: "listing", action: "New listing submitted", user: "Sarah M.", time: "2 hours ago" },
    { id: 2, type: "report", action: "Item reported", user: "Anonymous", time: "4 hours ago" },
    { id: 3, type: "payout", action: "Payout requested", user: "Emma K.", time: "6 hours ago" },
    { id: 4, type: "verification", action: "Seller verification submitted", user: "Lisa R.", time: "1 day ago" },
  ]

  const pendingItems = [
    { id: 1, title: "Vintage Band T-Shirt", seller: "Sarah M.", price: 45, status: "pending_review" },
    { id: 2, title: "Designer Heels", seller: "Emma K.", price: 120, status: "reported" },
    { id: 3, title: "Cozy Sweater", seller: "Lisa R.", price: 35, status: "pending_review" },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">Admin Dashboard</h1>
          <p className="text-brown-600">Manage your marketplace</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-brown-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brown-900">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-brown-600">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-brown-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brown-900">{stats.activeListings}</div>
              <p className="text-xs text-brown-600">{stats.pendingReviews} pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-brown-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brown-900">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-brown-600">Platform fees collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <TrendingUp className="h-4 w-4 text-brown-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brown-900">{stats.pendingPayouts}</div>
              <p className="text-xs text-brown-600">Awaiting release</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brown-900">{stats.openReports}</div>
              <p className="text-xs text-red-600">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/listings">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  Review Listings
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Handle Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-brown-900">{activity.action}</p>
                      <p className="text-xs text-brown-600">
                        by {activity.user} • {activity.time}
                      </p>
                    </div>
                    <Badge variant={activity.type === "report" ? "destructive" : "secondary"}>{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items Requiring Action</CardTitle>
              <CardDescription>Listings that need review or attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-brown-900">{item.title}</p>
                      <p className="text-xs text-brown-600">
                        by {item.seller} • ${item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.status === "reported" ? "destructive" : "secondary"}>
                        {item.status.replace("_", " ")}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
