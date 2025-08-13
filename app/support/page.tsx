"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SupportPage() {
  const router = useRouter()

  const supportItems = [
    { title: "Contact Us", caption: "Get in touch with our team", href: "/contact" },
    { title: "Report an Issue", caption: "Report problems or violations", href: "/support/report" },
    { title: "Account Help", caption: "Login and account issues", href: "/support/account" },
    { title: "Payment Support", caption: "Billing and payment help", href: "/support/payment" },
    { title: "Seller Resources", caption: "Tips for selling successfully", href: "/support/seller" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-medium">Contact Support</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <div className="text-center mb-6">
          <h2 className="text-white font-medium mb-2">How can we help?</h2>
          <p className="text-muted-foreground text-sm">Choose a topic below or contact us directly</p>
        </div>

        <div className="space-y-2">
          {supportItems.map((item, index) => (
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
      </div>
    </div>
  )
}
