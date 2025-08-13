"use client"

import type React from "react"

import { useEffect } from "react"

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Enable smooth scrolling for the entire app
    document.documentElement.style.scrollBehavior = "smooth"

    // Add momentum scrolling for iOS
    document.body.style.webkitOverflowScrolling = "touch"

    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  return <>{children}</>
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}
