"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MobileLayout } from "@/components/mobile/mobile-layout"

export default function ProfileSetupPage() {
  const { profile, updateProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [displayName, setDisplayName] = useState(profile?.displayName || "")
  const [handle, setHandle] = useState("")
  const [bio, setBio] = useState(profile?.bio || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName.trim() || !handle.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in your display name and handle.",
        variant: "destructive",
      })
      return
    }

    if (handle.length < 3) {
      toast({
        title: "Handle too short",
        description: "Your handle must be at least 3 characters long.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Update profile with new information
      await updateProfile({
        displayName: displayName.trim(),
        handle: handle.trim().toLowerCase(),
        bio: bio.trim(),
      })

      toast({
        title: "Profile updated!",
        description: "Your profile has been set up successfully.",
      })

      router.push("/profile")
    } catch (error) {
      console.error("Profile setup error:", error)
      toast({
        title: "Setup failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <MobileLayout title="Setup Profile" subtitle="Complete your profile to get started">
      <div className="p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-white">Welcome to Selly Socks!</h1>
          <p className="text-muted-foreground">Let's set up your profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-white">
              Display Name *
            </Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name"
              className="bg-card border-border text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handle" className="text-white">
              Handle *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                id="handle"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                placeholder="username"
                className="bg-card border-border text-white pl-8"
                required
                minLength={3}
                maxLength={20}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This will be your unique username (3-20 characters, letters, numbers, and underscores only)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself..."
              className="bg-card border-border text-white resize-none"
              rows={3}
              maxLength={150}
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/150 characters</p>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={loading}>
              {loading ? "Setting up..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </div>
    </MobileLayout>
  )
}
