"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { Search, MessageCircle, Plus } from "lucide-react"
import Link from "next/link"

// Mock conversation data
const mockConversations = [
  {
    id: "thread-1",
    participants: [
      {
        id: "emma-rose",
        name: "Emma Rose",
        avatar: "/diverse-woman-avatar.png",
      },
    ],
    lastMessage: {
      text: "Hi! I'm interested in your cozy cotton socks. Are they still available?",
      timestamp: "2024-01-25T10:30:00Z",
      senderId: "current-user",
    },
    unreadCount: 0,
    itemContext: {
      id: "1",
      title: "Cozy Cotton Socks",
      image: "/cozy-cotton-socks.png",
      price: 25,
    },
  },
  {
    id: "thread-2",
    participants: [
      {
        id: "sophie-luxe",
        name: "Sophie Luxe",
        avatar: "/woman-avatar-2.png",
      },
    ],
    lastMessage: {
      text: "Perfect! I'll ship them out tomorrow morning. Here's the tracking info...",
      timestamp: "2024-01-24T16:45:00Z",
      senderId: "sophie-luxe",
    },
    unreadCount: 2,
    itemContext: {
      id: "2",
      title: "Silk Stockings",
      image: "/silk-stockings.png",
      price: 45,
    },
  },
  {
    id: "thread-3",
    participants: [
      {
        id: "maya-active",
        name: "Maya Active",
        avatar: "/woman-avatar-3.png",
      },
    ],
    lastMessage: {
      text: "Thank you so much! The socks arrived and they're perfect 💕",
      timestamp: "2024-01-23T14:20:00Z",
      senderId: "current-user",
    },
    unreadCount: 0,
    itemContext: {
      id: "3",
      title: "Athletic Ankle Socks",
      image: "/placeholder-niqvm.png",
      price: 18,
    },
  },
  {
    id: "thread-4",
    participants: [
      {
        id: "aria-elegant",
        name: "Aria Elegant",
        avatar: "/woman-avatar-4.png",
      },
    ],
    lastMessage: {
      text: "Could you tell me more about how you used these? I'm very interested!",
      timestamp: "2024-01-22T09:15:00Z",
      senderId: "current-user",
    },
    unreadCount: 1,
    itemContext: {
      id: "4",
      title: "Lace Thigh Highs",
      image: "/lace-thigh-high-socks.png",
      price: 35,
    },
  },
]

export default function MessagesPage() {
  const { user, profile } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view your messages.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const filteredConversations = mockConversations.filter((conversation) => {
    const otherParticipant = conversation.participants[0]
    return (
      otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.itemContext.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Messages</h1>
              <p className="text-muted-foreground">
                {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="space-y-2">
            {filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants[0]
              const isUnread = conversation.unreadCount > 0

              return (
                <Card
                  key={conversation.id}
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    isUnread ? "border-primary/20 bg-primary/5" : ""
                  }`}
                  asChild
                >
                  <Link href={`/messages/${conversation.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage
                            src={otherParticipant.avatar || "/placeholder.svg"}
                            alt={otherParticipant.name}
                          />
                          <AvatarFallback>{otherParticipant.name[0]}</AvatarFallback>
                        </Avatar>

                        {/* Conversation Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-medium truncate ${isUnread ? "font-semibold" : ""}`}>
                              {otherParticipant.name}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                              {conversation.unreadCount > 0 && (
                                <Badge
                                  variant="default"
                                  className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                                >
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Item Context */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded bg-muted overflow-hidden flex-shrink-0">
                              <img
                                src={conversation.itemContext.image || "/placeholder.svg"}
                                alt={conversation.itemContext.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs text-muted-foreground truncate">
                              {conversation.itemContext.title} • £{conversation.itemContext.price}
                            </span>
                          </div>

                          {/* Last Message */}
                          <p
                            className={`text-sm truncate ${
                              isUnread ? "text-foreground font-medium" : "text-muted-foreground"
                            }`}
                          >
                            {conversation.lastMessage.senderId === "current-user" && "You: "}
                            {conversation.lastMessage.text}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>

          {filteredConversations.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <div className="text-muted-foreground mb-4">
                {searchTerm ? "No conversations found matching your search." : "No messages yet."}
              </div>
              {!searchTerm && (
                <p className="text-sm text-muted-foreground mb-6">
                  Start a conversation by messaging a seller about an item you're interested in.
                </p>
              )}
              <Button asChild>
                <Link href="/">Browse Items</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
