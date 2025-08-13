import { supabase } from "@/lib/supabase/client"

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: "text" | "tip" | "system"
  tip_amount?: number
  read_at?: string
  created_at: string
}

export interface Conversation {
  id: string
  participant_1: string
  participant_2: string
  item_id?: string
  last_message_at: string
  created_at: string
  item?: {
    id: string
    title: string
    price: number
    images: string[]
  }
  other_participant?: {
    id: string
    username: string
    full_name: string
    avatar_url: string
  }
  last_message?: Message
}

// Get or create conversation
export async function getOrCreateConversation(
  participant1: string,
  participant2: string,
  itemId?: string,
): Promise<string> {
  // Try to find existing conversation
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(participant_1.eq.${participant1},participant_2.eq.${participant2}),and(participant_1.eq.${participant2},participant_2.eq.${participant1})`,
    )
    .eq("item_id", itemId || null)
    .single()

  if (existing) {
    return existing.id
  }

  // Create new conversation
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      participant_1: participant1,
      participant_2: participant2,
      item_id: itemId,
    })
    .select("id")
    .single()

  if (error) throw error
  return data.id
}

// Get user conversations
export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      item:items(id, title, price, images),
      messages(content, created_at, sender_id)
    `)
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order("last_message_at", { ascending: false })

  if (error) throw error

  // Get other participant info for each conversation
  const conversationsWithParticipants = await Promise.all(
    (data || []).map(async (conv) => {
      const otherParticipantId = conv.participant_1 === userId ? conv.participant_2 : conv.participant_1

      const { data: participant } = await supabase
        .from("users")
        .select("id, username, full_name, avatar_url")
        .eq("id", otherParticipantId)
        .single()

      return {
        ...conv,
        other_participant: participant,
        last_message: conv.messages?.[0] || null,
      }
    }),
  )

  return conversationsWithParticipants
}

// Get messages for conversation
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data || []
}

// Send message
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  messageType: "text" | "tip" = "text",
  tipAmount?: number,
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      message_type: messageType,
      tip_amount: tipAmount,
    })
    .select()
    .single()

  if (error) throw error

  // Update conversation last_message_at
  await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", conversationId)

  return data
}
