import { getCategories } from "@/lib/db-categories";
import { createClient } from "@/lib/supabase-server";
import CategorySidebarLayout from "@/components/layouts/category-sidebar-layout";

export default async function ItemsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: categories, error } = await getCategories(supabase);

  if (error) {
    console.error("Error fetching categories:", error);
  }

  return <CategorySidebarLayout categories={categories || []}>{children}</CategorySidebarLayout>;
}
