"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MoreHorizontal, CreditCard, Clock, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

interface PayoutData {
  balance: {
    available: number
    pending: number
  }
  bankAccount: {
    last4: string
    bankName: string
    accountType: string
  }
  recentPayouts: Array<{
    id: string
    amount: number
    status: "paid" | "pending" | "failed"
    created: number
    arrival_date: number
  }>
}

export default function PayoutsPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [payoutData, setPayoutData] = useState<PayoutData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
      return
    }

    if (!loading && (!profile?.stripeAccountId || !profile?.payoutsEnabled)) {
      router.push("/profile")
      return
    }
  }, [user, profile, loading, router])

  useEffect(() => {
    if (profile?.stripeAccountId) {
      fetchPayoutData()
    }
  }, [profile?.stripeAccountId])

  const fetchPayoutData = async () => {
    try {
      setDataLoading(true)
      const response = await fetch(`/api/stripe/payouts?account_id=${profile?.stripeAccountId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch payout data")
      }

      const data = await response.json()
      setPayoutData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payout data")
    } finally {
      setDataLoading(false)
    }
  }

  const handleUpdateBankInfo = () => {
    window.location.href = `/api/stripe/connect/update?account_id=${profile?.stripeAccountId}`
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user || !profile || !profile.stripeAccountId) {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Completed"
      case "pending":
        return "Processing"
      case "failed":
        return "Failed"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <div className="text-white font-medium">Payouts</div>
            <div className="text-xs text-muted-foreground">Manage your earnings</div>
          </div>

          <Button variant="ghost" size="sm" className="text-white hover:bg-card">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 space-y-6">
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="text-red-400 text-sm">{error}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchPayoutData}
              className="mt-2 text-red-400 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="text-muted-foreground text-sm mb-1">Available</div>
                <div className="text-xl font-semibold text-white">
                  {payoutData ? formatCurrency(payoutData.balance.available) : "£0.00"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Ready for payout</div>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="text-muted-foreground text-sm mb-1">Pending</div>
                <div className="text-xl font-semibold text-white">
                  {payoutData ? formatCurrency(payoutData.balance.pending) : "£0.00"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Processing</div>
              </div>
            </div>

            {/* Bank Account Info */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Bank Account</div>
                    <div className="text-sm text-muted-foreground">
                      {payoutData?.bankAccount
                        ? `${payoutData.bankAccount.bankName} •••• ${payoutData.bankAccount.last4}`
                        : "Loading..."}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpdateBankInfo}
                  className="text-accent hover:bg-accent/10"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <Button onClick={handleUpdateBankInfo} className="w-full bg-accent hover:bg-accent/90 text-white">
                Update Bank Info
              </Button>
            </div>

            {/* Recent Payouts */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium text-white">Recent Payouts</h3>
                <p className="text-sm text-muted-foreground">Your payout history</p>
              </div>

              <div className="divide-y divide-border">
                {payoutData?.recentPayouts && payoutData.recentPayouts.length > 0 ? (
                  payoutData.recentPayouts.map((payout) => (
                    <div key={payout.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(payout.status)}
                          <div>
                            <div className="font-medium text-white">{formatCurrency(payout.amount)}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(payout.created)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">{getStatusText(payout.status)}</div>
                          {payout.status === "pending" && (
                            <div className="text-xs text-muted-foreground">
                              Expected: {formatDate(payout.arrival_date)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-white font-medium mb-1">No payouts yet</div>
                    <div className="text-sm text-muted-foreground">
                      Your payouts will appear here once you start selling
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
