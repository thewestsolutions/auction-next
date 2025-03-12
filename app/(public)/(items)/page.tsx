import ItemsList from "@/components/lists/items-list";
import { getItems } from "@/lib/db-items";
import { createClient } from "@/lib/supabase-server";
import { ITEMS_PER_PAGE } from "@/lib/config";
export default async function HomePage() {
  const supabase = await createClient();
  const { data: items, error, count } = await getItems(supabase, {});

  console.log("Count:", count);

  if (error) {
    console.error("Error fetching items:", error);
  }

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Featured Items</h1>
      <ItemsList items={items ?? []} count={count ?? 0} size={ITEMS_PER_PAGE} />
    </div>
  );
}
