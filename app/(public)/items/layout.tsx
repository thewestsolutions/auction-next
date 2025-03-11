import { getCategories } from "@/lib/db-categories";
import { createClient } from "@/lib/supabase-server";

export default async function ItemsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: categories, error } = await getCategories(supabase);

  if (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="flex gap-12">
      {/* Sidebar */}
      <div className={`bg-background min-h-screen w-64 dark:text-white`}>
        <h2 className="mb-4 flex items-center justify-between text-xl font-bold">
          Staff Picks
          <span className={`text-sm font-normal text-blue-600 dark:text-blue-400`}>View All</span>
        </h2>

        <h3 className="mb-2 text-lg font-medium">Category</h3>
        <ul>
          {categories?.map((category, index) => (
            <li key={index} className="mb-2">
              <a
                href={`/items/${category.slug}`}
                className={`text-muted-foreground hover:text-primary flex items-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <span className="mr-2 w-6">{category.icon}</span>
                <span>{category.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
