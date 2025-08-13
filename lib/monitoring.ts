export class ProductionMonitor {
  private static instance: ProductionMonitor
  private isProduction = process.env.NODE_ENV === "production"

  static getInstance(): ProductionMonitor {
    if (!ProductionMonitor.instance) {
      ProductionMonitor.instance = new ProductionMonitor()
    }
    return ProductionMonitor.instance
  }

  // Log errors in production
  logError(error: Error, context?: Record<string, any>) {
    if (this.isProduction) {
      console.error("Production Error:", {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : "server",
      })

      // In a real app, you'd send this to a service like Sentry, LogRocket, etc.
      // Example: Sentry.captureException(error, { extra: context })
    } else {
      console.error("Development Error:", error, context)
    }
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, tags?: Record<string, string>) {
    if (this.isProduction) {
      console.log("Performance Metric:", {
        metric,
        value,
        tags,
        timestamp: new Date().toISOString(),
      })

      // In a real app, you'd send this to analytics
      // Example: analytics.track(metric, { value, ...tags })
    }
  }

  // Track user events
  trackEvent(event: string, properties?: Record<string, any>) {
    if (this.isProduction) {
      console.log("User Event:", {
        event,
        properties,
        timestamp: new Date().toISOString(),
      })

      // In a real app, you'd send this to analytics
      // Example: analytics.track(event, properties)
    }
  }
}

export const monitor = ProductionMonitor.getInstance()
