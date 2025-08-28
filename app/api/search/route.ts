import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    const supabase = createClient()

    let queryBuilder = supabase
      .from("items")
      .select(`
        *,
        seller:users!seller_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq("status", "active")

    // Add search filters
    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,tags.cs.{${query}}`,
      )
    }

    if (size !== "all") {
      queryBuilder = queryBuilder.eq("size", size)
    }

    if (condition !== "all") {
      queryBuilder = queryBuilder.eq("condition", condition.replace("-", " "))
    }

    if (usedFor !== "all") {
      queryBuilder = queryBuilder.eq("used_for", usedFor.replace("-", " "))
    }

    // Add sorting
    switch (sortBy) {
      case "price-low":
        queryBuilder = queryBuilder.order("price", { ascending: true })
        break
      case "price-high":
        queryBuilder = queryBuilder.order("price", { ascending: false })
        break
      case "popular":
        queryBuilder = queryBuilder.order("view_count", { ascending: false })
        break
      case "rating":
        queryBuilder = queryBuilder.order("created_at", { ascending: false })
        break
      case "newest":
      default:
        queryBuilder = queryBuilder.order("created_at", { ascending: false })
        break
    }

    const { data: items, error } = await queryBuilder.limit(50)

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }

    const results =
      items?.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        size: item.size,
        condition: item.condition,
        usedFor: item.used_for,
        images: item.images,
        seller: {
          name: item.seller.username || item.seller.full_name,
          avatar: item.seller.avatar_url,
          verified: false,
        },
        category: item.category,
        tags: item.tags,
        createdAt: item.created_at,
      })) || []

    return NextResponse.json({
      results,
      total: results.length,
      query,
      filters: { size, condition, usedFor, sortBy },
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
