import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search } from "lucide-react"
import Link from "next/link"

// Mock data for demo
const featuredItems = [
  {
    id: "1",
    title: "Cozy Cotton Socks",
    price: 25,
    size: "M",
    condition: "Gently Used",
    usedFor: "Workout Sessions",
    images: ["/cozy-cotton-socks.png"],
    seller: { name: "Emma", avatar: "/diverse-woman-avatar.png", verified: true },
  },
  {
    id: "2",
    title: "Silk Stockings",
    price: 45,
    size: "S",
    condition: "Like New",
    usedFor: "Date Night",
    images: ["/silk-stockings.png"],
    seller: { name: "Sophie", avatar: "/woman-avatar-2.png", verified: false },
  },
  {
    id: "3",
    title: "Athletic Ankle Socks",
    price: 18,
    size: "L",
    condition: "Well Loved",
    usedFor: "Running",
    images: ["/placeholder-niqvm.png"],
    seller: { name: "Maya", avatar: "/woman-avatar-3.png", verified: true },
  },
  {
    id: "4",
    title: "Lace Thigh Highs",
    price: 35,
    size: "M",
    condition: "Gently Used",
    usedFor: "Special Occasions",
    images: ["/lace-thigh-high-socks.png"],
    seller: { name: "Aria", avatar: "/woman-avatar-4.png", verified: true },
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-12 px-4 text-center bg-gradient-to-b from-accent/20 to-background">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-4">Smelly. Personal. Yours.</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The social marketplace where creators share their most intimate items with devoted fans. Discover unique
            pieces with stories only they can tell.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sellers">Meet the Sellers</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup">Join the Community</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search items..." className="pl-10" />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Used For" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workout">Workout</SelectItem>
                  <SelectItem value="date">Date Night</SelectItem>
                  <SelectItem value="casual">Casual Wear</SelectItem>
                  <SelectItem value="special">Special Occasions</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8">Featured Items</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.seller.avatar || "/placeholder.svg"}
                        alt={item.seller.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-medium">{item.seller.name}</span>
                      {item.seller.verified && (
                        <Badge variant="secondary" className="text-xs px-1">
                          ✓
                        </Badge>
                      )}
                    </div>

                    <Button size="sm" asChild>
                      <Link href={`/item/${item.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Items
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
