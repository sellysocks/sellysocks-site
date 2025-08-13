"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

// Mock user type for when Firebase isn't available
interface MockUser {
  uid: string
  email: string | null
  displayName?: string | null
}

interface RecentlyViewedItem {
  itemId: string
  title: string
  price: number
  image: string
  viewedAt: Date
}

interface VerificationStatus {
  email: {
    verified: boolean
    verifiedAt?: Date
  }
  phone: {
    verified: boolean
    verifiedAt?: Date
    number?: string
  }
  socialMedia: {
    instagram: {
      verified: boolean
      verifiedAt?: Date
      username?: string
    }
    twitter: {
      verified: boolean
      verifiedAt?: Date
      username?: string
    }
    facebook: {
      verified: boolean
      verifiedAt?: Date
      username?: string
    }
  }
  identity: {
    verified: boolean
    verifiedAt?: Date
    method?: "government_id" | "passport" | "driving_license"
  }
}

interface UserProfile {
  uid: string
  email: string
  displayName?: string
  handle?: string
  avatar?: string
  bio?: string
  role: "user" | "admin"
  verifiedSeller: boolean
  verification: VerificationStatus
  stripeAccountId?: string
  payoutsEnabled?: boolean
  favourites?: string[]
  favouriteCreators?: string[]
  wishlist?: WishlistItem[]
  priceAlerts?: PriceAlert[]
  recentlyViewed?: RecentlyViewedItem[]
  stats: {
    itemsSold: number
    totalEarnings: number
    rating: number
    reviewCount: number
  }
  createdAt: Date
}

interface WishlistItem {
  itemId: string
  addedAt: Date
  priceAlertEnabled: boolean
  targetPrice?: number
}

interface PriceAlert {
  itemId: string
  targetPrice: number
  currentPrice: number
  createdAt: Date
  triggered: boolean
}

interface AuthContextType {
  user: MockUser | null
  profile: UserProfile | null
  loading: boolean
  isFirebaseConfigured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  logout: () => Promise<void>
  needsProfileSetup: () => boolean
  addToFavourites: (itemId: string) => Promise<void>
  removeFromFavourites: (itemId: string) => Promise<void>
  isFavourited: (itemId: string) => boolean
  addCreatorToFavourites: (creatorId: string) => Promise<void>
  removeCreatorFromFavourites: (creatorId: string) => Promise<void>
  isCreatorFavourited: (creatorId: string) => boolean
  addToWishlist: (itemId: string, priceAlertEnabled?: boolean, targetPrice?: number) => Promise<void>
  removeFromWishlist: (itemId: string) => Promise<void>
  isInWishlist: (itemId: string) => boolean
  updatePriceAlert: (itemId: string, targetPrice: number) => Promise<void>
  checkPriceAlerts: () => Promise<void>
  addToRecentlyViewed: (item: Omit<RecentlyViewedItem, "viewedAt">) => Promise<void>
  getRecentlyViewed: () => RecentlyViewedItem[]
  clearRecentlyViewed: () => Promise<void>
  requestVerification: (type: string, data?: any) => Promise<void>
  getVerificationLevel: () => "none" | "basic" | "verified" | "premium"
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
  verification: {
    email: {
      verified: true,
      verifiedAt: new Date("2024-01-15"),
    },
    phone: {
      verified: true,
      verifiedAt: new Date("2024-01-16"),
      number: "+44 7*** *** 123",
    },
    socialMedia: {
      instagram: {
        verified: true,
        verifiedAt: new Date("2024-01-17"),
        username: "@demo_user",
      },
      twitter: {
        verified: false,
      },
      facebook: {
        verified: false,
      },
    },
    identity: {
      verified: true,
      verifiedAt: new Date("2024-01-18"),
      method: "government_id",
    },
  },
  stripeAccountId: "acct_demo123",
  payoutsEnabled: true,
  favourites: [],
  favouriteCreators: [],
  wishlist: [],
  priceAlerts: [],
  recentlyViewed: [],
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

  const signIn = async (email: string, password: string) => {
    // Mock sign-in process - in production this would use Firebase authentication
    console.log(`Signing in with email: ${email} and password: ${password}`)
    setUser(mockUser)
    setProfile(mockProfile)
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    // Mock sign-up process - in production this would use Firebase authentication
    console.log(`Signing up with email: ${email}, password: ${password}, displayName: ${displayName}`)
    setUser(mockUser)
    setProfile(mockProfile)
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    // Mock update profile process - in production this would update the user's profile in Firebase
    console.log("Updating profile with:", updates)
    setProfile({ ...profile, ...updates })
  }

  const logout = async () => {
    // Mock logout process - in production this would use Firebase authentication
    console.log("Logging out")
    setUser(null)
    setProfile(null)
  }

  const needsProfileSetup = () => {
    // Determine if profile setup is needed based on profile completeness
    if (!profile) return true
    return false
  }

  const addToFavourites = useCallback(
    async (itemId: string) => {
      console.log(`Adding item ${itemId} to favourites`)
      if (profile) {
        setProfile({ ...profile, favourites: [...(profile.favourites || []), itemId] })
      }
    },
    [profile],
  )

  const removeFromFavourites = useCallback(
    async (itemId: string) => {
      console.log(`Removing item ${itemId} from favourites`)
      if (profile) {
        setProfile({ ...profile, favourites: (profile.favourites || []).filter((id) => id !== itemId) })
      }
    },
    [profile],
  )

  const isFavourited = (itemId: string) => {
    // Check if item is in favourites
    return profile?.favourites?.includes(itemId) || false
  }

  const addCreatorToFavourites = useCallback(
    async (creatorId: string) => {
      // Mock add creator to favourites process
      console.log(`Adding creator ${creatorId} to favourites`)
      if (profile) {
        setProfile({ ...profile, favouriteCreators: [...(profile.favouriteCreators || []), creatorId] })
      }
    },
    [profile],
  )

  const removeCreatorFromFavourites = useCallback(
    async (creatorId: string) => {
      // Mock remove creator from favourites process
      console.log(`Removing creator ${creatorId} from favourites`)
      if (profile) {
        setProfile({
          ...profile,
          favouriteCreators: (profile.favouriteCreators || []).filter((id) => id !== creatorId),
        })
      }
    },
    [profile],
  )

  const isCreatorFavourited = (creatorId: string) => {
    // Check if creator is in favourites
    return profile?.favouriteCreators?.includes(creatorId) || false
  }

  const addToWishlist = useCallback(
    async (itemId: string, priceAlertEnabled?: boolean, targetPrice?: number) => {
      console.log(
        `Adding item ${itemId} to wishlist with price alert enabled: ${priceAlertEnabled} and target price: ${targetPrice}`,
      )
      if (profile) {
        const newItem: WishlistItem = {
          itemId,
          addedAt: new Date(),
          priceAlertEnabled: priceAlertEnabled || false,
          targetPrice,
        }
        setProfile({ ...profile, wishlist: [...(profile.wishlist || []), newItem] })
      }
    },
    [profile],
  )

  const removeFromWishlist = useCallback(
    async (itemId: string) => {
      console.log(`Removing item ${itemId} from wishlist`)
      if (profile) {
        setProfile({ ...profile, wishlist: (profile.wishlist || []).filter((item) => item.itemId !== itemId) })
      }
    },
    [profile],
  )

  const isInWishlist = (itemId: string) => {
    // Check if item is in wishlist
    return profile?.wishlist?.some((item) => item.itemId === itemId) || false
  }

  const updatePriceAlert = useCallback(
    async (itemId: string, targetPrice: number) => {
      // Mock update price alert process
      console.log(`Updating price alert for item ${itemId} with target price: ${targetPrice}`)
      if (profile) {
        const updatedWishlist = profile.wishlist?.map((item) => {
          if (item.itemId === itemId) {
            return { ...item, targetPrice }
          }
          return item
        })
        setProfile({ ...profile, wishlist: updatedWishlist })
      }
    },
    [profile],
  )

  const checkPriceAlerts = useCallback(async () => {
    // Mock check price alerts process
    console.log("Checking price alerts")
    if (profile) {
      const updatedWishlist = profile.wishlist?.map((item) => {
        if (item.priceAlertEnabled && item.targetPrice && item.currentPrice < item.targetPrice) {
          return { ...item, triggered: true }
        }
        return item
      })
      setProfile({ ...profile, wishlist: updatedWishlist })
    }
  }, [profile])

  const addToRecentlyViewed = useCallback(
    async (item: Omit<RecentlyViewedItem, "viewedAt">) => {
      // Mock add to recently viewed process
      console.log(`Adding item ${item.itemId} to recently viewed`)
      if (profile) {
        const newItem: RecentlyViewedItem = { ...item, viewedAt: new Date() }
        const existingItems = profile.recentlyViewed || []
        // Remove existing entry if it exists, then add to front
        const filteredItems = existingItems.filter((existing) => existing.itemId !== item.itemId)
        const updatedItems = [newItem, ...filteredItems].slice(0, 10) // Keep only last 10 items
        setProfile({ ...profile, recentlyViewed: updatedItems })
      }
    },
    [profile],
  )

  const getRecentlyViewed = () => {
    // Get recently viewed items
    return profile?.recentlyViewed || []
  }

  const clearRecentlyViewed = useCallback(async () => {
    // Mock clear recently viewed process
    console.log("Clearing recently viewed items")
    if (profile) {
      setProfile({ ...profile, recentlyViewed: [] })
    }
  }, [profile])

  const requestVerification = useCallback(
    async (type: string, data?: any) => {
      if (!profile) throw new Error("No profile available")

      console.log(`Requesting ${type} verification with data:`, data)

      // Mock verification process - in production this would integrate with verification services
      const updatedVerification = { ...profile.verification }

      switch (type) {
        case "phone":
          updatedVerification.phone = {
            verified: true,
            verifiedAt: new Date(),
            number: data?.phoneNumber || "+44 7*** *** ***",
          }
          break
        case "instagram":
          updatedVerification.socialMedia.instagram = {
            verified: true,
            verifiedAt: new Date(),
            username: data?.username || "@user",
          }
          break
        case "twitter":
          updatedVerification.socialMedia.twitter = {
            verified: true,
            verifiedAt: new Date(),
            username: data?.username || "@user",
          }
          break
        case "facebook":
          updatedVerification.socialMedia.facebook = {
            verified: true,
            verifiedAt: new Date(),
            username: data?.username || "user",
          }
          break
        case "identity":
          updatedVerification.identity = {
            verified: true,
            verifiedAt: new Date(),
            method: data?.method || "government_id",
          }
          break
      }

      await updateProfile({ verification: updatedVerification })
    },
    [profile],
  )

  const getVerificationLevel = () => {
    if (!profile) return "none"

    const { verification } = profile
    let verifiedCount = 0

    if (verification.email.verified) verifiedCount++
    if (verification.phone.verified) verifiedCount++
    if (verification.socialMedia.instagram.verified) verifiedCount++
    if (verification.socialMedia.twitter.verified) verifiedCount++
    if (verification.socialMedia.facebook.verified) verifiedCount++
    if (verification.identity.verified) verifiedCount++

    if (verifiedCount === 0) return "none"
    if (verifiedCount <= 2) return "basic"
    if (verifiedCount <= 4) return "verified"
    return "premium"
  }

  useEffect(() => {
    // For now, use mock user to demonstrate the UI
    // In production, this would use Firebase authentication
    setTimeout(() => {
      setUser(mockUser)
      setProfile(mockProfile)
      setLoading(false)
    }, 500)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isFirebaseConfigured,
        signIn,
        signUp,
        updateProfile,
        logout,
        needsProfileSetup,
        addToFavourites,
        removeFromFavourites,
        isFavourited,
        addCreatorToFavourites,
        removeCreatorFromFavourites,
        isCreatorFavourited,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        updatePriceAlert,
        checkPriceAlerts,
        addToRecentlyViewed,
        getRecentlyViewed,
        clearRecentlyViewed,
        requestVerification,
        getVerificationLevel,
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
