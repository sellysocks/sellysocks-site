import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { amount, recipientName, message } = await request.json()

    if (!amount || amount < 100) {
      // Minimum £1.00
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "gbp",
      payment_method_types: ["card"],
      automatic_payment_methods: {
        enabled: true, // This enables Apple Pay, Google Pay, etc. automatically when available
      },
      metadata: {
        type: "tip",
        recipientName,
        message: message || "",
        platformFee: Math.round(amount * 0.05), // 5% platform fee
        recipientAmount: Math.round(amount * 0.95),
      },
      description: `Tip to ${recipientName}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
