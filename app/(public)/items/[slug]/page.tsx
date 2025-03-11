import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ItemsList from "@/components/lists/items-list";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug);

  if (error || categories?.length < 1) {
    notFound();
  }

  // Get the first category from the array
  const category = categories[0];

  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select("*")
    .eq("category_id", category.id);

  if (itemsError) {
    console.error("Error fetching items:", itemsError);
  }

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">{category.title}</h1>
      <ItemsList items={items ?? []} />
    </div>
  );
}
