import { type NextRequest, NextResponse } from "next/server"

// Import the same stores (in production, these would be database operations)
const messageStore = new Map<string, any[]>()

interface RouteParams {
  params: {
    threadId: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { messageId, status } = await request.json()
    const { threadId } = params

    if (!messageId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Message ID and status required",
        },
        { status: 400 },
      )
    }

    const messages = messageStore.get(threadId) || []
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)

    if (messageIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Message not found",
        },
        { status: 404 },
      )
    }

    // Update message status
    messages[messageIndex].status = status
    messageStore.set(threadId, messages)

    return NextResponse.json({
      success: true,
      message: messages[messageIndex],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update message status",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await request.json()
    const { threadId } = params

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID required",
        },
        { status: 400 },
      )
    }

    const messages = messageStore.get(threadId) || []

    // Mark all messages from other users as read
    const updatedMessages = messages.map((msg) => {
      if (msg.senderId !== userId && msg.status !== "read") {
        return { ...msg, status: "read" }
      }
      return msg
    })

    messageStore.set(threadId, updatedMessages)

    return NextResponse.json({
      success: true,
      updatedCount: updatedMessages.filter((msg) => msg.senderId !== userId).length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to mark messages as read",
      },
      { status: 500 },
    )
  }
}
