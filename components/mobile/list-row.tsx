"use client"

import type React from "react"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListRowProps {
  children: React.ReactNode
  onClick?: () => void
  showChevron?: boolean
  className?: string
  badge?: string
  rightText?: string
}

export function ListRow({ children, onClick, showChevron = true, className, badge, rightText }: ListRowProps) {
  const Component = onClick ? "button" : "div"

  return (
    <Component
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full p-4 text-left transition-colors",
        onClick && "hover:bg-[#15161C] active:bg-[#262833]",
        className,
      )}
    >
      <div className="flex-1 min-w-0">{children}</div>

      <div className="flex items-center space-x-2 ml-3">
        {badge && <span className="bg-[#FF4D8D] text-white text-xs font-medium px-2 py-1 rounded-full">{badge}</span>}
        {rightText && <span className="text-sm text-[#B4B6C2]">{rightText}</span>}
        {showChevron && onClick && <ChevronRight className="h-4 w-4 text-[#B4B6C2]" />}
      </div>
    </Component>
  )
}
