import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/lib/db-categories";
import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function ItemsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: categories, error } = await getCategories(supabase);

  if (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="flex gap-12">
      {/* Sidebar */}
      <div className={`sticky top-0 min-h-screen w-64 dark:text-white`}>
        <Card>
          <CardHeader>
            <CardTitle>Category</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <ul>
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/items/${category.slug}`}
                    className={`text-muted-foreground hover:text-primary flex items-center rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <span className="mr-2 w-6">{category.icon}</span>
                    <span>{category.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
