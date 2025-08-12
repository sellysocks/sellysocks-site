"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function FirebaseSetupBanner() {
  const { isFirebaseConfigured } = useAuth()

  if (isFirebaseConfigured) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b border-red-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900 mb-1">Firebase Configuration Required</h3>
                <p className="text-sm text-red-700 mb-3">
                  To enable authentication and full functionality, please set up your Firebase environment variables in
                  Project Settings.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-red-600">
                  <span>Required: NEXT_PUBLIC_FIREBASE_API_KEY</span>
                  <span>•</span>
                  <span>NEXT_PUBLIC_FIREBASE_PROJECT_ID</span>
                  <span>•</span>
                  <span>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</span>
                  <span>•</span>
                  <span>And 3 more...</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-white hover:bg-red-50 border-red-300 text-red-700"
                onClick={() => window.open("https://console.firebase.google.com", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Firebase Console
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
