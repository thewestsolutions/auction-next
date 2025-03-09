import ItemsList from "@/components/lists/items-list";
import db from "@/lib/db";

export default function ItemsPage() {
  const items = db.getItems();

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Featured Items</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ItemsList items={items} />
      </div>
    </div>
  );
}
