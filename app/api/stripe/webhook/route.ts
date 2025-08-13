import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { orderId, sellerAccountId, platformFee } = paymentIntent.metadata

        // Create order record in database
        const orderData = {
          id: orderId,
          paymentIntentId: paymentIntent.id,
          sellerId: sellerAccountId,
          buyerId: paymentIntent.customer,
          amount: paymentIntent.amount,
          platformFee: Number.parseInt(platformFee || "0"),
          sellerAmount: paymentIntent.amount - Number.parseInt(platformFee || "0"),
          currency: paymentIntent.currency,
          status: "paid",
          payoutStatus: "hold", // Hold funds until delivery confirmed
          createdAt: new Date(paymentIntent.created * 1000),
          paidAt: new Date(),
        }

        // In production, save to Firebase/database
        console.log("Order created:", orderData)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { orderId } = paymentIntent.metadata

        // Update order status to failed
        console.log(`Payment failed for order ${orderId}:`, paymentIntent.last_payment_error?.message)
        break
      }

      case "transfer.created": {
        const transfer = event.data.object as Stripe.Transfer
        console.log(`Transfer created: ${transfer.id} for ${transfer.amount}`)
        break
      }

      case "payout.paid": {
        const payout = event.data.object as Stripe.Payout
        console.log(`Payout completed: ${payout.id} for ${payout.amount}`)
        break
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const { orderId, sellerId, shippingInfo, specialInstructions } = session.metadata!

        // Legacy support for existing checkout sessions
        console.log(`Checkout session completed for order ${orderId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
