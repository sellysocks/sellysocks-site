"use client"

import { ChevronLeft, Globe, Settings, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface HeaderProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  showPublic?: boolean
  showSettings?: boolean
  showMenu?: boolean
  onBack?: () => void
}

export function Header({
  title,
  subtitle,
  showBack = false,
  showPublic = true,
  showSettings = true,
  showMenu = true,
  onBack,
}: HeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B10] border-b border-[#262833] safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center min-w-0">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2 -ml-2 text-white hover:bg-[#15161C]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center */}
        <div className="flex-1 text-center px-4">
          {title && <h1 className="text-lg font-semibold text-white truncate">{title}</h1>}
          {subtitle && <p className="text-sm text-[#B4B6C2] truncate">{subtitle}</p>}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {showPublic && (
            <Button variant="ghost" size="sm" className="text-white hover:bg-[#15161C] text-sm px-3 py-1.5">
              <Globe className="h-4 w-4 mr-1" />
              Public
            </Button>
          )}
          {showSettings && (
            <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-[#15161C]">
              <Settings className="h-4 w-4" />
            </Button>
          )}
          {showMenu && (
            <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-[#15161C]">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
