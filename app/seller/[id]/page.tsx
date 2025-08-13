import { MobileLayout } from "@/components/mobile/mobile-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, MessageCircle, MapPin, Award } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

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
}

interface SellerPageProps {
  params: {
    id: string
  }
}

export default function SellerPage({ params }: SellerPageProps) {
  const seller = sellers[params.id as keyof typeof sellers]

  if (!seller) {
    notFound()
  }

  const messageThreadId = `thread-${seller.id.replace("-", "")}`

  return (
    <MobileLayout
      title={seller.displayName}
      subtitle={`${seller.stats.rating} ⭐ • ${seller.stats.reviewCount} reviews`}
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
                    <span className="font-medium text-white">{seller.stats.rating}</span>
                    <span className="text-[#B4B6C2]">({seller.stats.reviewCount})</span>
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
          <Button variant="outline" className="border-[#262833] text-[#B4B6C2] hover:bg-[#262833] bg-transparent">
            <Heart className="h-4 w-4" />
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
              Reviews ({seller.stats.reviewCount})
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
                    <div className="font-bold text-xl text-[#FF4D8D]">{seller.stats.rating}</div>
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
              <Card className="bg-[#15161C] border-[#262833]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img src="/diverse-user-avatars.png" alt="Reviewer" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">Sarah M.</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-[#B4B6C2]">2 days ago</span>
                      </div>
                      <p className="text-sm text-[#B4B6C2]">
                        Amazing quality and exactly as described! Emma was so sweet and the packaging was perfect. Will
                        definitely buy again!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#15161C] border-[#262833]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img src="/diverse-user-avatar-set-2.png" alt="Reviewer" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">Jessica L.</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-[#B4B6C2]">1 week ago</span>
                      </div>
                      <p className="text-sm text-[#B4B6C2]">
                        Super fast shipping and great communication. The item was even better than expected!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
