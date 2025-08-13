"use client"

import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock conversation data
const mockConversations = [
  {
    id: "thread-1",
    participant: {
      name: "Emma Rose",
      avatar: "/confident-short-hair-woman.png",
    },
    listingTitle: "Cozy Cotton Ankle Socks",
    lastMessage: "Hi! I'm interested in your socks. Are they still available?",
    timestamp: "2m ago",
    unread: true,
  },
  {
    id: "thread-2",
    participant: {
      name: "Sophie Chen",
      avatar: "/curly-haired-woman.png",
    },
    listingTitle: "Silk Designer Stockings",
    lastMessage: "Perfect! I'll ship them out tomorrow morning with tracking.",
    timestamp: "1h ago",
    unread: false,
  },
  {
    id: "thread-3",
    participant: {
      name: "Mia Taylor",
      avatar: "/diverse-woman-avatar.png",
    },
    listingTitle: "Athletic Running Socks",
    lastMessage: "Thank you so much! They arrived and they're perfect",
    timestamp: "3h ago",
    unread: true,
  },
]

export default function MessagesPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <MobileLayout title="Sign In Required" showBack={false} showPublic={false} showSettings={false} showMenu={false}>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-4">Sign In Required</h2>
          <p className="text-[#B4B6C2] mb-6">You need to be signed in to view your messages.</p>
          <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </MobileLayout>
    )
  }

  const handleConversationTap = (threadId: string) => {
    router.push(`/messages/${threadId}`)
  }

  return (
    <MobileLayout title="Messages" subtitle="Chat with buyers and sellers">
      <div className="space-y-0">
        {mockConversations.map((conversation, index) => (
          <div key={conversation.id}>
            <button
              onClick={() => handleConversationTap(conversation.id)}
              className="w-full p-4 flex items-center space-x-3 hover:bg-[#15161C] active:bg-[#262833] transition-colors text-left"
            >
              {/* Avatar */}
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage
                  src={conversation.participant.avatar || "/placeholder.svg"}
                  alt={conversation.participant.name}
                />
                <AvatarFallback className="bg-[#262833] text-white text-sm">
                  {conversation.participant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Name */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white truncate">{conversation.participant.name}</h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-xs text-[#B4B6C2]">{conversation.timestamp}</span>
                    {conversation.unread && <div className="w-2 h-2 bg-[#FF4D8D] rounded-full" />}
                  </div>
                </div>

                {/* Listing context */}
                <p className="text-sm text-[#FF4D8D] mb-1 truncate">Re: {conversation.listingTitle}</p>

                {/* Last message */}
                <p className="text-sm text-[#B4B6C2] truncate">{conversation.lastMessage}</p>
              </div>
            </button>

            {/* Divider (except for last item) */}
            {index < mockConversations.length - 1 && <div className="border-b border-[#262833] ml-16" />}
          </div>
        ))}

        {/* Empty state if no conversations */}
        {mockConversations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#15161C] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#B4B6C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No messages yet</h3>
            <p className="text-[#B4B6C2] mb-6 text-sm">
              Start a conversation by messaging a seller about an item you're interested in.
            </p>
            <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
              <Link href="/">Browse Items</Link>
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
