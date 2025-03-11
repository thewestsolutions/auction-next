import ItemsList from "@/components/lists/items-list";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase-server";

export default async function ItemsPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("items").select("*");

  if (error) {
    console.error("Error fetching items:", error);
  }

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Featured Items</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ItemsList items={items ?? []} />
      </div>
    </div>
  );
}
