import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("account_id")

    if (!accountId) {
      return NextResponse.json({ error: "Missing account ID" }, { status: 400 })
    }

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

    // Mock bank account data for demo (in production, use actual Stripe data)
    const bankAccount = externalAccounts.data[0] || {
      last4: "1234",
      bank_name: "Demo Bank",
      account_type: "checking",
    }

    const payoutData = {
      balance: {
        available: balance.available[0]?.amount || 0,
        pending: balance.pending[0]?.amount || 0,
      },
      bankAccount: {
        last4: bankAccount.last4 || "1234",
        bankName: bankAccount.bank_name || "Demo Bank",
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
  } catch (error) {
    console.error("Stripe payouts API error:", error)
    return NextResponse.json({ error: "Failed to fetch payout data" }, { status: 500 })
  }
}
