import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("account_id")

    if (!accountId) {
      return NextResponse.redirect(new URL("/profile?error=missing_account_id", request.url))
    }

    // Verify account setup is complete
    const account = await stripe.accounts.retrieve(accountId)

    if (!account.charges_enabled || !account.payouts_enabled) {
      // Redirect back to onboarding if not complete
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile?refresh=true`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/connect/return?account_id=${accountId}`,
        type: "account_onboarding",
      })
      return NextResponse.redirect(accountLink.url)
    }

    // Update user profile with Stripe account ID
    const cookieStore = cookies()
    const userCookie = cookieStore.get("user")

    if (userCookie) {
      const user = JSON.parse(userCookie.value)
      // In a real app, this would update Firebase
      // For now, we'll set a cookie to simulate the update
      const updatedProfile = {
        ...user.profile,
        stripeAccountId: accountId,
        payoutsEnabled: true,
      }

      const updatedUser = {
        ...user,
        profile: updatedProfile,
      }

      const response = NextResponse.redirect(new URL("/profile?success=payouts_connected", request.url))
      response.cookies.set("user", JSON.stringify(updatedUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response
    }

    return NextResponse.redirect(new URL("/profile?success=payouts_connected", request.url))
  } catch (error) {
    console.error("Stripe Connect return error:", error)
    return NextResponse.redirect(new URL("/profile?error=stripe_connection_failed", request.url))
  }
}
