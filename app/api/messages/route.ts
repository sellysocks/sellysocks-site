import { type NextRequest, NextResponse } from "next/server"
import { connectionManager } from "./events/route"

const messageStore = new Map<string, any[]>()
const conversationStore = new Map<string, any>()

const persistenceKey = "sellysock_server_messages"

const saveToServerStorage = () => {
  if (typeof global !== "undefined") {
    try {
      // In a real app, this would save to a database
      // For now, we'll use a global variable to simulate persistence
      ;(global as any)[persistenceKey] = {
        messages: Object.fromEntries(messageStore),
        conversations: Object.fromEntries(conversationStore),
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("Failed to save server data:", error)
    }
  }
}

const loadFromServerStorage = () => {
  if (typeof global !== "undefined") {
    try {
      const data = (global as any)[persistenceKey]
      if (data && data.messages && data.conversations) {
        // Restore messages
        Object.entries(data.messages).forEach(([key, value]) => {
          messageStore.set(key, value as any[])
        })
        // Restore conversations
        Object.entries(data.conversations).forEach(([key, value]) => {
          conversationStore.set(key, value as any)
        })
        console.log("✅ Restored messages from server storage")
        return true
      }
    } catch (error) {
      console.error("Failed to load server data:", error)
    }
  }
  return false
}

const initializeMockData = () => {
  if (loadFromServerStorage()) {
    return
  }

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
          {
            id: "msg-3",
            senderId: "emma-rose",
            text: "They're super soft and have absorbed so much energy from my training!",
            timestamp: "2024-01-25T11:15:00Z",
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
          {
            id: "msg-3",
            senderId: "emma-rose",
            text: "Would you like to see more photos?",
            timestamp: "2024-01-25T15:15:00Z",
            status: "delivered",
          },
        ],
      },
      "thread-2": {
        id: "thread-2",
        participants: [
          { id: "current-user", name: "You", avatar: "/placeholder.svg" },
          { id: "sophie-luxe", name: "Sophie Luxe", avatar: "/woman-avatar-3.png", verified: true, rating: 4.8 },
        ],
        itemContext: {
          id: "3",
          title: "Designer Silk Stockings",
          image: "/silk-stockings-detail.png",
          price: 85,
          status: "active",
        },
        messages: [
          {
            id: "msg-1",
            senderId: "current-user",
            text: "Hello! I'm interested in your designer silk stockings.",
            timestamp: "2024-01-25T18:30:00Z",
            status: "read",
          },
          {
            id: "msg-2",
            senderId: "sophie-luxe",
            text: "Hi! Thank you for your interest. These are truly special pieces.",
            timestamp: "2024-01-25T18:45:00Z",
            status: "read",
          },
          {
            id: "msg-3",
            senderId: "sophie-luxe",
            text: "They're truly a collector's piece!",
            timestamp: "2024-01-25T19:15:00Z",
            status: "delivered",
          },
        ],
      },
    }

    Object.entries(mockConversations).forEach(([threadId, conversation]) => {
      conversationStore.set(threadId, conversation)
      messageStore.set(threadId, conversation.messages)
    })

    saveToServerStorage()
  }
}

export async function GET(request: NextRequest) {
  initializeMockData()

  const { searchParams } = new URL(request.url)
  const threadId = searchParams.get("threadId")

  if (!threadId) {
    return NextResponse.json(
      {
        success: false,
        error: "threadId is required",
      },
      { status: 400 },
    )
  }

  const messages = messageStore.get(threadId) || []

  return NextResponse.json({
    success: true,
    messages,
    threadId,
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

    saveToServerStorage()

    connectionManager.broadcast(threadId, {
      type: "new_message",
      threadId,
      message: newMessage,
      timestamp: Date.now(),
    })

    // Simulate message delivery status updates
    setTimeout(() => {
      newMessage.status = "delivered"
      saveToServerStorage()
    }, 1000)

    setTimeout(() => {
      newMessage.status = "read"
      saveToServerStorage()
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
