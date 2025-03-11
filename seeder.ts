import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

function categoryFactory(existingTitles: Set<string> = new Set()): {
  icon: string;
  title: string;
  slug: string;
} {
  let title = faker.commerce.department();
  let attempts = 0;

  // Ensure title is unique
  while (existingTitles.has(title.toLowerCase()) && attempts < 20) {
    title = `${faker.commerce.department()} ${faker.commerce.productAdjective()}`;
    attempts++;
  }

  existingTitles.add(title.toLowerCase());
  const slug = title.toLowerCase().replace(/ /g, "-");

  return {
    icon: faker.internet.emoji(),
    title,
    slug,
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
  // Clean database before seeding
  console.log("Cleaning database...");
  await supabase.from("items").delete().neq("id", 0);
  await supabase.from("categories").delete().neq("id", 0);
  console.log("Database cleaned successfully");

  const existingTitles = new Set<string>();
  const categories = Array.from({ length: 10 }, () => categoryFactory(existingTitles));

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
