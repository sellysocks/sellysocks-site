export class MessagingClient {
  private pollingInterval: NodeJS.Timeout | null = null
  private messageHandlers: ((message: any) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []
  private currentThreadId: string | null = null
  private currentUserId = "current-user"
  private lastMessageId: string | null = null
  private isConnected = false

  private saveToStorage(key: string, data: any) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`sellysock_${key}`, JSON.stringify(data))
      } catch (error) {
        console.error("Failed to save to localStorage:", error)
      }
    }
  }

  private loadFromStorage(key: string) {
    if (typeof window !== "undefined") {
      try {
        const data = localStorage.getItem(`sellysock_${key}`)
        return data ? JSON.parse(data) : null
      } catch (error) {
        console.error("Failed to load from localStorage:", error)
        return null
      }
    }
    return null
  }

  connect(threadId: string, userId = "current-user") {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }

    this.currentThreadId = threadId
    this.currentUserId = userId
    this.isConnected = true

    this.lastMessageId = this.loadFromStorage(`lastMessage_${threadId}`)

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
        this.saveToStorage(`messages_${this.currentThreadId}`, result.messages)

        const newMessages = result.messages.filter(
          (msg: any) => !this.lastMessageId || msg.timestamp > this.lastMessageId,
        )

        if (newMessages.length > 0) {
          // Update last message timestamp
          this.lastMessageId = newMessages[newMessages.length - 1].timestamp
          this.saveToStorage(`lastMessage_${this.currentThreadId}`, this.lastMessageId)

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

      if (result.success && result.message) {
        const existingMessages = this.loadFromStorage(`messages_${threadId}`) || []
        existingMessages.push(result.message)
        this.saveToStorage(`messages_${threadId}`, existingMessages)
      }

      return result
    } catch (error) {
      console.error("Failed to send message:", error)
      throw error
    }
  }

  async getMessages(threadId: string) {
    try {
      const cachedMessages = this.loadFromStorage(`messages_${threadId}`)
      const cachedConversation = this.loadFromStorage(`conversation_${threadId}`)

      const [messagesResponse, conversationsResponse] = await Promise.all([
        fetch(`/api/messages?threadId=${threadId}`),
        fetch("/api/messages/conversations"),
      ])

      const messagesResult = await messagesResponse.json()
      const conversationsResult = await conversationsResponse.json()

      if (messagesResult.success && conversationsResult.success) {
        // Find the specific conversation for this thread
        const conversation = conversationsResult.conversations.find((conv: any) => conv.id === threadId)

        if (conversation) {
          this.saveToStorage(`messages_${threadId}`, messagesResult.messages)
          this.saveToStorage(`conversation_${threadId}`, conversation)

          return {
            success: true,
            messages: messagesResult.messages,
            conversation: conversation,
          }
        }
      }

      // Fallback to cached data if available
      if (cachedMessages && cachedConversation) {
        return {
          success: true,
          messages: cachedMessages,
          conversation: cachedConversation,
        }
      }

      return { success: false, error: "Conversation not found" }
    } catch (error) {
      console.error("Failed to get messages:", error)

      // Try cached data as fallback
      const cachedMessages = this.loadFromStorage(`messages_${threadId}`)
      const cachedConversation = this.loadFromStorage(`conversation_${threadId}`)

      if (cachedMessages && cachedConversation) {
        return {
          success: true,
          messages: cachedMessages,
          conversation: cachedConversation,
        }
      }

      throw error
    }
  }

  async getConversations() {
    try {
      const response = await fetch("/api/messages/conversations")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON, got: ${contentType}. Response: ${text.substring(0, 100)}...`)
      }

      const result = await response.json()

      if (result.success && result.conversations) {
        this.saveToStorage("conversations", result.conversations)
      }

      return result
    } catch (error) {
      console.error("Failed to get conversations:", error)

      const cachedConversations = this.loadFromStorage("conversations")
      if (cachedConversations) {
        return { success: true, conversations: cachedConversations }
      }

      throw error
    }
  }
}

export const messagingClient = new MessagingClient()
