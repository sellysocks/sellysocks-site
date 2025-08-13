import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export { stripe }

export const isTestMode = process.env.STRIPE_SECRET_KEY?.includes("sk_test_")

export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  connectWebhookSecret: process.env.STRIPE_CONNECT_WEBHOOK_SECRET!,
}
