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
import { createClient } from "@/lib/supabase/client"

interface SellerPageProps {
  params: {
    id: string
  }
}

export default function SellerPage({ params }: SellerPageProps) {
  const { isCreatorFavourited, addCreatorToFavourites, removeCreatorFromFavourites } = useAuth()
  const [seller, setSeller] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 })
  const [loading, setLoading] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)

  useEffect(() => {
    const fetchSellerData = async () => {
      const supabase = createClient()

      try {
        const { data: sellerData, error: sellerError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", params.id)
          .single()

        if (sellerError || !sellerData) {
          notFound()
          return
        }

        setSeller(sellerData)

        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .eq("seller_id", params.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })

        if (!itemsError && itemsData) {
          setItems(itemsData)
        }

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(`
            *,
            profiles:reviewer_id (
              username,
              avatar_url
            )
          `)
          .eq("seller_id", params.id)
          .order("created_at", { ascending: false })

        if (!reviewsError && reviewsData) {
          setReviews(reviewsData)

          // Calculate review stats
          if (reviewsData.length > 0) {
            const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length
            setReviewStats({
              averageRating: Math.round(avgRating * 10) / 10,
              totalReviews: reviewsData.length,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching seller data:", error)
        notFound()
      } finally {
        setLoading(false)
        setLoadingReviews(false)
      }
    }

    fetchSellerData()
  }, [params.id])

  if (loading) {
    return (
      <MobileLayout title="Loading..." subtitle="Fetching seller profile">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#B4B6C2]">Loading seller profile...</div>
        </div>
      </MobileLayout>
    )
  }

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

  return (
    <MobileLayout
      title={seller.username || seller.full_name}
      subtitle={`${reviewStats.averageRating || seller.rating || 0} ⭐ • ${reviewStats.totalReviews} reviews`}
      showBackButton={true}
    >
      {/* Cover & Profile Header */}
      <div className="relative mb-6">
        <div
          className="h-48 bg-cover bg-center rounded-lg overflow-hidden"
          style={{
            backgroundImage: seller.cover_image
              ? `url(${seller.cover_image})`
              : `linear-gradient(135deg, #FF4D8D 0%, #8B5CF6 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="px-4">
          <div className="relative -mt-16">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={seller.avatar_url || "/placeholder.svg"}
                  alt={seller.username}
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
                <h1 className="text-2xl font-bold text-white mb-1">{seller.username || seller.full_name}</h1>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-white">{reviewStats.averageRating || seller.rating || 0}</span>
                    <span className="text-[#B4B6C2]">({reviewStats.totalReviews})</span>
                  </div>
                  {seller.location && (
                    <div className="flex items-center gap-1 text-[#B4B6C2]">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{seller.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {seller.tags && seller.tags.length > 0 && (
        <div className="px-4 mb-4">
          <div className="flex gap-2 flex-wrap">
            {seller.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="bg-[#262833] text-[#B4B6C2] border-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

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
              Items ({items.length})
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
              Reviews ({reviewStats.totalReviews})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="mt-6">
            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="bg-[#15161C] border-[#262833] overflow-hidden">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={item.images?.[0] || "/placeholder.svg"}
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

                      <div className="text-xs text-[#B4B6C2] mb-3">Used for: {item.used_for}</div>

                      <Button size="sm" className="w-full bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white" asChild>
                        <Link href={`/item/${item.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-[#B4B6C2] mb-2">No items available</div>
                <div className="text-sm text-[#B4B6C2]">This seller hasn't listed any items yet.</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card className="bg-[#15161C] border-[#262833]">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-white mb-3">About {seller.username}</h3>
                <p className="text-[#B4B6C2] leading-relaxed mb-4">
                  {seller.bio || "This seller hasn't added a bio yet."}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-xl text-[#FF4D8D]">{seller.items_sold || 0}</div>
                    <div className="text-sm text-[#B4B6C2]">Items Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl text-[#FF4D8D]">
                      {reviewStats.averageRating || seller.rating || 0}
                    </div>
                    <div className="text-sm text-[#B4B6C2]">Average Rating</div>
                  </div>
                </div>

                {seller.social_links && (
                  <div className="border-t border-[#262833] pt-4">
                    <h4 className="font-medium text-white mb-3">Connect</h4>
                    <div className="space-y-2">
                      {seller.social_links.instagram && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">IG</span>
                          </div>
                          <span className="text-sm text-[#B4B6C2]">{seller.social_links.instagram}</span>
                        </div>
                      )}
                      {seller.social_links.twitter && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">X</span>
                          </div>
                          <span className="text-sm text-[#B4B6C2]">{seller.social_links.twitter}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                          src={review.profiles?.avatar_url || "/placeholder.svg"}
                          alt="Reviewer"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">
                              {review.profiles?.username || review.reviewer_name || "Anonymous"}
                            </span>
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
                              {new Date(review.created_at).toLocaleDateString()}
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
