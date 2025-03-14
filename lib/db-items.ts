import { SupabaseClient } from "@supabase/supabase-js";
import { ITEMS_PER_PAGE } from "./config";
import { Item } from "@/types/supabase";
export async function getItems(
  supabase: SupabaseClient,
  options?: {
    categoryId?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
) {
  const {
    categoryId,
    page = 1,
    size: itemsPerPage = ITEMS_PER_PAGE,
    sortBy = "id",
    sortOrder = "asc",
  } = options || {};

  const query = supabase.from("items").select("*", { count: "exact" });

  if (categoryId) {
    query.eq("category_id", categoryId);
  }

  query
    .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
    .order(sortBy, { ascending: sortOrder === "asc" });

  const { data, error, count } = await query;

  return { data, error, count };
}

export async function getItemById(supabase: SupabaseClient, id: number) {
  const { data, error } = await supabase.from("items").select("*").eq("id", id).single<Item>();
  return { data, error };
}

export async function addFavorite(
  supabase: SupabaseClient,
  itemId: number,
  userId: string
): Promise<boolean> {
  const { data: existingFavorite } = await supabase
    .from("favorite_items")
    .select("*")
    .eq("item_id", itemId)
    .eq("user_id", userId)
    .single();

  if (existingFavorite) {
    return true;
  }

  const { data } = await supabase.from("favorite_items").insert({
    item_id: itemId,
    user_id: userId,
  });

  return !!data;
}

export async function removeFavorite(supabase: SupabaseClient, itemId: number, userId: string) {
  const { data, error } = await supabase
    .from("favorite_items")
    .delete()
    .eq("item_id", itemId)
    .eq("user_id", userId);

  return { data, error };
}

export async function isFavorite(
  supabase: SupabaseClient,
  itemId: number,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("favorite_items")
    .select("*")
    .eq("item_id", itemId)
    .eq("user_id", userId)
    .single();

  return !!data;
}
