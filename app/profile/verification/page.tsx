"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Mail, Phone, Instagram, Twitter, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { useToast } from "@/hooks/use-toast"
import { VerificationBadges, VerificationLevelBadge } from "@/components/ui/verification-badges"

export default function VerificationPage() {
  const { profile, requestVerification, getVerificationLevel } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    phoneNumber: "",
    instagramUsername: "",
    twitterUsername: "",
    facebookUsername: "",
  })

  if (!profile) {
    return <div>Loading...</div>
  }

  const verificationLevel = getVerificationLevel()

  const handleVerification = async (type: string, data?: any) => {
    setLoading(type)
    try {
      await requestVerification(type, data)
      toast({
        title: "Verification requested",
        description: `Your ${type} verification has been submitted and will be reviewed within 24 hours.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification request",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const customHeader = (
    <div className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
      <Link href="/profile">
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <h1 className="text-lg font-semibold text-white">Verification</h1>
      <div className="w-8" />
    </div>
  )

  return (
    <MobileLayout customHeader={customHeader}>
      <div className="p-4 space-y-6">
        {/* Verification Level */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#FF4D8D]" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Level</span>
              <VerificationLevelBadge level={verificationLevel} size="md" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Verified Methods</span>
              <VerificationBadges verification={profile.verification} size="sm" maxBadges={3} />
            </div>
            <div className="text-sm text-gray-400">
              {verificationLevel === "none" && "Complete verifications to build trust with buyers"}
              {verificationLevel === "basic" && "Good start! Add more verifications to increase trust"}
              {verificationLevel === "verified" && "Well verified! You're building strong buyer confidence"}
              {verificationLevel === "premium" && "Excellent! You have maximum verification trust level"}
            </div>
          </CardContent>
        </Card>

        {/* Email Verification */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="text-white font-medium">Email Verification</h3>
                  <p className="text-gray-400 text-sm">Verify your email address</p>
                </div>
              </div>
              {profile.verification.email.verified ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleVerification("email")}
                  disabled={loading === "email"}
                  className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90"
                >
                  {loading === "email" ? "Verifying..." : "Verify"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Phone Verification */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-500" />
                <div>
                  <h3 className="text-white font-medium">Phone Verification</h3>
                  <p className="text-gray-400 text-sm">Verify your phone number</p>
                </div>
              </div>
              {profile.verification.phone.verified ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge className="bg-gray-600 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>
            {!profile.verification.phone.verified && (
              <div className="flex gap-2">
                <Input
                  placeholder="+44 7*** *** ***"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  size="sm"
                  onClick={() => handleVerification("phone", { phoneNumber: formData.phoneNumber })}
                  disabled={loading === "phone" || !formData.phoneNumber}
                  className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90"
                >
                  {loading === "phone" ? "Verifying..." : "Verify"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Media Verifications */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Social Media</h2>

          {/* Instagram */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <div>
                    <h3 className="text-white font-medium">Instagram</h3>
                    <p className="text-gray-400 text-sm">Connect your Instagram account</p>
                  </div>
                </div>
                {profile.verification.socialMedia.instagram.verified ? (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-gray-600 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
              {!profile.verification.socialMedia.instagram.verified && (
                <div className="flex gap-2">
                  <Input
                    placeholder="@username"
                    value={formData.instagramUsername}
                    onChange={(e) => setFormData({ ...formData, instagramUsername: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleVerification("instagram", { username: formData.instagramUsername })}
                    disabled={loading === "instagram" || !formData.instagramUsername}
                    className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90"
                  >
                    {loading === "instagram" ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Twitter */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Twitter className="h-5 w-5 text-sky-500" />
                  <div>
                    <h3 className="text-white font-medium">Twitter</h3>
                    <p className="text-gray-400 text-sm">Connect your Twitter account</p>
                  </div>
                </div>
                {profile.verification.socialMedia.twitter.verified ? (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-gray-600 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
              {!profile.verification.socialMedia.twitter.verified && (
                <div className="flex gap-2">
                  <Input
                    placeholder="@username"
                    value={formData.twitterUsername}
                    onChange={(e) => setFormData({ ...formData, twitterUsername: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleVerification("twitter", { username: formData.twitterUsername })}
                    disabled={loading === "twitter" || !formData.twitterUsername}
                    className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90"
                  >
                    {loading === "twitter" ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Identity Verification */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <h3 className="text-white font-medium">Identity Verification</h3>
                  <p className="text-gray-400 text-sm">Verify with government ID</p>
                </div>
              </div>
              {profile.verification.identity.verified ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleVerification("identity", { method: "government_id" })}
                  disabled={loading === "identity"}
                  className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90"
                >
                  {loading === "identity" ? "Verifying..." : "Verify ID"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  )
}
