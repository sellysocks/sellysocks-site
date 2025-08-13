import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, sellerAccountId, platformFee } = await request.json()

    if (!orderId || !amount || !sellerAccountId || !platformFee) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create payment intent with destination charge (splits payment)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      payment_method_types: ["card", "apple_pay", "google_pay"],
      transfer_data: {
        destination: sellerAccountId,
      },
      application_fee_amount: platformFee,
      metadata: {
        orderId,
        sellerAccountId,
        platformFee: platformFee.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Create payment intent error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
