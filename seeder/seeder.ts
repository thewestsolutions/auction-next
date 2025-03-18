import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import categories from "./categories.json";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

async function seedCategories() {
  // Clean database before seeding
  console.log("Cleaning database...");

  // Delete items
  const { error: deleteItemsError } = await supabase.from("items").delete().neq("id", 0);

  if (deleteItemsError) {
    console.error("Error deleting items:", deleteItemsError);
    return;
  }

  // Then delete categories
  const { error: deleteError } = await supabase.from("categories").delete().neq("id", 0);

  if (deleteError) {
    console.error("Error deleting categories:", deleteError);
    return;
  }

  console.log("Database cleaned successfully");

  for (const category of categories) {
    const { error, data: categoryData } = await supabase
      .from("categories")
      .insert({
        title: category.title,
        slug: category.slug,
        icon: category.icon,
      })
      .select()
      .single();

    if (error) {
      console.error("Error seeding categories:", error);
    }

    if (category.items) {
      for (const item of category.items) {
        const { error: itemError } = await supabase.from("items").insert({
          title: item.title,
          category_id: categoryData?.id,
          expires_at: new Date(Date.now() + item.expires_at * 1000 * 60).toISOString(),
          price_retail: item.price_retail,
          price_bid: item.price_bid,
          images: item.images,
          condition: item.condition,
        });

        if (itemError) {
          console.error("Error seeding items:", itemError);
        }
      }
    }
  }

  console.log("Categories seeded successfully");
}

await seedCategories();

process.exit(0);
