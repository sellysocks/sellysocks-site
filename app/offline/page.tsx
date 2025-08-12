"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-brown-100 rounded-full flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-brown-600" />
          </div>
          <CardTitle className="text-2xl font-serif text-brown-900">You're Offline</CardTitle>
          <CardDescription>
            It looks like you've lost your internet connection. Some features may not be available.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full bg-transparent">
              Go to Homepage
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
