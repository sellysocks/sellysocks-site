"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  MoreHorizontal,
  ChevronRight,
  Star,
  Heart,
  Settings,
  HelpCircle,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, profile, loading, needsProfileSetup } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
      return
    }

    if (!loading && user && needsProfileSetup()) {
      router.push("/profile/setup")
      return
    }
  }, [user, loading, needsProfileSetup, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const currentDay = new Date().toLocaleDateString([], { weekday: "long" })

  const navigationItems = [
    {
      icon: (
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
          <Heart className="w-4 h-4 text-accent" />
        </div>
      ),
      title: "My Listings",
      caption: `${profile.stats.itemsSold + 5} active items`,
      href: "/profile/listings",
    },
    {
      icon: (
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
          <Heart className="w-4 h-4 text-accent" />
        </div>
      ),
      title: "Favorites",
      caption: "12 saved items",
      href: "/profile/favorites",
    },
    {
      icon: (
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
          <Star className="w-4 h-4 text-accent" />
        </div>
      ),
      title: "Reviews",
      caption: `${profile.stats.rating} rating`,
      href: "/profile/reviews",
    },
    {
      icon: (
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
          <Settings className="w-4 h-4 text-accent" />
        </div>
      ),
      title: "Settings",
      caption: "Account & preferences",
      href: "/profile/settings",
    },
    {
      icon: (
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-accent" />
        </div>
      ),
      title: "Contact Support",
      caption: "Get help",
      href: "/support",
    },
    {
      icon: (
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-accent" />
        </div>
      ),
      title: "Help & FAQ",
      caption: "Learn more",
      href: "/help",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-white font-medium">{currentDay}</div>
            <div className="text-xs text-muted-foreground">{currentTime}</div>
          </div>

          <Button variant="ghost" size="sm" className="text-white hover:bg-card">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-6">
          {/* Top Profile Block */}
          <div className="text-center space-y-4">
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto">
              {profile.avatar ? (
                <img
                  src={profile.avatar || "/placeholder.svg"}
                  alt={profile.displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-accent/20"
                />
              ) : (
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center border-2 border-accent/20">
                  <span className="text-2xl font-semibold text-accent">
                    {profile.displayName?.charAt(0) || profile.email?.charAt(0) || "U"}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Handle */}
            <div>
              <h1 className="text-xl font-semibold text-white">{profile.displayName || "User"}</h1>
              <p className="text-muted-foreground">@{profile.handle || profile.email?.split("@")[0] || "user"}</p>
            </div>

            {/* Bio */}
            {profile.bio && <p className="text-muted-foreground text-sm max-w-xs mx-auto">{profile.bio}</p>}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-lg font-semibold text-white">{profile.stats.itemsSold}</div>
                <div className="text-xs text-muted-foreground">Sold</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">15</div>
                <div className="text-xs text-muted-foreground">Bought</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white flex items-center justify-center gap-1">
                  {profile.stats.rating > 0 ? profile.stats.rating : "0.0"}
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="bg-card rounded-xl p-4 border border-border hover:bg-card/80 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.caption}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-pb">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-1 p-2">
            <div className="w-6 h-6 bg-muted-foreground/20 rounded"></div>
            <span className="text-xs text-muted-foreground">Home</span>
          </Link>
          <Link href="/sellers" className="flex flex-col items-center gap-1 p-2">
            <div className="w-6 h-6 bg-muted-foreground/20 rounded"></div>
            <span className="text-xs text-muted-foreground">Sellers</span>
          </Link>
          <Link href="/sell" className="flex flex-col items-center gap-1 p-2">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">+</span>
            </div>
            <span className="text-xs text-accent">Sell</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center gap-1 p-2">
            <div className="w-6 h-6 bg-muted-foreground/20 rounded"></div>
            <span className="text-xs text-muted-foreground">Messages</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 p-2">
            <div className="w-6 h-6 bg-accent rounded"></div>
            <span className="text-xs text-accent">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
