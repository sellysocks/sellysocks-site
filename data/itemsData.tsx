// This file is kept for backward compatibility but now uses real Supabase data
import { createClient } from "@/lib/supabase/client"

// Legacy export for any remaining imports - now returns empty object
// All data should come from Supabase via the updated API routes
export const itemsData = {}

// Helper functions for components that might still reference this file
export const getItemById = async (id: string) => {
  const supabase = createClient()

  const { data: item, error } = await supabase
    .from("items")
    .select(`
      *,
      profiles:seller_id (
        id,
        username,
        avatar_url,
        verified,
        rating
      )
    `)
    .eq("id", id)
    .eq("status", "active")
    .single()

  if (error) {
    console.error("Error fetching item:", error)
    return null
  }

  return {
    ...item,
    seller: {
      id: item.profiles.id,
      name: item.profiles.username,
      avatar: item.profiles.avatar_url,
      verified: item.profiles.verified,
      rating: item.profiles.rating,
      sales: 0,
    },
  }
}

export const getAllItems = async (limit = 20, offset = 0) => {
  const supabase = createClient()

  const { data: items, error } = await supabase
    .from("items")
    .select(`
      *,
      profiles:seller_id (
        id,
        username,
        avatar_url,
        verified,
        rating
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching items:", error)
    return []
  }

  return items.map((item) => ({
    ...item,
    seller: {
      id: item.profiles.id,
      name: item.profiles.username,
      avatar: item.profiles.avatar_url,
      verified: item.profiles.verified,
      rating: item.profiles.rating,
      sales: 0,
    },
  }))
}
