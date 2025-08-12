import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Flag, Star, Truck, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock item data
const items = {
  "1": {
    id: "1",
    title: "Cozy Cotton Socks - Worn During Intense Workout Sessions",
    price: 25,
    size: "M",
    condition: "Gently Used",
    usedFor: "Workout Sessions",
    description:
      "These soft cotton socks have been my faithful companions through countless gym sessions and morning runs. They've absorbed the energy of my most intense workouts and carry the essence of dedication and perseverance. Perfect for someone who appreciates the authentic experience of a fitness enthusiast's journey.",
    images: ["/cozy-cotton-socks.png", "/cotton-socks-detail.png", "/sock-texture-closeup.png"],
    tags: ["Cotton", "Workout", "Comfortable", "Athletic"],
    seller: {
      id: "emma-rose",
      name: "Emma Rose",
      displayName: "Emma",
      avatar: "/diverse-woman-avatar.png",
      verified: true,
      rating: 4.9,
      reviewCount: 23,
      responseTime: "Usually responds within 2 hours",
    },
    shipping: {
      cost: 3.99,
      estimatedDays: "2-3",
      carrier: "Royal Mail",
    },
    createdAt: "2024-01-20",
    views: 127,
    likes: 23,
    category: "Socks",
    material: "100% Cotton",
    care: "Machine wash cold, air dry",
  },
}

interface ItemPageProps {
  params: {
    id: string
  }
}

export default function ItemPage({ params }: ItemPageProps) {
  const item = items[params.id as keyof typeof items]

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              <img src={item.images[0] || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              <Button size="sm" variant="secondary" className="absolute top-4 right-4 bg-background/80 backdrop-blur">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-2">
              {item.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${item.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">{item.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">£{item.price}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{item.views} views</span>
                  <span>•</span>
                  <span>{item.likes} likes</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">Size {item.size}</Badge>
              <Badge variant="outline">{item.condition}</Badge>
              <Badge>{item.category}</Badge>
            </div>

            {/* Used For */}
            <div className="bg-accent/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Used For</h3>
              <p className="text-sm text-muted-foreground">{item.usedFor}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Item Details */}
            <div>
              <h3 className="font-medium mb-3">Item Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Material:</span>
                  <span className="ml-2">{item.material}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Care:</span>
                  <span className="ml-2">{item.care}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Listed:</span>
                  <span className="ml-2">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2">{item.category}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex gap-2 flex-wrap">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">Shipping</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    £{item.shipping.cost} via {item.shipping.carrier}
                  </div>
                  <div>Estimated delivery: {item.shipping.estimatedDays} business days</div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full">
                Buy Now - £{item.price}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Seller
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Safety Notice */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 mb-1">Safety First</p>
                    <p className="text-amber-700">
                      All items are thoroughly cleaned and sanitized before shipping. We prioritize your health and
                      safety.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Seller Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={item.seller.avatar || "/placeholder.svg"} alt={item.seller.name} />
                    <AvatarFallback>{item.seller.displayName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-serif text-xl font-bold">{item.seller.displayName}</h3>
                      {item.seller.verified && <Badge className="bg-primary text-primary-foreground">Verified</Badge>}
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{item.seller.rating}</span>
                        <span className="text-muted-foreground">({item.seller.reviewCount} reviews)</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{item.seller.responseTime}</p>

                    <div className="flex gap-2">
                      <Button asChild>
                        <Link href={`/seller/${item.seller.id}`}>View Profile</Link>
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Report this item</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If this item violates our community guidelines, please let us know.
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Flag className="h-4 w-4 mr-2" />
                  Report Item
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
