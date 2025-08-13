import type React from "react"
import { Header } from "./header"
import { TabBar } from "./tab-bar"

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showBack?: boolean
  showPublic?: boolean
  showSettings?: boolean
  showMenu?: boolean
  onBack?: () => void
}

export function MobileLayout({
  children,
  title,
  subtitle,
  showBack = false,
  showPublic = true,
  showSettings = true,
  showMenu = true,
  onBack,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B0B10] flex flex-col">
      <Header
        title={title}
        subtitle={subtitle}
        showBack={showBack}
        showPublic={showPublic}
        showSettings={showSettings}
        showMenu={showMenu}
        onBack={onBack}
      />

      <main className="flex-1 pb-20 px-4 py-4 space-y-4 max-w-md mx-auto w-full">{children}</main>

      <TabBar />
    </div>
  )
}
