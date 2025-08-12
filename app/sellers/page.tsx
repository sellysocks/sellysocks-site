import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Heart } from "lucide-react"
import Link from "next/link"

// Mock sellers data
const sellers = [
  {
    id: "emma-rose",
    name: "Emma Rose",
    displayName: "Emma",
    avatar: "/diverse-woman-avatar.png",
    bio: "Fitness enthusiast sharing my workout essentials. Every item has been part of my daily routine.",
    verified: true,
    stats: {
      itemsSold: 47,
      rating: 4.9,
      reviewCount: 23,
      joinedDate: "2024-01-15",
    },
    tags: ["Fitness", "Cotton", "Athletic"],
    itemCount: 12,
  },
  {
    id: "sophie-luxe",
    name: "Sophie Luxe",
    displayName: "Sophie",
    avatar: "/woman-avatar-2.png",
    bio: "Luxury lingerie collector. I curate the finest pieces and share them with those who appreciate quality.",
    verified: false,
    stats: {
      itemsSold: 23,
      rating: 4.7,
      reviewCount: 15,
      joinedDate: "2024-02-20",
    },
    tags: ["Luxury", "Silk", "Lingerie"],
    itemCount: 8,
  },
  {
    id: "maya-active",
    name: "Maya Active",
    displayName: "Maya",
    avatar: "/woman-avatar-3.png",
    bio: "Marathon runner and yoga instructor. My items have supported me through countless miles and poses.",
    verified: true,
    stats: {
      itemsSold: 89,
      rating: 5.0,
      reviewCount: 41,
      joinedDate: "2023-11-10",
    },
    tags: ["Running", "Yoga", "Performance"],
    itemCount: 18,
  },
  {
    id: "aria-elegant",
    name: "Aria Elegant",
    displayName: "Aria",
    avatar: "/woman-avatar-4.png",
    bio: "Fashion model sharing pieces from photoshoots and special events. Each item tells a story.",
    verified: true,
    stats: {
      itemsSold: 156,
      rating: 4.8,
      reviewCount: 78,
      joinedDate: "2023-08-05",
    },
    tags: ["Fashion", "Designer", "Events"],
    itemCount: 25,
  },
  {
    id: "luna-cozy",
    name: "Luna Cozy",
    displayName: "Luna",
    avatar: "/curly-haired-woman.png",
    bio: "Homebody who loves soft, comfortable pieces. Perfect for those who appreciate the cozy life.",
    verified: false,
    stats: {
      itemsSold: 34,
      rating: 4.6,
      reviewCount: 19,
      joinedDate: "2024-03-12",
    },
    tags: ["Cozy", "Soft", "Comfort"],
    itemCount: 9,
  },
  {
    id: "zara-bold",
    name: "Zara Bold",
    displayName: "Zara",
    avatar: "/confident-short-hair-woman.png",
    bio: "Bold and adventurous. My collection reflects my daring lifestyle and love for unique experiences.",
    verified: true,
    stats: {
      itemsSold: 67,
      rating: 4.9,
      reviewCount: 32,
      joinedDate: "2023-12-18",
    },
    tags: ["Bold", "Unique", "Adventure"],
    itemCount: 14,
  },
]

export default function SellersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 px-4 text-center bg-gradient-to-b from-accent/20 to-background">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Meet the Sellers</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the amazing creators behind each unique item. Every seller has their own story, style, and special
            collection waiting for you.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-6 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search sellers..." className="pl-10" />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Verified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sellers</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="sales">Most Sales</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="items">Most Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Sellers Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sellers.map((seller) => (
              <Card key={seller.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-6">
                  {/* Avatar & Basic Info */}
                  <div className="text-center mb-4">
                    <div className="relative inline-block mb-3">
                      <img
                        src={seller.avatar || "/placeholder.svg"}
                        alt={seller.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover"
                      />
                      {seller.verified && (
                        <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground px-1 text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-1">{seller.displayName}</h3>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{seller.stats.rating}</span>
                      <span className="text-sm text-muted-foreground">({seller.stats.reviewCount})</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3">{seller.bio}</p>

                  {/* Tags */}
                  <div className="flex gap-1 mb-4 flex-wrap justify-center">
                    {seller.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <div className="font-bold text-lg">{seller.stats.itemsSold}</div>
                      <div className="text-xs text-muted-foreground">Items Sold</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{seller.itemCount}</div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/seller/${seller.id}`}>View Profile</Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Sellers
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
