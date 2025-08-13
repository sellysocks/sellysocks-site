import { type NextRequest, NextResponse } from "next/server"

// Mock database of all items
const allItems = [
  {
    id: "1",
    title: "Cozy Cotton Socks",
    price: 25,
    size: "M",
    condition: "Gently Used",
    usedFor: "Workout Sessions",
    images: ["/cozy-cotton-socks.png"],
    seller: { name: "Emma", avatar: "/diverse-woman-avatar.png", verified: true },
    category: "socks",
    tags: ["cotton", "cozy", "workout", "fitness", "comfortable"],
    createdAt: "2024-01-20",
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
    category: "stockings",
    tags: ["silk", "luxury", "date", "elegant", "premium"],
    createdAt: "2024-01-22",
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
    category: "socks",
    tags: ["athletic", "running", "sports", "ankle", "performance"],
    createdAt: "2024-01-18",
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
    category: "thigh-highs",
    tags: ["lace", "thigh-high", "special", "occasions", "elegant"],
    createdAt: "2024-01-16",
  },
  {
    id: "5",
    title: "Athletic Compression Socks",
    price: 30,
    size: "M",
    condition: "Well Loved",
    usedFor: "Marathon Training",
    images: ["/placeholder-31rk0.png"],
    seller: { name: "Emma", avatar: "/diverse-woman-avatar.png", verified: true },
    category: "socks",
    tags: ["compression", "athletic", "marathon", "training", "performance"],
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
    seller: { name: "Emma", avatar: "/diverse-woman-avatar.png", verified: true },
    category: "socks",
    tags: ["yoga", "practice", "hot-yoga", "grip", "wellness"],
    createdAt: "2024-01-15",
  },
  {
    id: "7",
    title: "Designer Lace Thigh Highs",
    price: 65,
    size: "M",
    condition: "Gently Used",
    usedFor: "Evening Events",
    images: ["/placeholder-lace.png"],
    seller: { name: "Sophie", avatar: "/woman-avatar-3.png", verified: true },
    category: "thigh-highs",
    tags: ["designer", "lace", "evening", "luxury", "premium"],
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
    seller: { name: "Sophie", avatar: "/woman-avatar-3.png", verified: true },
    category: "hosiery",
    tags: ["silk", "premium", "hosiery", "date", "luxury"],
    createdAt: "2024-01-18",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const size = searchParams.get("size") || "all"
    const condition = searchParams.get("condition") || "all"
    const usedFor = searchParams.get("usedFor") || "all"
    const sortBy = searchParams.get("sortBy") || "newest"

    if (!query.trim()) {
      return NextResponse.json({ results: [] })
    }

    // Filter items based on search query
    const filteredItems = allItems.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        item.seller.name.toLowerCase().includes(query) ||
        item.usedFor.toLowerCase().includes(query)

      const matchesSize = size === "all" || item.size.toLowerCase() === size.toLowerCase()

      const matchesCondition =
        condition === "all" || item.condition.toLowerCase().replace(" ", "-") === condition.toLowerCase()

      const matchesUsedFor = usedFor === "all" || item.usedFor.toLowerCase().replace(" ", "-") === usedFor.toLowerCase()

      return matchesQuery && matchesSize && matchesCondition && matchesUsedFor
    })

    // Sort results
    switch (sortBy) {
      case "price-low":
        filteredItems.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredItems.sort((a, b) => b.price - a.price)
        break
      case "popular":
        // Mock popularity based on seller verification and price
        filteredItems.sort((a, b) => {
          const aScore = (a.seller.verified ? 1 : 0) + (50 - a.price) / 50
          const bScore = (b.seller.verified ? 1 : 0) + (50 - b.price) / 50
          return bScore - aScore
        })
        break
      case "rating":
        // Mock rating based on seller verification
        filteredItems.sort((a, b) => {
          const aRating = a.seller.verified ? 4.8 : 4.2
          const bRating = b.seller.verified ? 4.8 : 4.2
          return bRating - aRating
        })
        break
      case "newest":
      default:
        filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return NextResponse.json({
      results: filteredItems,
      total: filteredItems.length,
      query,
      filters: { size, condition, usedFor, sortBy },
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
