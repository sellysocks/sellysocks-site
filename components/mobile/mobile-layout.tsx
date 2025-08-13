import type React from "react"
import { Header } from "./header"
import { TabBar } from "./tab-bar"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll"

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  customHeader?: React.ReactNode
  showBack?: boolean
  showBackButton?: boolean
  showPublic?: boolean
  showSettings?: boolean
  showMenu?: boolean
  onBack?: () => void
}

export function MobileLayout({
  children,
  title,
  subtitle,
  customHeader,
  showBack = false,
  showBackButton = false,
  showPublic = true,
  showSettings = true,
  showMenu = true,
  onBack,
}: MobileLayoutProps) {
  return (
    <SmoothScrollProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-[#0B0B10] flex flex-col safe-area-top safe-area-bottom">
          {customHeader ? (
            <div className="bg-[#0B0B10] border-b border-[#262833] px-4 transition-colors duration-200">
              {customHeader}
            </div>
          ) : (
            <Header
              title={title}
              subtitle={subtitle}
              showBack={showBack || showBackButton}
              showPublic={showPublic}
              showSettings={showSettings}
              showMenu={showMenu}
              onBack={onBack}
            />
          )}

          <main className="flex-1 pb-20 px-4 py-4 space-y-4 max-w-md mx-auto w-full transition-all duration-300 ease-out">
            {children}
          </main>

          <TabBar />
        </div>
      </ErrorBoundary>
    </SmoothScrollProvider>
  )
}
