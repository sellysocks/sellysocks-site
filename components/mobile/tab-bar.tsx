"use client"

import { Home, Users, Plus, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    id: "sellers",
    label: "Sellers",
    icon: Users,
    href: "/sellers",
  },
  {
    id: "sell",
    label: "Sell",
    icon: Plus,
    href: "/sell",
    isSpecial: true,
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageCircle,
    href: "/messages",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/profile",
  },
]

export function TabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B10] border-t border-[#262833] safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-lg transition-colors",
                isActive && !tab.isSpecial && "text-[#FF4D8D]",
                !isActive && !tab.isSpecial && "text-[#B4B6C2] hover:text-white",
              )}
            >
              {tab.isSpecial ? (
                <div className="flex flex-col items-center">
                  <div className="bg-[#FF4D8D] rounded-full p-2 mb-1">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-[#FF4D8D]">{tab.label}</span>
                </div>
              ) : (
                <>
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
