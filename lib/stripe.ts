import Stripe from "stripe"

const validateStripeConfig = () => {
  const requiredEnvVars = [
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_CONNECT_WEBHOOK_SECRET",
  ]

  const missing = requiredEnvVars.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing required Stripe environment variables: ${missing.join(", ")}`)
  }
}

// Validate configuration on startup
validateStripeConfig()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
  maxNetworkRetries: 3,
  timeout: 30000, // 30 seconds
  telemetry: false, // Disable telemetry in production
})

export { stripe }

export const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? true
export const isProductionMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") ?? false

export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  connectWebhookSecret: process.env.STRIPE_CONNECT_WEBHOOK_SECRET!,
  isTestMode,
  isProductionMode,
  // Platform fee configuration
  platformFeePercentage: 10, // 10% platform fee
  minimumAmount: 50, // Minimum 50 pence
  supportedCurrencies: ["gbp", "usd", "eur"],
  defaultCurrency: "gbp",
}

export const validateProductionReadiness = () => {
  if (isProductionMode) {
    console.log("✅ Stripe configured for PRODUCTION mode")
    console.log("✅ Platform fee:", `${stripeConfig.platformFeePercentage}%`)
  } else {
    console.log("⚠️  Stripe configured for TEST mode")
  }

  return {
    isReady: isProductionMode,
    mode: isProductionMode ? "production" : "test",
    platformFee: stripeConfig.platformFeePercentage,
  }
}
