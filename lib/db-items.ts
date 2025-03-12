import { SupabaseClient } from "@supabase/supabase-js";
import { ITEMS_PER_PAGE } from "./config";
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
  const { data, error } = await supabase.from("items").select("*").eq("id", id).single();
  return { data, error };
}
