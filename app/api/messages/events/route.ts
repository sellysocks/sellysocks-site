import type { NextRequest } from "next/server"

// Global connection manager for real-time messaging
class ConnectionManager {
  private connections = new Map<string, Set<ReadableStreamDefaultController>>()
  private userConnections = new Map<string, Set<string>>() // userId -> threadIds

  addConnection(threadId: string, userId: string, controller: ReadableStreamDefaultController) {
    // Add to thread connections
    if (!this.connections.has(threadId)) {
      this.connections.set(threadId, new Set())
    }
    this.connections.get(threadId)!.add(controller)

    // Track user connections
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set())
    }
    this.userConnections.get(userId)!.add(threadId)
  }

  removeConnection(threadId: string, userId: string, controller: ReadableStreamDefaultController) {
    // Remove from thread connections
    const threadConnections = this.connections.get(threadId)
    if (threadConnections) {
      threadConnections.delete(controller)
      if (threadConnections.size === 0) {
        this.connections.delete(threadId)
      }
    }

    // Remove from user connections
    const userThreads = this.userConnections.get(userId)
    if (userThreads) {
      userThreads.delete(threadId)
      if (userThreads.size === 0) {
        this.userConnections.delete(userId)
      }
    }
  }

  broadcast(threadId: string, message: any, excludeController?: ReadableStreamDefaultController) {
    const connections = this.connections.get(threadId)
    if (!connections) return

    const encoder = new TextEncoder()
    const data = encoder.encode(`data: ${JSON.stringify(message)}\n\n`)

    connections.forEach((controller) => {
      if (controller !== excludeController) {
        try {
          controller.enqueue(data)
        } catch (error) {
          // Remove dead connections
          connections.delete(controller)
        }
      }
    })
  }

  getActiveConnections(threadId: string): number {
    return this.connections.get(threadId)?.size || 0
  }

  isUserOnline(userId: string): boolean {
    return this.userConnections.has(userId) && this.userConnections.get(userId)!.size > 0
  }
}

const connectionManager = new ConnectionManager()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const threadId = searchParams.get("threadId")
  const userId = searchParams.get("userId") || "current-user"

  if (!threadId) {
    return new Response("ThreadId required", { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Add connection to manager
      connectionManager.addConnection(threadId, userId, controller)

      // Send initial connection message
      const data = encoder.encode(
        `data: ${JSON.stringify({
          type: "connected",
          threadId,
          userId,
          activeConnections: connectionManager.getActiveConnections(threadId),
        })}\n\n`,
      )
      controller.enqueue(data)

      // Notify other participants that user is online
      connectionManager.broadcast(
        threadId,
        {
          type: "user_online",
          userId,
          timestamp: Date.now(),
        },
        controller,
      )

      // Set up periodic heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          const heartbeatData = encoder.encode(
            `data: ${JSON.stringify({
              type: "heartbeat",
              timestamp: Date.now(),
              activeConnections: connectionManager.getActiveConnections(threadId),
            })}\n\n`,
          )
          controller.enqueue(heartbeatData)
        } catch (error) {
          clearInterval(heartbeat)
          connectionManager.removeConnection(threadId, userId, controller)
          controller.close()
        }
      }, 30000) // 30 seconds

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        connectionManager.removeConnection(threadId, userId, controller)

        // Notify other participants that user went offline
        connectionManager.broadcast(threadId, {
          type: "user_offline",
          userId,
          timestamp: Date.now(),
        })

        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}

// Export connection manager for use in other API routes
export { connectionManager }
