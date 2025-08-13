import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get("user")

    if (!userCookie) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    const user = JSON.parse(userCookie.value)
    const userId = user.uid

    // Create Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: "express",
      country: "GB", // UK for now, can be made dynamic
      email: user.email,
      metadata: {
        userId: userId,
      },
    })

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/connect/return?account_id=${account.id}`,
      type: "account_onboarding",
    })

    return NextResponse.redirect(accountLink.url)
  } catch (error) {
    console.error("Stripe Connect onboarding error:", error)
    return NextResponse.redirect(new URL("/profile?error=stripe_onboarding_failed", request.url))
  }
}
