import { type NextRequest, NextResponse } from "next/server"

// Mock database for reviews
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
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, sellerId, itemId, rating, comment, reviewerId, reviewerName, reviewerAvatar } = body

    // Validate required fields
    if (!orderId || !sellerId || !itemId || !rating || !reviewerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if review already exists for this order
    const existingReview = mockReviews.find((review) => review.orderId === orderId)
    if (existingReview) {
      return NextResponse.json({ error: "Review already exists for this order" }, { status: 409 })
    }

    // Create new review
    const newReview = {
      id: `review-${Date.now()}`,
      orderId,
      sellerId,
      itemId,
      rating,
      comment: comment || "",
      reviewerId,
      reviewerName,
      reviewerAvatar,
      createdAt: new Date().toISOString(),
    }

    mockReviews.push(newReview)

    return NextResponse.json({ success: true, review: newReview })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
