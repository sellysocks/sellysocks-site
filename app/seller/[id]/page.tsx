"use client"

import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, MessageCircle, MapPin, Award } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"

// Mock seller data
const sellers = {
  "emma-rose": {
    id: "emma-rose",
    name: "Emma Rose",
    displayName: "Emma",
    avatar: "/diverse-woman-avatar.png",
    coverImage: "/fitness-gym-background.png",
    bio: "Fitness enthusiast sharing my workout essentials. Every item has been part of my daily routine and carries the energy of countless training sessions. I believe in quality pieces that perform as hard as you do.",
    verified: true,
    location: "London, UK",
    stats: {
      itemsSold: 47,
      rating: 4.9,
      reviewCount: 23,
      joinedDate: "2024-01-15",
      totalEarnings: 1250,
    },
    tags: ["Fitness", "Cotton", "Athletic", "Performance"],
    socialLinks: {
      instagram: "@emmarose_fit",
      twitter: "@emmafit",
    },
    items: [
      {
        id: "1",
        title: "Cozy Cotton Socks",
        price: 25,
        size: "M",
        condition: "Gently Used",
        usedFor: "Workout Sessions",
        images: ["/cozy-cotton-socks.png"],
        createdAt: "2024-01-20",
      },
      {
        id: "5",
        title: "Athletic Compression Socks",
        price: 30,
        size: "M",
        condition: "Well Loved",
        usedFor: "Marathon Training",
        images: ["/placeholder-31rk0.png"],
        createdAt: "2024-01-18",
      },
      {
        id: "6",
        title: "Yoga Practice Socks",
        price: 22,
        size: "M",
        condition: "Gently Used",
        usedFor: "Hot Yoga Sessions",
        images: ["/placeholder-sgri9.png"],
        createdAt: "2024-01-15",
      },
    ],
  },
  "sophie-luxe": {
    id: "sophie-luxe",
    name: "Sophie Luxe",
    displayName: "Sophie",
    avatar: "/woman-avatar-3.png",
    coverImage: "/luxury-bedroom-background.png",
    bio: "Luxury lingerie connoisseur with an eye for the finest pieces. I curate only the most exquisite items that have graced special moments. Each piece tells a story of elegance and sophistication.",
    verified: true,
    location: "Paris, France",
    stats: {
      itemsSold: 89,
      rating: 4.8,
      reviewCount: 67,
      joinedDate: "2023-08-10",
      totalEarnings: 3450,
    },
    tags: ["Luxury", "Silk", "Designer", "Premium"],
    socialLinks: {
      instagram: "@sophieluxe_paris",
      twitter: "@sophieluxe",
    },
    items: [
      {
        id: "2",
        title: "Silk Stockings",
        price: 45,
        size: "M",
        condition: "Like New",
        usedFor: "Special Occasions",
        images: ["/silk-stockings.png"],
        createdAt: "2024-01-22",
      },
      {
        id: "7",
        title: "Designer Lace Thigh Highs",
        price: 65,
        size: "M",
        condition: "Gently Used",
        usedFor: "Evening Events",
        images: ["/placeholder-lace.png"],
        createdAt: "2024-01-20",
      },
      {
        id: "8",
        title: "Premium Silk Hosiery",
        price: 55,
        size: "L",
        condition: "Like New",
        usedFor: "Date Nights",
        images: ["/placeholder-silk.png"],
        createdAt: "2024-01-18",
      },
    ],
  },
  "maya-active": {
    id: "maya-active",
    name: "Maya Active",
    displayName: "Maya",
    avatar: "/woman-avatar-2.png",
    coverImage: "/fitness-gym-background.png",
    bio: "Active lifestyle enthusiast who believes in sustainable fashion. I share my pre-loved activewear that has supported me through countless adventures. Each piece has been carefully maintained and is ready for its next journey.",
    verified: true,
    location: "Los Angeles, USA",
    stats: {
      itemsSold: 32,
      rating: 4.7,
      reviewCount: 18,
      joinedDate: "2024-02-01",
      totalEarnings: 890,
    },
    tags: ["Active", "Sustainable", "Outdoor", "Eco-Friendly"],
    socialLinks: {
      instagram: "@maya_active_life",
      twitter: "@mayaactive",
    },
    items: [
      {
        id: "9",
        title: "Running Compression Socks",
        price: 28,
        size: "S",
        condition: "Gently Used",
        usedFor: "Trail Running",
        images: ["/placeholder-running.png"],
        createdAt: "2024-02-05",
      },
      {
        id: "10",
        title: "Hiking Boot Socks",
        price: 24,
        size: "S",
        condition: "Well Loved",
        usedFor: "Mountain Hiking",
        images: ["/placeholder-hiking.png"],
        createdAt: "2024-02-03",
      },
    ],
  },
  "aria-elegant": {
    id: "aria-elegant",
    name: "Aria Elegant",
    displayName: "Aria",
    avatar: "/woman-avatar-4.png",
    coverImage: "/luxury-bedroom-background.png",
    bio: "Elegance is my passion. I curate sophisticated pieces that embody timeless style and grace. Each item in my collection has been part of special moments and carries the essence of refined femininity.",
    verified: true,
    location: "Milan, Italy",
    stats: {
      itemsSold: 56,
      rating: 4.9,
      reviewCount: 34,
      joinedDate: "2023-11-20",
      totalEarnings: 2100,
    },
    tags: ["Elegant", "Designer", "Sophisticated", "Italian"],
    socialLinks: {
      instagram: "@aria_elegant_style",
      twitter: "@ariaelegant",
    },
    items: [
      {
        id: "11",
        title: "Designer Sheer Stockings",
        price: 38,
        size: "M",
        condition: "Like New",
        usedFor: "Gallery Openings",
        images: ["/placeholder-sheer.png"],
        createdAt: "2024-01-25",
      },
      {
        id: "12",
        title: "Luxury Thigh Highs",
        price: 52,
        size: "M",
        condition: "Gently Used",
        usedFor: "Opera Nights",
        images: ["/lace-thigh-high-socks.png"],
        createdAt: "2024-01-23",
      },
    ],
  },
}

interface SellerPageProps {
  params: {
    id: string
  }
}

export default function SellerPage({ params }: SellerPageProps) {
  const { isCreatorFavourited, addCreatorToFavourites, removeCreatorFromFavourites } = useAuth()
  const seller = sellers[params.id as keyof typeof sellers]
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 })
  const [loadingReviews, setLoadingReviews] = useState(true)

  if (!seller) {
    notFound()
  }

  const messageThreadId = `thread-${seller.id.replace("-", "")}`

  const handleCreatorFavouriteToggle = async () => {
    try {
      if (isCreatorFavourited(seller.id)) {
        await removeCreatorFromFavourites(seller.id)
      } else {
        await addCreatorToFavourites(seller.id)
      }
    } catch (error) {
      console.error("Error toggling creator favourite:", error)
    }
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${seller.id}`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data.reviews)
          setReviewStats({
            averageRating: data.averageRating,
            totalReviews: data.totalReviews,
          })
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [seller.id])

  return (
    <MobileLayout
      title={seller.displayName}
      subtitle={`${reviewStats.averageRating || seller.stats.rating} ⭐ • ${reviewStats.totalReviews || seller.stats.reviewCount} reviews`}
      showBackButton={true}
    >
      {/* Cover & Profile Header */}
      <div className="relative mb-6">
        <div
          className="h-48 bg-cover bg-center rounded-lg overflow-hidden"
          style={{ backgroundImage: `url(${seller.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="px-4">
          <div className="relative -mt-16">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={seller.avatar || "/placeholder.svg"}
                  alt={seller.name}
                  className="w-24 h-24 rounded-full border-4 border-[#0A0B0F] object-cover"
                />
                {seller.verified && (
                  <Badge className="absolute -top-1 -right-1 bg-[#FF4D8D] text-white px-1 text-xs border-0">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 pb-2">
                <h1 className="text-2xl font-bold text-white mb-1">{seller.displayName}</h1>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-white">{reviewStats.averageRating || seller.stats.rating}</span>
                    <span className="text-[#B4B6C2]">({reviewStats.totalReviews || seller.stats.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#B4B6C2]">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{seller.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          {seller.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-[#262833] text-[#B4B6C2] border-0">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-6">
        <div className="flex gap-2">
          <Button asChild className="flex-1 bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            <Link href={`/messages/${messageThreadId}`}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent"
            onClick={handleCreatorFavouriteToggle}
          >
            <Heart className={`h-4 w-4 ${isCreatorFavourited(seller.id) ? "fill-[#FF4D8D] text-[#FF4D8D]" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#15161C] border border-[#262833]">
            <TabsTrigger
              value="items"
              className="text-[#B4B6C2] data-[state=active]:text-white data-[state=active]:bg-[#262833]"
            >
              Items ({seller.items.length})
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="text-[#B4B6C2] data-[state=active]:text-white data-[state=active]:bg-[#262833]"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="text-[#B4B6C2] data-[state=active]:text-white data-[state=active]:bg-[#262833]"
            >
              Reviews ({reviewStats.totalReviews || seller.stats.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              {seller.items.map((item) => (
                <Card key={item.id} className="bg-[#15161C] border-[#262833] overflow-hidden">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70 border-0"
                    >
                      <Heart className="h-4 w-4 text-white" />
                    </Button>
                  </div>

                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm text-white line-clamp-2 flex-1">{item.title}</h3>
                      <span className="font-bold text-[#FF4D8D] ml-2">£{item.price}</span>
                    </div>

                    <div className="flex gap-1 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs bg-[#262833] text-[#B4B6C2] border-0">
                        Size {item.size}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-[#262833] text-[#B4B6C2]">
                        {item.condition}
                      </Badge>
                    </div>

                    <div className="text-xs text-[#B4B6C2] mb-3">Used for: {item.usedFor}</div>

                    <Button size="sm" className="w-full bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white" asChild>
                      <Link href={`/item/${item.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card className="bg-[#15161C] border-[#262833]">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-white mb-3">About {seller.displayName}</h3>
                <p className="text-[#B4B6C2] leading-relaxed mb-4">{seller.bio}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-xl text-[#FF4D8D]">{seller.stats.itemsSold}</div>
                    <div className="text-sm text-[#B4B6C2]">Items Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl text-[#FF4D8D]">
                      {reviewStats.averageRating || seller.stats.rating}
                    </div>
                    <div className="text-sm text-[#B4B6C2]">Average Rating</div>
                  </div>
                </div>

                <div className="border-t border-[#262833] pt-4">
                  <h4 className="font-medium text-white mb-3">Connect</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">IG</span>
                      </div>
                      <span className="text-sm text-[#B4B6C2]">{seller.socialLinks.instagram}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">X</span>
                      </div>
                      <span className="text-sm text-[#B4B6C2]">{seller.socialLinks.twitter}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {loadingReviews ? (
                <div className="text-center py-8">
                  <div className="text-[#B4B6C2]">Loading reviews...</div>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="bg-[#15161C] border-[#262833]">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={review.reviewerAvatar || "/placeholder.svg"}
                          alt="Reviewer"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">{review.reviewerName}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-[#B4B6C2]"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-[#B4B6C2]">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {review.comment && <p className="text-sm text-[#B4B6C2]">{review.comment}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-[#B4B6C2] mb-2">No reviews yet</div>
                  <div className="text-sm text-[#B4B6C2]">
                    Reviews will appear here after customers purchase and review items from this seller.
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
