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
      sellerAmount: 4050, // £40.50 in pence
      status: "delivered",
      payoutStatus: "hold",
    }

    if (!mockOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (mockOrder.payoutStatus !== "hold") {
      return NextResponse.json({ error: "Payout already processed" }, { status: 400 })
    }

    // Create transfer to seller's connected account
    const transfer = await stripe.transfers.create({
      amount: mockOrder.sellerAmount,
      currency: "gbp",
      destination: mockOrder.sellerAccountId,
      metadata: {
        orderId: mockOrder.id,
        type: "admin_override_payout",
        adminAction: "manual_release",
      },
    })

    // Update order in database
    // await updateOrder(orderId, {
    //   payoutStatus: 'released',
    //   payoutDate: new Date(),
    //   transferId: transfer.id,
    //   adminOverride: true
    // })

    console.log(`Admin released payout: ${transfer.id} for order ${orderId}`)

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      message: "Payout released successfully",
    })
  } catch (error) {
    console.error("Admin payout release error:", error)
    return NextResponse.json({ error: "Failed to release payout" }, { status: 500 })
  }
}
