import { type NextRequest, NextResponse } from "next/server"

// Mock database for reviews (same as in create route)
const mockReviews: any[] = [
  {
    id: "review-1",
    orderId: "order-1",
    sellerId: "sophie-luxe",
    itemId: "2",
    rating: 5,
    comment:
      "Amazing quality and exactly as described! Sophie was so sweet and the packaging was perfect. Will definitely buy again!",
    reviewerId: "demo-user-123",
    reviewerName: "Sarah M.",
    reviewerAvatar: "/diverse-user-avatars.png",
    createdAt: new Date("2024-01-25").toISOString(),
  },
  {
    id: "review-2",
    orderId: "order-4",
    sellerId: "emma-rose",
    itemId: "1",
    rating: 5,
    comment: "Super fast shipping and great communication. The item was even better than expected!",
    reviewerId: "user-456",
    reviewerName: "Jessica L.",
    reviewerAvatar: "/diverse-user-avatar-set-2.png",
    createdAt: new Date("2024-01-18").toISOString(),
  },
  {
    id: "review-3",
    orderId: "order-5",
    sellerId: "emma-rose",
    itemId: "5",
    rating: 4,
    comment: "Great seller, fast shipping. Item was as described.",
    reviewerId: "user-789",
    reviewerName: "Mike R.",
    reviewerAvatar: "/diverse-user-avatar-set-3.png",
    createdAt: new Date("2024-01-20").toISOString(),
  },
]

export async function GET(request: NextRequest, { params }: { params: { sellerId: string } }) {
  try {
    const sellerId = params.sellerId

    // Get reviews for this seller
    const sellerReviews = mockReviews.filter((review) => review.sellerId === sellerId)

    // Calculate average rating
    const averageRating =
      sellerReviews.length > 0
        ? sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length
        : 0

    // Sort by creation date (newest first)
    const sortedReviews = sellerReviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return NextResponse.json({
      reviews: sortedReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: sellerReviews.length,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
