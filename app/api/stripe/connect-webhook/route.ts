import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const connectWebhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, connectWebhookSecret)
    } catch (err) {
      console.error("Connect webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle Connect-specific events
    switch (event.type) {
      case "account.updated": {
        const account = event.data.object as Stripe.Account
        console.log(`Account updated: ${account.id}`)

        // Update seller account status in database
        // await updateSellerAccount(account.id, {
        //   chargesEnabled: account.charges_enabled,
        //   payoutsEnabled: account.payouts_enabled,
        //   detailsSubmitted: account.details_submitted
        // })
        break
      }

      case "transfer.created": {
        const transfer = event.data.object as Stripe.Transfer
        const { orderId, type } = transfer.metadata

        console.log(`Transfer created: ${transfer.id} for order ${orderId}`)

        // Update order payout status
        // await updateOrder(orderId, {
        //   payoutStatus: 'processing',
        //   transferId: transfer.id
        // })
        break
      }

      case "transfer.paid": {
        const transfer = event.data.object as Stripe.Transfer
        const { orderId } = transfer.metadata

        console.log(`Transfer completed: ${transfer.id} for order ${orderId}`)

        // Update order payout status
        // await updateOrder(orderId, {
        //   payoutStatus: 'released',
        //   payoutDate: new Date(transfer.created * 1000)
        // })
        break
      }

      case "transfer.failed": {
        const transfer = event.data.object as Stripe.Transfer
        const { orderId } = transfer.metadata

        console.log(`Transfer failed: ${transfer.id} for order ${orderId}`)

        // Update order payout status
        // await updateOrder(orderId, {
        //   payoutStatus: 'failed',
        //   payoutError: transfer.failure_message
        // })
        break
      }

      case "payout.created": {
        const payout = event.data.object as Stripe.Payout
        console.log(`Payout created: ${payout.id} for ${payout.amount}`)
        break
      }

      case "payout.paid": {
        const payout = event.data.object as Stripe.Payout
        console.log(`Payout completed: ${payout.id} for ${payout.amount}`)

        // Notify seller of successful payout
        // await notifySellerPayoutCompleted(payout)
        break
      }

      case "payout.failed": {
        const payout = event.data.object as Stripe.Payout
        console.log(`Payout failed: ${payout.id} - ${payout.failure_message}`)

        // Notify admin of failed payout
        // await notifyAdminPayoutFailed(payout)
        break
      }

      default:
        console.log(`Unhandled Connect event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Connect webhook error:", error)
    return NextResponse.json({ error: "Connect webhook handler failed" }, { status: 500 })
  }
}
