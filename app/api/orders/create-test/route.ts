import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId, shippingInfo, specialInstructions, paymentMethod } = await request.json()

    // Simulate creating a test order
    const testOrder = {
      id: `test-${orderId}-${Date.now()}`,
      originalOrderId: orderId,
      status: "confirmed",
      paymentMethod: "demo",
      shippingInfo,
      specialInstructions,
      createdAt: new Date().toISOString(),
      isDemo: true,
    }

    // In a real app, you'd save this to your database
    console.log("Test order created:", testOrder)

    return NextResponse.json({
      success: true,
      orderId: testOrder.id,
      message: "Demo purchase completed successfully!",
    })
  } catch (error) {
    console.error("Test order creation error:", error)
    return NextResponse.json({ error: "Failed to create test order" }, { status: 500 })
  }
}
