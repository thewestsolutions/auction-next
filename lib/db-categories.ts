import { SupabaseClient } from "@supabase/supabase-js";

export async function getCategories(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("categories").select("*");
  return { data, error };
}

export async function getCategoryBySlug(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single();
  return { data, error };
}

export async function getCategoryById(supabase: SupabaseClient, id: number) {
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  return { data, error };
}
