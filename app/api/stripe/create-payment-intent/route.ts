import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, sellerAccountId, platformFee } = await request.json()

    if (!orderId || !amount || !sellerAccountId || !platformFee) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const isDemoAccount = sellerAccountId.startsWith("acct_demo") || sellerAccountId.startsWith("acct_seller")

    const paymentIntentConfig: any = {
      amount,
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: {
        orderId,
        sellerAccountId,
        platformFee: platformFee.toString(),
        isDemoAccount: isDemoAccount.toString(),
      },
    }

    if (!isDemoAccount) {
      paymentIntentConfig.transfer_data = {
        destination: sellerAccountId,
      }
      paymentIntentConfig.application_fee_amount = platformFee
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentConfig)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      isDemoAccount,
    })
  } catch (error) {
    console.error("Create payment intent error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
