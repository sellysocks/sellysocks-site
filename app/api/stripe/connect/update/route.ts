import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("account_id")

    if (!accountId) {
      return NextResponse.redirect(new URL("/profile/payouts?error=missing_account_id", request.url))
    }

    // Create account link for updating account info
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/payouts?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/payouts?success=bank_updated`,
      type: "account_update",
    })

    return NextResponse.redirect(accountLink.url)
  } catch (error) {
    console.error("Stripe Connect update error:", error)
    return NextResponse.redirect(new URL("/profile/payouts?error=update_failed", request.url))
  }
}
