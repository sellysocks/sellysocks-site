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
import { Send, ImageIcon, MoreVertical, Star, Heart } from "lucide-react"
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

// Mock conversation data
const mockConversations = {
  "thread-1": {
    id: "thread-1",
    participants: [
      {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg",
      },
      {
        id: "emma-rose",
        name: "Emma Rose",
        avatar: "/diverse-woman-avatar.png",
        verified: true,
        rating: 4.9,
        responseTime: "Usually responds within 2 hours",
      },
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
        text: "Hi there! Yes, they're still available. They're one of my favorites - I wore them during my most intense workout sessions. They're super soft and have absorbed so much energy from my training!",
        timestamp: "2024-01-25T10:45:00Z",
        status: "read",
      },
      {
        id: "msg-3",
        senderId: "current-user",
        text: "That sounds perfect! I love the personal touch. Could you tell me more about the material and how they feel?",
        timestamp: "2024-01-25T11:00:00Z",
        status: "read",
      },
      {
        id: "msg-4",
        senderId: "emma-rose",
        text: "They're 100% cotton, super breathable and soft. After all my workouts, they've developed this amazing worn-in feel that's just perfect. I always get compliments on how comfortable they look!",
        timestamp: "2024-01-25T11:15:00Z",
        status: "read",
      },
      {
        id: "msg-5",
        senderId: "emma-rose",
        imageUrl: "/cotton-socks-detail.png",
        text: "Here's a close-up of the texture - you can see how soft they've become!",
        timestamp: "2024-01-25T11:16:00Z",
        status: "delivered",
      },
    ],
  },
  "thread-emma": {
    id: "thread-emma",
    participants: [
      {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg",
      },
      {
        id: "emma-rose",
        name: "Emma Rose",
        avatar: "/diverse-woman-avatar.png",
        verified: true,
        rating: 4.9,
        responseTime: "Usually responds within 2 hours",
      },
    ],
    itemContext: {
      id: "2",
      title: "Silk Stockings",
      image: "/silk-stockings.png",
      price: 45,
      status: "active",
    },
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
        text: "Thank you! These are some of my favorites. The silk is so luxurious and they have such a beautiful sheen. I've worn them to so many special occasions!",
        timestamp: "2024-01-25T14:45:00Z",
        status: "read",
      },
      {
        id: "msg-3",
        senderId: "current-user",
        text: "They sound perfect for what I'm looking for. What size are they?",
        timestamp: "2024-01-25T15:00:00Z",
        status: "read",
      },
      {
        id: "msg-4",
        senderId: "emma-rose",
        text: "They're size medium and fit beautifully. The silk has this amazing stretch that makes them so comfortable to wear. Would you like to see more photos?",
        timestamp: "2024-01-25T15:15:00Z",
        status: "delivered",
      },
    ],
  },
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const conversation = mockConversations[params.threadId as keyof typeof mockConversations]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages])

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

  if (!conversation) {
    notFound()
  }

  const otherParticipant = conversation.participants.find((p) => p.id !== "current-user")!

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)
    try {
      // Here you would send the message to Firestore
      toast({
        title: "Message sent",
        description: "Your message has been delivered.",
      })
      setMessage("")
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Here you would upload the image and send it as a message
      toast({
        title: "Image uploaded",
        description: "Your image has been sent.",
      })
    }
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
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
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{otherParticipant.rating}</span>
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
      {/* Item Context */}
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {conversation.messages.map((msg) => {
            const isCurrentUser = msg.senderId === "current-user"
            const sender = conversation.participants.find((p) => p.id === msg.senderId)!

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
                    <span className="text-xs text-muted-foreground">{formatMessageTime(msg.timestamp)}</span>
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

      {/* Message Input */}
      <div className="border-t bg-card p-4">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

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
