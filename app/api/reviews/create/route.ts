import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, sellerId, itemId, rating, comment, reviewerId, reviewerName, reviewerAvatar } = body

    // Validate required fields
    if (!orderId || !sellerId || !itemId || !rating || !reviewerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if review already exists for this order
    const { data: existingReview } = await supabase.from("reviews").select("id").eq("order_id", orderId).single()

    if (existingReview) {
      return NextResponse.json({ error: "Review already exists for this order" }, { status: 409 })
    }

    // Create new review
    const { data: newReview, error } = await supabase
      .from("reviews")
      .insert({
        order_id: orderId,
        seller_id: sellerId,
        item_id: itemId,
        reviewer_id: reviewerId,
        rating,
        comment: comment || "",
        reviewer_name: reviewerName,
        reviewer_avatar: reviewerAvatar,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }

    return NextResponse.json({ success: true, review: newReview })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
