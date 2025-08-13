"use client"

import type React from "react"

import { useState } from "react"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { SectionCard } from "@/components/mobile/section-card"
import { FormField } from "@/components/mobile/form-field"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Camera, Star, Award, TrendingUp, Package } from "lucide-react"
import Link from "next/link"

export default function AccountPage() {
  const { user, profile, logout } = useAuth()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    displayName: profile?.displayName || "",
    bio: profile?.bio || "",
    location: "",
    instagram: "",
    twitter: "",
  })

  const [loading, setLoading] = useState(false)

  if (!user || !profile) {
    return (
      <MobileLayout title="Sign In Required" showBack={false} showPublic={false} showSettings={false} showMenu={false}>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-4">Sign In Required</h2>
          <p className="text-[#B4B6C2] mb-6">You need to be signed in to access your account.</p>
          <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </MobileLayout>
    )
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Here you would update the user profile in Firestore
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <MobileLayout title="Account" subtitle="Manage your profile and settings">
      {/* Profile Picture */}
      <SectionCard title="Profile Picture">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.displayName} />
              <AvatarFallback className="text-xl bg-[#262833] text-white">
                {profile.displayName?.[0] || profile.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-[#FF4D8D] hover:bg-[#FF4D8D]/90"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-medium text-white">{profile.displayName}</span>
            {profile.verifiedSeller && (
              <Badge className="bg-[#FF4D8D] text-white border-0">
                <Award className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-[#B4B6C2]">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      </SectionCard>

      {/* Profile Information */}
      <SectionCard title="Profile Information">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <FormField
            label="Display Name"
            value={profileData.displayName}
            onChange={(value) => setProfileData({ ...profileData, displayName: value })}
            placeholder="Your display name"
          />

          <FormField
            label="Bio"
            value={profileData.bio}
            onChange={(value) => setProfileData({ ...profileData, bio: value })}
            placeholder="Tell people about yourself and what makes your items special..."
            multiline
            rows={4}
          />

          <FormField
            label="Location"
            value={profileData.location}
            onChange={(value) => setProfileData({ ...profileData, location: value })}
            placeholder="City, Country"
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Instagram"
              value={profileData.instagram}
              onChange={(value) => setProfileData({ ...profileData, instagram: value })}
              placeholder="@username"
            />
            <FormField
              label="Twitter/X"
              value={profileData.twitter}
              onChange={(value) => setProfileData({ ...profileData, twitter: value })}
              placeholder="@username"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </SectionCard>

      {/* Statistics */}
      <SectionCard title="Your Statistics">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <Package className="h-6 w-6 mx-auto mb-2 text-[#FF4D8D]" />
            <div className="text-lg font-bold text-white">{profile.stats.itemsSold}</div>
            <div className="text-xs text-[#B4B6C2]">Items Sold</div>
          </div>
          <div className="text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold text-white">£{profile.stats.totalEarnings}</div>
            <div className="text-xs text-[#B4B6C2]">Total Earnings</div>
          </div>
          <div className="text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-lg font-bold text-white">{profile.stats.rating}</div>
            <div className="text-xs text-[#B4B6C2]">Average Rating</div>
          </div>
          <div className="text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-bold text-white">{profile.stats.reviewCount}</div>
            <div className="text-xs text-[#B4B6C2]">Reviews</div>
          </div>
        </div>
      </SectionCard>

      {/* Account Settings */}
      <SectionCard title="Account Settings">
        <div className="space-y-4">
          <FormField label="Email Address" value={profile.email} disabled placeholder="Email address" />
          <p className="text-xs text-[#B4B6C2]">Contact support to change your email address</p>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Account Type</label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#262833] text-[#B4B6C2] border-0">
                {profile.role === "admin" ? "Administrator" : "User"}
              </Badge>
              {profile.verifiedSeller && <Badge className="bg-[#FF4D8D] text-white border-0">Verified Seller</Badge>}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent"
          >
            Change Password
          </Button>
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard title="Danger Zone">
        <Button
          variant="outline"
          onClick={() => logout()}
          className="w-full border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
        >
          Sign Out
        </Button>
      </SectionCard>
    </MobileLayout>
  )
}
