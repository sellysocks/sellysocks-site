import type React from "react"
import { cn } from "@/lib/utils"

interface SectionCardProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export function SectionCard({ children, className, title }: SectionCardProps) {
  return (
    <div className={cn("bg-[#15161C] border border-[#262833] rounded-2xl p-4 shadow-sm", className)}>
      {title && <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>}
      {children}
    </div>
  )
}
