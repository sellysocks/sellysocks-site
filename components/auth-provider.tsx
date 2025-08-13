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

  const signIn = useCallback(async (email: string, password: string) => {
    console.log(`Signing in with email: ${email} and password: ${password}`)
    setUser(mockUser)
    setProfile(mockProfile)
  }, [])

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    console.log(`Signing up with email: ${email}, password: ${password}, displayName: ${displayName}`)
    setUser(mockUser)
    setProfile(mockProfile)
  }, [])

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    console.log("Updating profile with:", updates)
    setProfile((prev) => (prev ? { ...prev, ...updates } : null))
  }, [])

  const logout = useCallback(async () => {
    console.log("Logging out")
    setUser(null)
    setProfile(null)
  }, [])

  const needsProfileSetup = useCallback(() => {
    if (!profile) return true
    return false
  }, [profile])

  const addToFavourites = useCallback(async (itemId: string) => {
    console.log(`Adding item ${itemId} to favourites`)
    setProfile((prev) => (prev ? { ...prev, favourites: [...(prev.favourites || []), itemId] } : null))
  }, [])

  const removeFromFavourites = useCallback(async (itemId: string) => {
    console.log(`Removing item ${itemId} from favourites`)
    setProfile((prev) => (prev ? { ...prev, favourites: (prev.favourites || []).filter((id) => id !== itemId) } : null))
  }, [])

  const isFavourited = useCallback(
    (itemId: string) => {
      return profile?.favourites?.includes(itemId) || false
    },
    [profile?.favourites],
  )

  const addCreatorToFavourites = useCallback(async (creatorId: string) => {
    console.log(`Adding creator ${creatorId} to favourites`)
    setProfile((prev) => (prev ? { ...prev, favouriteCreators: [...(prev.favouriteCreators || []), creatorId] } : null))
  }, [])

  const removeCreatorFromFavourites = useCallback(async (creatorId: string) => {
    console.log(`Removing creator ${creatorId} from favourites`)
    setProfile((prev) =>
      prev ? { ...prev, favouriteCreators: (prev.favouriteCreators || []).filter((id) => id !== creatorId) } : null,
    )
  }, [])

  const isCreatorFavourited = useCallback(
    (creatorId: string) => {
      return profile?.favouriteCreators?.includes(creatorId) || false
    },
    [profile?.favouriteCreators],
  )

  const addToWishlist = useCallback(async (itemId: string, priceAlertEnabled?: boolean, targetPrice?: number) => {
    console.log(
      `Adding item ${itemId} to wishlist with price alert enabled: ${priceAlertEnabled} and target price: ${targetPrice}`,
    )
    const newItem: WishlistItem = {
      itemId,
      addedAt: new Date(),
      priceAlertEnabled: priceAlertEnabled || false,
      targetPrice,
    }
    setProfile((prev) => (prev ? { ...prev, wishlist: [...(prev.wishlist || []), newItem] } : null))
  }, [])

  const removeFromWishlist = useCallback(async (itemId: string) => {
    console.log(`Removing item ${itemId} from wishlist`)
    setProfile((prev) =>
      prev ? { ...prev, wishlist: (prev.wishlist || []).filter((item) => item.itemId !== itemId) } : null,
    )
  }, [])

  const isInWishlist = useCallback(
    (itemId: string) => {
      return profile?.wishlist?.some((item) => item.itemId === itemId) || false
    },
    [profile?.wishlist],
  )

  const updatePriceAlert = useCallback(async (itemId: string, targetPrice: number) => {
    console.log(`Updating price alert for item ${itemId} with target price: ${targetPrice}`)
    setProfile((prev) => {
      if (!prev) return null
      const updatedWishlist = prev.wishlist?.map((item) => {
        if (item.itemId === itemId) {
          return { ...item, targetPrice }
        }
        return item
      })
      return { ...prev, wishlist: updatedWishlist }
    })
  }, [])

  const checkPriceAlerts = useCallback(async () => {
    console.log("Checking price alerts")
    setProfile((prev) => {
      if (!prev) return null
      const updatedWishlist = prev.wishlist?.map((item) => {
        if (item.priceAlertEnabled && item.targetPrice && item.currentPrice < item.targetPrice) {
          return { ...item, triggered: true }
        }
        return item
      })
      return { ...prev, wishlist: updatedWishlist }
    })
  }, [])

  const addToRecentlyViewed = useCallback(async (item: Omit<RecentlyViewedItem, "viewedAt">) => {
    console.log(`Adding item ${item.itemId} to recently viewed`)
    const newItem: RecentlyViewedItem = { ...item, viewedAt: new Date() }
    setProfile((prev) => {
      if (!prev) return null
      const updatedRecentlyViewed = [newItem, ...(prev.recentlyViewed || [])].slice(0, 10)
      return { ...prev, recentlyViewed: updatedRecentlyViewed }
    })
  }, [])

  const getRecentlyViewed = useCallback(() => {
    return profile?.recentlyViewed || []
  }, [profile?.recentlyViewed])

  const clearRecentlyViewed = useCallback(async () => {
    console.log("Clearing recently viewed items")
    setProfile((prev) => (prev ? { ...prev, recentlyViewed: [] } : null))
  }, [])

  const requestVerification = useCallback(
    async (type: string, data?: any) => {
      if (!profile) throw new Error("No profile available")

      console.log(`Requesting ${type} verification with data:`, data)

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
    [profile, updateProfile],
  )

  const getVerificationLevel = useCallback(() => {
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
  }, [profile])

  useEffect(() => {
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
