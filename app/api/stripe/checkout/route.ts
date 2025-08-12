import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { orderId, shippingInfo, specialInstructions } = await request.json()

    // In a real app, you would fetch the order from Firestore
    const mockOrder = {
      id: orderId,
      item: {
        title: "Cozy Cotton Socks",
        price: 25,
      },
      seller: {
        id: "emma-rose",
        stripeAccountId: "acct_seller123", // This would be stored in the seller's profile
      },
      pricing: {
        itemPrice: 25,
        platformFee: 2.5, // 10%
        shippingCost: 3.99,
        total: 31.49,
      },
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: mockOrder.item.title,
              images: [`${process.env.NEXT_PUBLIC_SITE_URL}/cozy-cotton-socks.png`],
            },
            unit_amount: Math.round(mockOrder.pricing.itemPrice * 100), // Convert to pence
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Platform Fee",
            },
            unit_amount: Math.round(mockOrder.pricing.platformFee * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Shipping",
            },
            unit_amount: Math.round(mockOrder.pricing.shippingCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/${orderId}`,
      metadata: {
        orderId: mockOrder.id,
        sellerId: mockOrder.seller.id,
        shippingInfo: JSON.stringify(shippingInfo),
        specialInstructions: specialInstructions || "",
      },
      // Application fee for the platform (10% of item price)
      payment_intent_data: {
        application_fee_amount: Math.round(mockOrder.pricing.platformFee * 100),
        transfer_data: {
          destination: mockOrder.seller.stripeAccountId,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
