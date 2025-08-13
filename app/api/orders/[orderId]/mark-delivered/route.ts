import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params

    // In production, fetch order from database
    // const order = await getOrderById(orderId)

    // Mock order data for demo
    const mockOrder = {
      id: orderId,
      paymentIntentId: "pi_test123",
      sellerAccountId: "acct_seller123",
      amount: 4500, // £45 in pence
      platformFee: 450, // £4.50 in pence
      status: "shipped",
      payoutStatus: "hold",
    }

    if (!mockOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (mockOrder.status === "delivered") {
      return NextResponse.json({ error: "Order already marked as delivered" }, { status: 400 })
    }

    // Update order status to delivered
    // await updateOrder(orderId, {
    //   status: 'delivered',
    //   deliveredDate: new Date(),
    //   payoutStatus: 'eligible'
    // })

    // Trigger automatic payout release (after 24 hour delay in production)
    await triggerPayoutRelease(mockOrder)

    return NextResponse.json({
      success: true,
      message: "Order marked as delivered, payout will be released within 24 hours",
    })
  } catch (error) {
    console.error("Mark delivered error:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}

async function triggerPayoutRelease(order: any) {
  try {
    // In production, this would be handled by a background job or webhook
    // For demo purposes, we'll simulate the payout release

    const sellerAmount = order.amount - order.platformFee

    // Create transfer to seller's connected account
    const transfer = await stripe.transfers.create({
      amount: sellerAmount,
      currency: "gbp",
      destination: order.sellerAccountId,
      metadata: {
        orderId: order.id,
        type: "order_payout",
      },
    })

    console.log(`Payout released: ${transfer.id} for order ${order.id}`)

    // Update order payout status
    // await updateOrder(order.id, {
    //   payoutStatus: 'released',
    //   payoutDate: new Date(),
    //   transferId: transfer.id
    // })

    return transfer
  } catch (error) {
    console.error("Payout release error:", error)
    // Update order payout status to failed
    // await updateOrder(order.id, { payoutStatus: 'failed' })
    throw error
  }
}
