interface EnvironmentConfig {
  // Stripe Configuration
  STRIPE_SECRET_KEY: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  STRIPE_CONNECT_WEBHOOK_SECRET: string

  // Site Configuration
  NEXT_PUBLIC_SITE_URL: string

  // Firebase Configuration (if using Firebase)
  NEXT_PUBLIC_FIREBASE_API_KEY?: string
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string
  NEXT_PUBLIC_FIREBASE_APP_ID?: string

  // Database Configuration (for future scalability)
  DATABASE_URL?: string
  REDIS_URL?: string

  // Email Configuration
  SMTP_HOST?: string
  SMTP_PORT?: string
  SMTP_USER?: string
  SMTP_PASS?: string

  // Security
  NEXTAUTH_SECRET?: string
  NEXTAUTH_URL?: string

  // Analytics
  GOOGLE_ANALYTICS_ID?: string
  VERCEL_ANALYTICS_ID?: string
}

const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_CONNECT_WEBHOOK_SECRET",
  "NEXT_PUBLIC_SITE_URL",
] as const

const optionalEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "DATABASE_URL",
  "REDIS_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "GOOGLE_ANALYTICS_ID",
  "VERCEL_ANALYTICS_ID",
] as const

export const validateEnvironment = (): EnvironmentConfig => {
  const missing: string[] = []
  const warnings: string[] = []

  // Check required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing
        .map((v) => `  - ${v}`)
        .join("\n")}\n\nPlease check your .env.local file or deployment environment variables.`,
    )
  }

  // Check for production readiness
  const isProduction = process.env.NODE_ENV === "production"
  const isStripeProduction = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")

  if (isProduction && !isStripeProduction) {
    warnings.push("Running in production but using Stripe test keys")
  }

  if (!isProduction && isStripeProduction) {
    warnings.push("Running in development but using Stripe live keys - this is dangerous!")
  }

  // Check optional but recommended variables
  const recommendedForProduction = ["NEXTAUTH_SECRET", "DATABASE_URL", "GOOGLE_ANALYTICS_ID"]
  if (isProduction) {
    for (const envVar of recommendedForProduction) {
      if (!process.env[envVar]) {
        warnings.push(`Recommended for production: ${envVar}`)
      }
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn("Environment warnings:")
    warnings.forEach((warning) => console.warn(`  ⚠️  ${warning}`))
  }

  // Return validated configuration
  const config: EnvironmentConfig = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    STRIPE_CONNECT_WEBHOOK_SECRET: process.env.STRIPE_CONNECT_WEBHOOK_SECRET!,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,
  }

  // Add optional variables if present
  optionalEnvVars.forEach((envVar) => {
    if (process.env[envVar]) {
      ;(config as any)[envVar] = process.env[envVar]
    }
  })

  return config
}

export const env = validateEnvironment()

export const getEnvironmentInfo = () => {
  const isProduction = process.env.NODE_ENV === "production"
  const isStripeProduction = env.STRIPE_SECRET_KEY.startsWith("sk_live_")

  return {
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction,
    isStripeProduction,
    siteUrl: env.NEXT_PUBLIC_SITE_URL,
    hasDatabase: !!env.DATABASE_URL,
    hasRedis: !!env.REDIS_URL,
    hasEmail: !!(env.SMTP_HOST && env.SMTP_USER),
    hasAnalytics: !!(env.GOOGLE_ANALYTICS_ID || env.VERCEL_ANALYTICS_ID),
  }
}
