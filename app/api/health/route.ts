import { NextResponse } from "next/server"
import { getEnvironmentInfo } from "@/lib/env"
import { validateProductionReadiness } from "@/lib/stripe"

export async function GET() {
  try {
    const envInfo = getEnvironmentInfo()
    const stripeInfo = validateProductionReadiness()

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: envInfo,
      stripe: stripeInfo,
      services: {
        database: envInfo.hasDatabase ? "configured" : "not_configured",
        redis: envInfo.hasRedis ? "configured" : "not_configured",
        email: envInfo.hasEmail ? "configured" : "not_configured",
        analytics: envInfo.hasAnalytics ? "configured" : "not_configured",
      },
      readiness: {
        production: envInfo.isProduction && stripeInfo.isReady,
        stripe: stripeInfo.isReady,
        environment: envInfo.isProduction ? "production" : "development",
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
