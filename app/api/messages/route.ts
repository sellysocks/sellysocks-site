import { type NextRequest, NextResponse } from "next/server"
import { connectionManager } from "./events/route"

// In-memory message store (in production, use a database)
const messageStore = new Map<string, any[]>()
const conversationStore = new Map<string, any>()

const initializeMockData = () => {
  if (messageStore.size === 0) {
    const mockConversations = {
      "thread-1": {
        id: "thread-1",
        participants: [
          { id: "current-user", name: "You", avatar: "/placeholder.svg" },
          { id: "emma-rose", name: "Emma Rose", avatar: "/diverse-woman-avatar.png", verified: true, rating: 4.9 },
        ],
        itemContext: {
          id: "1",
          title: "Cozy Cotton Socks",
          image: "/cozy-cotton-socks.png",
          price: 25,
          status: "active",
        },
        messages: [
          {
            id: "msg-1",
            senderId: "current-user",
            text: "Hi! I'm interested in your cozy cotton socks. Are they still available?",
            timestamp: "2024-01-25T10:30:00Z",
            status: "read",
          },
          {
            id: "msg-2",
            senderId: "emma-rose",
            text: "Hi there! Yes, they're still available. They're one of my favorites!",
            timestamp: "2024-01-25T10:45:00Z",
            status: "read",
          },
        ],
      },
      "thread-emma": {
        id: "thread-emma",
        participants: [
          { id: "current-user", name: "You", avatar: "/placeholder.svg" },
          { id: "emma-rose", name: "Emma Rose", avatar: "/diverse-woman-avatar.png", verified: true, rating: 4.9 },
        ],
        itemContext: { id: "2", title: "Silk Stockings", image: "/silk-stockings.png", price: 45, status: "active" },
        messages: [
          {
            id: "msg-1",
            senderId: "current-user",
            text: "Hi Emma! I saw your silk stockings listing. They look amazing!",
            timestamp: "2024-01-25T14:30:00Z",
            status: "read",
          },
          {
            id: "msg-2",
            senderId: "emma-rose",
            text: "Thank you! These are some of my favorites.",
            timestamp: "2024-01-25T14:45:00Z",
            status: "read",
          },
        ],
      },
    }

    Object.entries(mockConversations).forEach(([threadId, conversation]) => {
      conversationStore.set(threadId, conversation)
      messageStore.set(threadId, conversation.messages)
    })
  }
}

export async function GET(request: NextRequest) {
  initializeMockData()

  const { searchParams } = new URL(request.url)
  const threadId = searchParams.get("threadId")

  if (threadId) {
    // Get messages for specific thread
    const messages = messageStore.get(threadId) || []
    const conversation = conversationStore.get(threadId)

    return NextResponse.json({
      success: true,
      messages,
      conversation,
    })
  }

  // Get all conversations
  const conversations = Array.from(conversationStore.values())
  return NextResponse.json({
    success: true,
    conversations,
  })
}

export async function POST(request: NextRequest) {
  initializeMockData()

  try {
    const { threadId, senderId, text, imageUrl } = await request.json()

    if (!threadId || !senderId || (!text && !imageUrl)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      text: text || "",
      imageUrl: imageUrl || null,
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    // Add message to store
    const messages = messageStore.get(threadId) || []
    messages.push(newMessage)
    messageStore.set(threadId, messages)

    // Update conversation last message
    const conversation = conversationStore.get(threadId)
    if (conversation) {
      conversation.lastMessage = newMessage
      conversation.updatedAt = new Date().toISOString()
      conversationStore.set(threadId, conversation)
    }

    connectionManager.broadcast(threadId, {
      type: "new_message",
      threadId,
      message: newMessage,
      timestamp: Date.now(),
    })

    setTimeout(() => {
      const updatedMessages = messageStore.get(threadId) || []
      const messageIndex = updatedMessages.findIndex((msg) => msg.id === newMessage.id)
      if (messageIndex !== -1) {
        updatedMessages[messageIndex].status = "delivered"
        messageStore.set(threadId, updatedMessages)

        // Broadcast status update
        connectionManager.broadcast(threadId, {
          type: "message_status_update",
          threadId,
          messageId: newMessage.id,
          status: "delivered",
          timestamp: Date.now(),
        })
      }
    }, 1000)

    setTimeout(() => {
      const conversation = conversationStore.get(threadId)
      if (conversation) {
        const otherParticipants = conversation.participants.filter((p: any) => p.id !== senderId)
        const someoneOnline = otherParticipants.some((p: any) => connectionManager.isUserOnline(p.id))

        if (someoneOnline) {
          const updatedMessages = messageStore.get(threadId) || []
          const messageIndex = updatedMessages.findIndex((msg) => msg.id === newMessage.id)
          if (messageIndex !== -1) {
            updatedMessages[messageIndex].status = "read"
            messageStore.set(threadId, updatedMessages)

            // Broadcast read status
            connectionManager.broadcast(threadId, {
              type: "message_status_update",
              threadId,
              messageId: newMessage.id,
              status: "read",
              timestamp: Date.now(),
            })
          }
        }
      }
    }, 3000)

    return NextResponse.json({
      success: true,
      message: newMessage,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message",
      },
      { status: 500 },
    )
  }
}
