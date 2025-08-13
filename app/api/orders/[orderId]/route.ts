import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params

    // Mock order data with escrow information
    const mockOrder = {
      id: orderId,
      paymentIntentId: "pi_test123",
      sellerId: "sophie-luxe",
      buyerId: "current-user",
      itemId: "2",
      amount: 5349, // £53.49 in pence
      platformFee: 450, // £4.50 in pence
      sellerAmount: 4050, // £40.50 in pence
      currency: "gbp",
      status: "delivered",
      payoutStatus: "released",
      createdAt: "2024-01-20T10:00:00Z",
      paidAt: "2024-01-20T10:05:00Z",
      shippedAt: "2024-01-21T14:30:00Z",
      deliveredAt: "2024-01-23T16:45:00Z",
      payoutAt: "2024-01-24T09:00:00Z",
      trackingNumber: "RM123456789GB",
    }

    return NextResponse.json(mockOrder)
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
