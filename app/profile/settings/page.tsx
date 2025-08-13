"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProfileSettingsPage() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const settingsItems = [
    { title: "Edit Profile", caption: "Update your information", href: "/profile/edit" },
    { title: "Privacy Settings", caption: "Control your visibility", href: "/profile/privacy" },
    { title: "Notifications", caption: "Manage your alerts", href: "/profile/notifications" },
    { title: "Payment Methods", caption: "Cards and accounts", href: "/profile/payment" },
    { title: "Shipping Address", caption: "Delivery preferences", href: "/profile/shipping" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-medium">Settings</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Account Settings */}
        <div className="space-y-2 mb-6">
          <h2 className="text-white font-medium mb-3">Account & Preferences</h2>
          {settingsItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="bg-card rounded-xl p-4 border border-border hover:bg-card/80 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.caption}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
