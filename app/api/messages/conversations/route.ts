import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "current-user"

    const supabase = createClient()

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        *,
        conversation_participants!inner (
          user_id,
          profiles (
            id,
            username,
            avatar_url,
            verified,
            rating
          )
        ),
        items (
          id,
          title,
          images,
          price,
          status
        ),
        messages (
          content,
          created_at,
          sender_id
        )
      `)
      .eq("conversation_participants.user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching conversations:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch conversations" }, { status: 500 })
    }

    const formattedConversations =
      conversations?.map((conv) => ({
        id: conv.id,
        participants: conv.conversation_participants.map((p: any) => ({
          id: p.profiles.id,
          name: p.profiles.username,
          avatar: p.profiles.avatar_url,
          verified: p.profiles.verified,
          rating: p.profiles.rating,
        })),
        itemContext: conv.items
          ? {
              id: conv.items.id,
              title: conv.items.title,
              image: conv.items.images?.[0],
              price: conv.items.price,
              status: conv.items.status,
            }
          : null,
        lastMessage: conv.messages?.[0]
          ? {
              text: conv.messages[0].content,
              timestamp: conv.messages[0].created_at,
              senderId: conv.messages[0].sender_id,
            }
          : null,
        unreadCount: 0, // This would need a separate query
        updatedAt: conv.updated_at,
      })) || []

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
    })
  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { participants, itemContext, initialMessage } = await request.json()

    if (!participants || participants.length < 2) {
      return NextResponse.json({ success: false, error: "At least 2 participants required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data: newConversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        item_id: itemContext?.id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (convError) {
      return NextResponse.json({ success: false, error: "Failed to create conversation" }, { status: 500 })
    }

    // Add participants
    const participantInserts = participants.map((p: any) => ({
      conversation_id: newConversation.id,
      user_id: p.id,
    }))

    await supabase.from("conversation_participants").insert(participantInserts)

    // Add initial message if provided
    if (initialMessage) {
      await supabase.from("messages").insert({
        conversation_id: newConversation.id,
        sender_id: initialMessage.senderId,
        content: initialMessage.text,
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      conversation: newConversation,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create conversation" }, { status: 500 })
  }
}
