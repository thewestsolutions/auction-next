import { SupabaseClient } from "@supabase/supabase-js";

export async function getItems(
  supabase: SupabaseClient,
  categoryId?: number,
  page: number = 1,
  itemsPerPage: number = 20
) {
  const query = supabase.from("items").select("*", { count: "exact" });

  if (categoryId) {
    query.eq("category_id", categoryId);
  }

  query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1).order("id", { ascending: true });

  const { data, error, count } = await query;

  return { data, error, count };
}

export async function getItemById(supabase: SupabaseClient, id: number) {
  const { data, error } = await supabase.from("items").select("*").eq("id", id).single();
  return { data, error };
}
