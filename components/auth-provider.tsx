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
  handle?: string // Added handle field
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
  updateProfile: (updates: Partial<UserProfile>) => Promise<void> // Added updateProfile method
  logout: () => Promise<void>
  needsProfileSetup: () => boolean // Added profile setup check
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

  const isFirebaseConfigured = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY.trim() !== "" &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.trim() !== "" &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.trim() !== ""
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
    console.log("Sign in attempt:", { email, isFirebaseConfigured })

    // Mock sign in - create a user based on the email
    const newUser = {
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split("@")[0],
    }

    setUser(newUser)
    setProfile({
      ...mockProfile,
      uid: newUser.uid,
      email,
      displayName: email.split("@")[0],
    })
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    console.log("Sign up attempt:", { email, displayName, isFirebaseConfigured })

    // Mock sign up - create a new user
    const newUser = {
      uid: `user-${Date.now()}`,
      email,
      displayName: displayName || email.split("@")[0],
    }

    const newProfile = {
      uid: newUser.uid,
      email,
      displayName: displayName || email.split("@")[0],
      avatar: "/diverse-woman-avatar.png",
      bio: "",
      role: "user" as const,
      verifiedSeller: false,
      stats: {
        itemsSold: 0,
        totalEarnings: 0,
        rating: 0,
        reviewCount: 0,
      },
      createdAt: new Date(),
    }

    setUser(newUser)
    setProfile(newProfile)

    console.log("Sign up successful:", newUser)
  }

  const logout = async () => {
    setUser(null)
    setProfile(null)
  }

  const needsProfileSetup = () => {
    if (!profile) return false
    return !profile.displayName || !profile.handle
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) throw new Error("No profile to update")

    const updatedProfile = { ...profile, ...updates }
    setProfile(updatedProfile)

    console.log("Profile updated:", updatedProfile)
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
        updateProfile, // Added updateProfile to context
        logout,
        needsProfileSetup, // Added needsProfileSetup to context
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
