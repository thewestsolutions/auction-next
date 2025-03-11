import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

function categoryFactory() {
  const title = faker.commerce.department();

  return {
    icon: faker.internet.emoji(),
    title,
    slug: title.toLowerCase().replace(/ /g, "-"),
  };
}

function itemFactory(categoryId: number) {
  return {
    title: faker.commerce.productName(),
    price_retail: parseFloat(faker.commerce.price()),
    price_bid: parseFloat(faker.commerce.price()),
    category_id: categoryId,
    image_cover: faker.image.url(),
    expires_at: faker.date.future().toISOString(),
  };
}

async function seedCategories() {
  await supabase.from("categories").delete().neq("id", 0);

  const categories = Array.from({ length: 10 }, categoryFactory);

  const { error } = await supabase.from("categories").insert(categories);

  const dbCategories = await supabase.from("categories").select("*");

  for (const category of dbCategories.data ?? []) {
    const items = Array.from({ length: 10 }, () => itemFactory(category.id));

    const { error } = await supabase.from("items").insert(items);

    if (error) {
      console.error("Error seeding items:", error);
    }

    console.log(`Seeded ${items.length} items for category ${category.title}`);
  }

  if (error) {
    console.error("Error seeding categories:", error);
  }

  console.log("Categories seeded successfully:");
}

await seedCategories();

process.exit(0);
