import { supabase } from "@/lib/supabase/client"
import { createClient } from "@/lib/supabase/server"

export interface Item {
  id: string
  seller_id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  size?: string
  brand?: string
  color?: string
  material?: string
  images: string[]
  status: "active" | "sold" | "removed"
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ItemWithSeller extends Item {
  seller: {
    id: string
    username: string
    full_name: string
    avatar_url: string
  }
}

// Client-side functions
export async function getFeaturedItems(limit = 6): Promise<ItemWithSeller[]> {
  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      seller:users(id, username, full_name, avatar_url)
    `)
    .eq("status", "active")
    .eq("featured", true)
    .limit(limit)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getItems(offset = 0, limit = 12): Promise<ItemWithSeller[]> {
  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      seller:users(id, username, full_name, avatar_url)
    `)
    .eq("status", "active")
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getItemById(id: string): Promise<ItemWithSeller | null> {
  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      seller:users(id, username, full_name, avatar_url)
    `)
    .eq("id", id)
    .eq("status", "active")
    .single()

  if (error) return null
  return data
}

export async function searchItems(
  query: string,
  filters?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    condition?: string
  },
): Promise<ItemWithSeller[]> {
  let queryBuilder = supabase
    .from("items")
    .select(`
      *,
      seller:users(id, username, full_name, avatar_url)
    `)
    .eq("status", "active")
    .ilike("title", `%${query}%`)

  if (filters?.category) {
    queryBuilder = queryBuilder.eq("category", filters.category)
  }
  if (filters?.minPrice) {
    queryBuilder = queryBuilder.gte("price", filters.minPrice)
  }
  if (filters?.maxPrice) {
    queryBuilder = queryBuilder.lte("price", filters.maxPrice)
  }
  if (filters?.condition) {
    queryBuilder = queryBuilder.eq("condition", filters.condition)
  }

  const { data, error } = await queryBuilder.order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Server-side functions
export async function getItemByIdServer(id: string): Promise<ItemWithSeller | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      seller:users(id, username, full_name, avatar_url)
    `)
    .eq("id", id)
    .eq("status", "active")
    .single()

  if (error) return null
  return data
}
