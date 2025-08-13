export class MessagingClient {
  private pollingInterval: NodeJS.Timeout | null = null
  private messageHandlers: ((message: any) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []
  private currentThreadId: string | null = null
  private currentUserId = "current-user"
  private lastMessageId: string | null = null
  private isConnected = false

  connect(threadId: string, userId = "current-user") {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }

    this.currentThreadId = threadId
    this.currentUserId = userId
    this.isConnected = true

    // Immediately notify connection
    this.connectionHandlers.forEach((handler) => handler(true))

    // Start polling for new messages
    this.pollingInterval = setInterval(async () => {
      try {
        await this.pollForMessages()
      } catch (error) {
        console.error("Polling error:", error)
      }
    }, 2000) // Poll every 2 seconds

    console.log("✅ Messaging client connected with polling")
  }

  private async pollForMessages() {
    if (!this.currentThreadId) return

    try {
      const response = await fetch(`/api/messages?threadId=${this.currentThreadId}`)
      const result = await response.json()

      if (result.success && result.messages) {
        const newMessages = result.messages.filter(
          (msg: any) => !this.lastMessageId || msg.timestamp > this.lastMessageId,
        )

        if (newMessages.length > 0) {
          // Update last message timestamp
          this.lastMessageId = newMessages[newMessages.length - 1].timestamp

          // Notify handlers of new messages
          newMessages.forEach((message: any) => {
            this.messageHandlers.forEach((handler) =>
              handler({
                type: "new_message",
                message,
              }),
            )
          })
        }
      }
    } catch (error) {
      console.error("Failed to poll messages:", error)
      if (this.isConnected) {
        this.isConnected = false
        this.connectionHandlers.forEach((handler) => handler(false))
      }
    }
  }

  disconnect() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
    this.currentThreadId = null
    this.isConnected = false
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
