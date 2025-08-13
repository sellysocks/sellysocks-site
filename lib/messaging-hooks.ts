"use client"

import { useState, useEffect, useCallback } from "react"
import { messagingClient } from "./messaging"

export function useConversations(userId = "current-user") {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      const result = await messagingClient.getConversations()
      if (result.success) {
        setConversations(result.conversations)
        setError(null)
      } else {
        setError(result.error || "Failed to load conversations")
      }
    } catch (err) {
      setError("Failed to load conversations")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
  }
}

export function useMessages(threadId: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [conversation, setConversation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const result = await messagingClient.getMessages(threadId)
      if (result.success) {
        setMessages(result.messages || [])
        setConversation(result.conversation)
        setError(null)
      } else {
        setError(result.error || "Failed to load messages")
      }
    } catch (err) {
      setError("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }, [threadId])

  const sendMessage = useCallback(
    async (senderId: string, text: string, imageUrl?: string) => {
      try {
        const result = await messagingClient.sendMessage(threadId, senderId, text, imageUrl)
        if (result.success) {
          // Optimistically add message to local state
          setMessages((prev) => [...prev, result.message])
          return result
        } else {
          throw new Error(result.error || "Failed to send message")
        }
      } catch (err) {
        throw err
      }
    },
    [threadId],
  )

  useEffect(() => {
    fetchMessages()

    // Connect to real-time updates
    messagingClient.connect(threadId)
    setConnected(true)

    const unsubscribe = messagingClient.onMessage((data) => {
      if (data.type === "new_message" && data.threadId === threadId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((msg) => msg.id === data.message.id)) {
            return prev
          }
          return [...prev, data.message]
        })
      } else if (data.type === "message_status_update" && data.threadId === threadId) {
        setMessages((prev) => prev.map((msg) => (msg.id === data.messageId ? { ...msg, status: data.status } : msg)))
      }
    })

    return () => {
      unsubscribe()
      messagingClient.disconnect()
      setConnected(false)
    }
  }, [threadId, fetchMessages])

  return {
    messages,
    conversation,
    loading,
    error,
    connected,
    sendMessage,
    refetch: fetchMessages,
  }
}
