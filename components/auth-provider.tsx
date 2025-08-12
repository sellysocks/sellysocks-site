"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db, isFirebaseConfigured } from "@/lib/firebase"

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
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isFirebaseConfigured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user && db) {
        try {
          // Fetch user profile from Firestore
          const profileDoc = await getDoc(doc(db, "users", user.uid))
          if (profileDoc.exists()) {
            setProfile(profileDoc.data() as UserProfile)
          }
        } catch (error) {
          console.warn("Failed to fetch user profile:", error)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Please set up your environment variables.")
    }
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!isFirebaseConfigured || !auth || !db) {
      throw new Error("Firebase is not configured. Please set up your environment variables.")
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || "",
      role: "user",
      verifiedSeller: false,
      stats: {
        itemsSold: 0,
        totalEarnings: 0,
        rating: 0,
        reviewCount: 0,
      },
      createdAt: new Date(),
    }

    await setDoc(doc(db, "users", user.uid), userProfile)
    setProfile(userProfile)
  }

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Please set up your environment variables.")
    }
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, isFirebaseConfigured, signIn, signUp, logout }}>
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
