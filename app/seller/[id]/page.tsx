import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, MessageCircle, MapPin, Calendar, Award } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Cover & Profile Header */}
      <section className="relative">
        <div className="h-48 md:h-64 bg-cover bg-center" style={{ backgroundImage: `url(${seller.coverImage})` }}>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={seller.avatar || "/placeholder.svg"}
                  alt={seller.name}
                  className="w-32 h-32 rounded-full border-4 border-background object-cover"
                />
                {seller.verified && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{seller.displayName}</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{seller.stats.rating}</span>
                    <span className="text-muted-foreground">({seller.stats.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{seller.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(seller.stats.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-4 flex-wrap justify-center md:justify-start">
                  {seller.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="items">Items ({seller.items.length})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({seller.stats.reviewCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {seller.items.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                        <span className="font-bold text-primary">£{item.price}</span>
                      </div>

                      <div className="flex gap-1 mb-3 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          Size {item.size}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.condition}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground mb-3">Used for: {item.usedFor}</div>

                      <Button size="sm" className="w-full" asChild>
                        <Link href={`/item/${item.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-bold mb-4">About {seller.displayName}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">{seller.bio}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="font-bold text-2xl text-primary">{seller.stats.itemsSold}</div>
                          <div className="text-sm text-muted-foreground">Items Sold</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-2xl text-primary">{seller.stats.rating}</div>
                          <div className="text-sm text-muted-foreground">Average Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-2xl text-primary">{seller.stats.reviewCount}</div>
                          <div className="text-sm text-muted-foreground">Reviews</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-2xl text-primary">£{seller.stats.totalEarnings}</div>
                          <div className="text-sm text-muted-foreground">Total Sales</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-lg font-bold mb-4">Connect</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">IG</span>
                          </div>
                          <span className="text-sm">{seller.socialLinks.instagram}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">X</span>
                          </div>
                          <span className="text-sm">{seller.socialLinks.twitter}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {/* Mock reviews */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img src="/diverse-user-avatars.png" alt="Reviewer" className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Sarah M.</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Amazing quality and exactly as described! Emma was so sweet and the packaging was perfect.
                          Will definitely buy again!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img src="/diverse-user-avatar-set-2.png" alt="Reviewer" className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Jessica L.</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">1 week ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
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
      </section>
    </div>
  )
}
