import { type NextRequest, NextResponse } from "next/server"
import { stripe, stripeConfig, isProductionMode } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, sellerAccountId, platformFee } = await request.json()

    if (!orderId || !amount || !sellerAccountId || platformFee === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["orderId", "amount", "sellerAccountId", "platformFee"],
        },
        { status: 400 },
      )
    }

    if (amount < stripeConfig.minimumAmount) {
      return NextResponse.json(
        {
          error: `Amount must be at least ${stripeConfig.minimumAmount} pence`,
        },
        { status: 400 },
      )
    }

    const isDemoAccount =
      sellerAccountId.startsWith("acct_demo") ||
      sellerAccountId.startsWith("acct_seller") ||
      (!isProductionMode && sellerAccountId.startsWith("acct_test"))

    const paymentIntentConfig: any = {
      amount,
      currency: stripeConfig.defaultCurrency,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: {
        orderId,
        sellerAccountId,
        platformFee: platformFee.toString(),
        isDemoAccount: isDemoAccount.toString(),
        environment: isProductionMode ? "production" : "test",
        platformFeePercentage: stripeConfig.platformFeePercentage.toString(),
      },
    }

    if (!isDemoAccount && isProductionMode) {
      // Only set up real transfers in production with real accounts
      paymentIntentConfig.transfer_data = {
        destination: sellerAccountId,
      }
      paymentIntentConfig.application_fee_amount = platformFee
    } else if (!isDemoAccount && !isProductionMode) {
      // In test mode, still set up transfers for testing
      paymentIntentConfig.transfer_data = {
        destination: sellerAccountId,
      }
      paymentIntentConfig.application_fee_amount = platformFee
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentConfig)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      isDemoAccount,
      environment: isProductionMode ? "production" : "test",
      platformFee,
      platformFeePercentage: stripeConfig.platformFeePercentage,
    })
  } catch (error) {
    console.error("Create payment intent error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isStripeError = error && typeof error === "object" && "type" in error

    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: isProductionMode ? "Please contact support" : errorMessage,
        type: isStripeError ? (error as any).type : "api_error",
      },
      { status: 500 },
    )
  }
}
