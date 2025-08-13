"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, Mail, Phone, Instagram, Twitter, Facebook, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerificationBadgesProps {
  verification: {
    email: { verified: boolean }
    phone: { verified: boolean }
    socialMedia: {
      instagram: { verified: boolean }
      twitter: { verified: boolean }
      facebook: { verified: boolean }
    }
    identity: { verified: boolean }
  }
  size?: "sm" | "md" | "lg"
  showLabels?: boolean
  maxBadges?: number
}

export function VerificationBadges({
  verification,
  size = "sm",
  showLabels = false,
  maxBadges = 6,
}: VerificationBadgesProps) {
  const badges = []

  // Identity verification (highest priority)
  if (verification.identity.verified) {
    badges.push({
      icon: Shield,
      label: "ID Verified",
      color: "bg-green-500",
      priority: 1,
    })
  }

  // Email verification
  if (verification.email.verified) {
    badges.push({
      icon: Mail,
      label: "Email",
      color: "bg-blue-500",
      priority: 2,
    })
  }

  // Phone verification
  if (verification.phone.verified) {
    badges.push({
      icon: Phone,
      label: "Phone",
      color: "bg-purple-500",
      priority: 3,
    })
  }

  // Social media verifications
  if (verification.socialMedia.instagram.verified) {
    badges.push({
      icon: Instagram,
      label: "Instagram",
      color: "bg-pink-500",
      priority: 4,
    })
  }

  if (verification.socialMedia.twitter.verified) {
    badges.push({
      icon: Twitter,
      label: "Twitter",
      color: "bg-sky-500",
      priority: 5,
    })
  }

  if (verification.socialMedia.facebook.verified) {
    badges.push({
      icon: Facebook,
      label: "Facebook",
      color: "bg-blue-600",
      priority: 6,
    })
  }

  // Sort by priority and limit
  const displayBadges = badges.sort((a, b) => a.priority - b.priority).slice(0, maxBadges)

  if (displayBadges.length === 0) {
    return null
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const badgeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {displayBadges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <Badge
            key={index}
            className={cn(
              "flex items-center gap-1 text-white border-0",
              badge.color,
              badgeClasses[size],
              !showLabels && "px-1",
            )}
          >
            <Icon className={sizeClasses[size]} />
            {showLabels && <span>{badge.label}</span>}
          </Badge>
        )
      })}
    </div>
  )
}

interface VerificationLevelBadgeProps {
  level: "none" | "basic" | "verified" | "premium"
  size?: "sm" | "md" | "lg"
}

export function VerificationLevelBadge({ level, size = "sm" }: VerificationLevelBadgeProps) {
  if (level === "none") return null

  const levelConfig = {
    basic: {
      label: "Basic",
      color: "bg-gray-500",
      icon: CheckCircle,
    },
    verified: {
      label: "Verified",
      color: "bg-[#FF4D8D]",
      icon: Shield,
    },
    premium: {
      label: "Premium",
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      icon: Shield,
    },
  }

  const config = levelConfig[level]
  const Icon = config.icon

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const badgeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  }

  return (
    <Badge className={cn("flex items-center gap-1 text-white border-0", config.color, badgeClasses[size])}>
      <Icon className={sizeClasses[size]} />
      <span>{config.label}</span>
    </Badge>
  )
}
