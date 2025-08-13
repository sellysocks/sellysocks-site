import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("account_id")

    if (!accountId) {
      return NextResponse.json({ error: "Missing account ID" }, { status: 400 })
    }

    if (accountId === "acct_demo123" || accountId.startsWith("demo")) {
      const mockPayoutData = {
        balance: {
          available: 15420, // $154.20 in cents
          pending: 8750, // $87.50 in cents
        },
        bankAccount: {
          last4: "1234",
          bankName: "Demo Bank",
          accountType: "checking",
        },
        recentPayouts: [
          {
            id: "po_demo1",
            amount: 4500,
            status: "paid",
            created: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
            arrival_date: Math.floor(Date.now() / 1000) - 86400,
          },
          {
            id: "po_demo2",
            amount: 3200,
            status: "paid",
            created: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
            arrival_date: Math.floor(Date.now() / 1000) - 172800,
          },
          {
            id: "po_demo3",
            amount: 2800,
            status: "in_transit",
            created: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
            arrival_date: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
          },
        ],
      }

      return NextResponse.json(mockPayoutData)
    }

    try {
      // Fetch account balance
      const balance = await stripe.balance.retrieve({
        stripeAccount: accountId,
      })

      // Fetch external accounts (bank accounts)
      const externalAccounts = await stripe.accounts.listExternalAccounts(accountId, {
        object: "bank_account",
        limit: 1,
      })

      // Fetch recent payouts
      const payouts = await stripe.payouts.list(
        {
          limit: 10,
        },
        {
          stripeAccount: accountId,
        },
      )

      // Use actual Stripe data
      const bankAccount = externalAccounts.data[0] || {
        last4: "****",
        bank_name: "No bank account",
        account_type: "checking",
      }

      const payoutData = {
        balance: {
          available: balance.available[0]?.amount || 0,
          pending: balance.pending[0]?.amount || 0,
        },
        bankAccount: {
          last4: bankAccount.last4 || "****",
          bankName: bankAccount.bank_name || "No bank account",
          accountType: bankAccount.account_type || "checking",
        },
        recentPayouts: payouts.data.map((payout) => ({
          id: payout.id,
          amount: payout.amount,
          status: payout.status,
          created: payout.created,
          arrival_date: payout.arrival_date,
        })),
      }

      return NextResponse.json(payoutData)
    } catch (stripeError: any) {
      console.warn("Stripe account access error:", stripeError.message)

      const emptyPayoutData = {
        balance: {
          available: 0,
          pending: 0,
        },
        bankAccount: {
          last4: "****",
          bankName: "No bank account connected",
          accountType: "checking",
        },
        recentPayouts: [],
        needsOnboarding: true,
      }

      return NextResponse.json(emptyPayoutData)
    }
  } catch (error) {
    console.error("Stripe payouts API error:", error)
    return NextResponse.json({ error: "Failed to fetch payout data" }, { status: 500 })
  }
}
