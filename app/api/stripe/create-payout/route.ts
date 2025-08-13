import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { account_id, amount } = await request.json()

    if (!account_id || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Handle demo accounts
    if (account_id === "acct_demo123") {
      return NextResponse.json({
        id: "po_demo123",
        amount: amount,
        status: "pending",
        arrival_date: Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60, // 2 days from now
        created: Math.floor(Date.now() / 1000),
      })
    }

    // Create payout for real Stripe accounts
    const payout = await stripe.payouts.create(
      {
        amount: amount,
        currency: "gbp",
        method: "instant", // or "standard" for free but slower payouts
      },
      {
        stripeAccount: account_id,
      },
    )

    return NextResponse.json({
      id: payout.id,
      amount: payout.amount,
      status: payout.status,
      arrival_date: payout.arrival_date,
      created: payout.created,
    })
  } catch (error) {
    console.error("Stripe payout creation error:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create payout" }, { status: 500 })
  }
}
