"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Mock user type for when Firebase isn't available
interface MockUser {
  uid: string
  email: string | null
  displayName?: string | null
}

interface UserProfile {
  uid: string
  email: string
  displayName?: string
  avatar?: string
  bio?: string
  role: "user" | "admin"
  verifiedSeller: boolean
  stats: {
    itemsSold: number
    totalEarnings: number
    rating: number
    reviewCount: number
  }
  createdAt: Date
}

interface AuthContextType {
  user: MockUser | null
  profile: UserProfile | null
  loading: boolean
  isFirebaseConfigured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for development/demo purposes
const mockUser: MockUser = {
  uid: "demo-user-123",
  email: "demo@sellysocks.com",
  displayName: "Demo User",
}

const mockProfile: UserProfile = {
  uid: "demo-user-123",
  email: "demo@sellysocks.com",
  displayName: "Demo User",
  avatar: "/diverse-woman-avatar.png",
  bio: "Love collecting unique socks!",
  role: "user",
  verifiedSeller: true,
  stats: {
    itemsSold: 12,
    totalEarnings: 240,
    rating: 4.8,
    reviewCount: 15,
  },
  createdAt: new Date("2024-01-15"),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if Firebase environment variables are configured
  const isFirebaseConfigured = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  )

  useEffect(() => {
    // For now, use mock user to demonstrate the UI
    // In production, this would use Firebase authentication
    setTimeout(() => {
      setUser(mockUser)
      setProfile(mockProfile)
      setLoading(false)
    }, 500)
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      // Mock sign in for demo
      setUser(mockUser)
      setProfile(mockProfile)
      return
    }

    // TODO: Implement Firebase sign in when configured
    throw new Error("Firebase authentication not yet implemented")
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!isFirebaseConfigured) {
      // Mock sign up for demo
      const newUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName: displayName || null,
      }
      setUser(newUser)
      setProfile({
        ...mockProfile,
        uid: newUser.uid,
        email,
        displayName: displayName || "",
      })
      return
    }

    // TODO: Implement Firebase sign up when configured
    throw new Error("Firebase authentication not yet implemented")
  }

  const logout = async () => {
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isFirebaseConfigured,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
