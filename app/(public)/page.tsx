import CategorySidebarLayout from "@/components/layouts/category-sidebar-layout";
import ItemsList from "@/components/lists/items-list";
import { getCategories } from "@/lib/db-categories";
import { getItems } from "@/lib/db-items";
import { createClient } from "@/lib/supabase-server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: categories, error } = await getCategories(supabase);
  const { data: items, error: itemsError } = await getItems(supabase, {});

  if (error) {
    console.error("Error fetching categories:", error);
  }

  if (itemsError) {
    console.error("Error fetching items:", itemsError);
  }

  return (
    <CategorySidebarLayout categories={categories || []}>
      <div className="container">
        <h1 className="mb-6 text-3xl font-bold">Featured Items</h1>
        <ItemsList items={items ?? []} />
      </div>
    </CategorySidebarLayout>
  );
}
