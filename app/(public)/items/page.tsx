import ItemsList from "@/components/lists/items-list";
import { getItems } from "@/src/lib/db-items";
import { createClient } from "@/src/lib/supabase-server";

export default async function ItemsPage() {
  const supabase = await createClient();

  const { data: items, error, count } = await getItems(supabase);

  if (error) {
    console.error("Error fetching items:", error);
  }

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Featured Items</h1>
      <ItemsList items={items ?? []} count={count ?? 0} />
    </div>
  );
}
