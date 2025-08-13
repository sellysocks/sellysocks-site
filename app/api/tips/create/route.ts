import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, recipientId, senderId } = await request.json()

    // Retrieve the payment intent to get details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Here you would typically:
    // 1. Save the tip record to your database
    // 2. Create a notification for the recipient
    // 3. Update user balances if using internal wallet system

    const tipRecord = {
      id: paymentIntentId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      senderId,
      recipientId,
      recipientName: paymentIntent.metadata.recipientName,
      message: paymentIntent.metadata.message,
      platformFee: paymentIntent.metadata.platformFee,
      recipientAmount: paymentIntent.metadata.recipientAmount,
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    // TODO: Save to database
    console.log("Tip completed:", tipRecord)

    return NextResponse.json({
      success: true,
      tip: tipRecord,
    })
  } catch (error) {
    console.error("Error processing tip:", error)
    return NextResponse.json({ error: "Failed to process tip" }, { status: 500 })
  }
}
