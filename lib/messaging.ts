export class MessagingClient {
  private eventSource: EventSource | null = null
  private messageHandlers: ((message: any) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []
  private currentThreadId: string | null = null
  private currentUserId = "current-user"

  connect(threadId: string, userId = "current-user") {
    if (this.eventSource) {
      this.eventSource.close()
    }

    this.currentThreadId = threadId
    this.currentUserId = userId

    this.eventSource = new EventSource(`/api/messages/events?threadId=${threadId}&userId=${userId}`)

    this.eventSource.onopen = () => {
      this.connectionHandlers.forEach((handler) => handler(true))
    }

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.messageHandlers.forEach((handler) => handler(data))

        if (data.type === "new_message") {
          console.log("📨 New message received:", data.message.text)
        } else if (data.type === "message_status_update") {
          console.log("✓ Message status updated:", data.status)
        } else if (data.type === "user_online") {
          console.log("🟢 User came online:", data.userId)
        } else if (data.type === "user_offline") {
          console.log("🔴 User went offline:", data.userId)
        }
      } catch (error) {
        console.error("Failed to parse SSE message:", error)
      }
    }

    this.eventSource.onerror = (error) => {
      console.error("SSE connection error:", error)
      this.connectionHandlers.forEach((handler) => handler(false))

      setTimeout(() => {
        if (this.currentThreadId) {
          console.log("🔄 Attempting to reconnect...")
          this.connect(this.currentThreadId, this.currentUserId)
        }
      }, 5000)
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
    this.currentThreadId = null
    this.connectionHandlers.forEach((handler) => handler(false))
  }

  onMessage(handler: (message: any) => void) {
    this.messageHandlers.push(handler)
    return () => {
      const index = this.messageHandlers.indexOf(handler)
      if (index > -1) {
        this.messageHandlers.splice(index, 1)
      }
    }
  }

  onConnectionChange(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler)
    return () => {
      const index = this.connectionHandlers.indexOf(handler)
      if (index > -1) {
        this.connectionHandlers.splice(index, 1)
      }
    }
  }

  async sendMessage(threadId: string, senderId: string, text: string, imageUrl?: string) {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          senderId,
          text,
          imageUrl,
        }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Failed to send message:", error)
      throw error
    }
  }

  async getMessages(threadId: string) {
    try {
      const response = await fetch(`/api/messages?threadId=${threadId}`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error("Failed to get messages:", error)
      throw error
    }
  }

  async getConversations() {
    try {
      const response = await fetch("/api/messages")
      const result = await response.json()
      return result
    } catch (error) {
      console.error("Failed to get conversations:", error)
      throw error
    }
  }
}

export const messagingClient = new MessagingClient()
