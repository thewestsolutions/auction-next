import ItemsList from "@/components/lists/items-list";
import { createClient } from "@/lib/supabase-server";

export default async function ItemsPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching items:", error);
  }

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Featured Items</h1>
      <ItemsList items={items ?? []} />
    </div>
  );
}
