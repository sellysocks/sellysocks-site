"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Send, ImageIcon, MoreVertical, Star, Heart, Wifi } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { TipModal } from "@/components/mobile/tip-modal"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useMessages } from "@/lib/messaging-hooks"
import { messagingClient } from "@/lib/messaging"

interface ChatPageProps {
  params: {
    threadId: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)
  const { messages, conversation, loading, error, connected, sendMessage } = useMessages(params.threadId)
  const [connectionStatus, setConnectionStatus] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsubscribe = messagingClient.onConnectionChange((isConnected) => {
      setConnectionStatus(isConnected)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!user || !profile) {
    return (
      <MobileLayout title="Messages" showBack backHref="/messages">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">You need to be signed in to view messages.</p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </MobileLayout>
    )
  }

  if (loading) {
    return (
      <MobileLayout title="Messages" showBack backHref="/messages">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading conversation...</p>
          </div>
        </div>
      </MobileLayout>
    )
  }

  if (error || !conversation) {
    notFound()
  }

  const otherParticipant = conversation.participants.find((p: any) => p.id !== "current-user")!

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sending) return

    setSending(true)
    try {
      await sendMessage("current-user", message.trim())
      setMessage("")

      toast({
        title: "Message sent",
        description: "Your message has been delivered.",
      })
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // In a real app, you'd upload the image to a storage service first
        const imageUrl = "/placeholder.svg" // Placeholder for uploaded image
        await sendMessage("current-user", "Shared an image", imageUrl)

        toast({
          title: "Image uploaded",
          description: "Your image has been sent.",
        })
      } catch (error) {
        toast({
          title: "Failed to upload image",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const customHeader = (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherParticipant.avatar || "/placeholder.svg"} alt={otherParticipant.name} />
          <AvatarFallback>{otherParticipant.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">{otherParticipant.name}</h2>
            {otherParticipant.verified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
            <Wifi className="h-3 w-3 text-green-500" />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{otherParticipant.rating}</span>
            <span className="ml-2">Connected</span>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowTipModal(true)}>
            <Heart className="h-4 w-4 mr-2" />
            Send Tip
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/seller/${otherParticipant.id}`}>View Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/item/${conversation.itemContext.id}`}>View Item</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Report User</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <MobileLayout showBack backHref="/messages" customHeader={customHeader} className="flex flex-col h-screen">
      <div className="p-4 border-b">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                <img
                  src={conversation.itemContext.image || "/placeholder.svg"}
                  alt={conversation.itemContext.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{conversation.itemContext.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">£{conversation.itemContext.price}</span>
                  <Badge
                    variant={conversation.itemContext.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {conversation.itemContext.status === "active" ? "Available" : "Sold"}
                  </Badge>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href={`/item/${conversation.itemContext.id}`}>View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg: any) => {
            const isCurrentUser = msg.senderId === "current-user"
            const sender = conversation.participants.find((p: any) => p.id === msg.senderId)!

            return (
              <div key={msg.id} className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
                    <AvatarFallback className="text-xs">{sender.name[0]}</AvatarFallback>
                  </Avatar>
                )}

                <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isCurrentUser ? "bg-primary text-primary-foreground" : "bg-card border"
                    }`}
                  >
                    {msg.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={msg.imageUrl || "/placeholder.svg"}
                          alt="Shared image"
                          className="max-w-full h-auto rounded"
                        />
                      </div>
                    )}
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {isCurrentUser && (
                      <span className="text-xs text-muted-foreground">
                        {msg.status === "read" ? "Read" : msg.status === "delivered" ? "Delivered" : "Sent"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-card p-4">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowTipModal(true)}
            className="flex-shrink-0 text-pink-500 border-pink-200 hover:bg-pink-50"
          >
            <span className="text-xs font-medium">Tip</span>
          </Button>

          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="resize-none"
            />
          </div>

          <Button type="submit" disabled={sending || !message.trim()} className="flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          Keep conversations respectful and focused on the item. Report any inappropriate behavior.
        </p>
      </div>

      <TipModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
        recipientName={otherParticipant.name}
        recipientId={otherParticipant.id}
      />
    </MobileLayout>
  )
}
