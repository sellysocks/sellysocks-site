import { type NextRequest, NextResponse } from "next/server"

// Import the same stores from the main messages route
const conversationStore = new Map<string, any>()
const messageStore = new Map<string, any[]>()

// Initialize mock data function
const initializeMockData = () => {
  if (conversationStore.size === 0) {
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
        lastMessage: {
          text: "They're super soft and have absorbed so much energy from my training!",
          timestamp: "2024-01-25T11:15:00Z",
          senderId: "emma-rose",
        },
        unreadCount: 0,
        updatedAt: "2024-01-25T11:15:00Z",
      },
      "thread-emma": {
        id: "thread-emma",
        participants: [
          { id: "current-user", name: "You", avatar: "/placeholder.svg" },
          { id: "emma-rose", name: "Emma Rose", avatar: "/diverse-woman-avatar.png", verified: true, rating: 4.9 },
        ],
        itemContext: {
          id: "2",
          title: "Silk Stockings",
          image: "/silk-stockings.png",
          price: 45,
          status: "active",
        },
        lastMessage: {
          text: "Would you like to see more photos?",
          timestamp: "2024-01-25T15:15:00Z",
          senderId: "emma-rose",
        },
        unreadCount: 1,
        updatedAt: "2024-01-25T15:15:00Z",
      },
      "thread-emmarose": {
        id: "thread-emmarose",
        participants: [
          { id: "current-user", name: "You", avatar: "/placeholder.svg" },
          { id: "emma-rose", name: "Emma Rose", avatar: "/diverse-woman-avatar.png", verified: true, rating: 4.9 },
        ],
        itemContext: {
          id: "2",
          title: "Silk Stockings",
          image: "/silk-stockings.png",
          price: 45,
          status: "active",
        },
        lastMessage: {
          text: "Do you have any new items coming soon?",
          timestamp: "2024-01-25T17:00:00Z",
          senderId: "current-user",
        },
        unreadCount: 0,
        updatedAt: "2024-01-25T17:00:00Z",
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
        lastMessage: {
          text: "They're truly a collector's piece!",
          timestamp: "2024-01-25T19:15:00Z",
          senderId: "sophie-luxe",
        },
        unreadCount: 1,
        updatedAt: "2024-01-25T19:15:00Z",
      },
    }

    Object.entries(mockConversations).forEach(([threadId, conversation]) => {
      conversationStore.set(threadId, conversation)
    })
  }
}

export async function GET(request: NextRequest) {
  initializeMockData()

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "current-user"

  // Get all conversations for the user
  const userConversations = Array.from(conversationStore.values())
    .filter((conv) => conv.participants.some((p: any) => p.id === userId))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return NextResponse.json({
    success: true,
    conversations: userConversations,
  })
}

export async function POST(request: NextRequest) {
  initializeMockData()

  try {
    const { participants, itemContext, initialMessage } = await request.json()

    if (!participants || participants.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "At least 2 participants required",
        },
        { status: 400 },
      )
    }

    // Generate new thread ID
    const threadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newConversation = {
      id: threadId,
      participants,
      itemContext: itemContext || null,
      lastMessage: initialMessage || null,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    conversationStore.set(threadId, newConversation)
    messageStore.set(threadId, initialMessage ? [initialMessage] : [])

    return NextResponse.json({
      success: true,
      conversation: newConversation,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create conversation",
      },
      { status: 500 },
    )
  }
}
