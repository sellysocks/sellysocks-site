import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params

    // In production, verify admin authentication
    // const isAdmin = await verifyAdminAuth(request)
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Fetch order from database
    // const order = await getOrderById(orderId)

    // Mock order data for demo
    const mockOrder = {
      id: orderId,
      paymentIntentId: "pi_test123",
      sellerAccountId: "acct_seller123",
      amount: 5349, // £53.49 in pence
      platformFee: 450, // £4.50 in pence
      status: "delivered",
      payoutStatus: "hold",
    }

    if (!mockOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: mockOrder.paymentIntentId,
      amount: mockOrder.amount,
      metadata: {
        orderId: mockOrder.id,
        adminAction: "manual_refund",
      },
    })

    // If payout was already released, create a reverse transfer
    if (mockOrder.payoutStatus === "released") {
      await stripe.transfers.createReversal(mockOrder.transferId, {
        amount: mockOrder.amount - mockOrder.platformFee,
        metadata: {
          orderId: mockOrder.id,
          reason: "admin_refund",
        },
      })
    }

    // Update order in database
    // await updateOrder(orderId, {
    //   status: 'refunded',
    //   payoutStatus: 'cancelled',
    //   refundId: refund.id,
    //   refundDate: new Date(),
    //   adminOverride: true
    // })

    console.log(`Admin processed refund: ${refund.id} for order ${orderId}`)

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      message: "Refund processed successfully",
    })
  } catch (error) {
    console.error("Admin refund error:", error)
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 })
  }
}
