import ItemsList from "@/components/lists/items-list";
import { getItems } from "@/lib/db-items";
import { createClient } from "@/lib/supabase-server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: items, error: itemsError } = await getItems(supabase, {});

  if (itemsError) {
    console.error("Error fetching items:", itemsError);
  }

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Featured Items</h1>
      <ItemsList items={items ?? []} />
    </div>
  );
}
