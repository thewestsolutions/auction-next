import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ItemsList from "@/components/lists/items-list";
import { getItems } from "@/lib/db-items";
import { getCategoryBySlug } from "@/lib/db-categories";
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category, error } = await getCategoryBySlug(supabase, slug);

  if (error || !category) {
    notFound();
  }

  const { data: items, error: itemsError } = await getItems(supabase, category.id);

  if (itemsError) {
    console.error("Error fetching items:", itemsError);
  }

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">{category.title}</h1>
      <ItemsList items={items ?? []} categoryId={category.id} />
    </div>
  );
}
