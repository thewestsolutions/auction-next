import ItemsList from "@/components/lists/items-list";
import { createClient } from "@/src/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function OngoingBids() {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: distinctItems, error: distinctItemsError } = await supabase
    .from("bid_history")
    .select("item_id")
    .eq("user_id", user.data.user?.id)
    .then((res) => {
      const uniqueItemIds = new Set(res.data?.map((bid) => bid.item_id));
      return {
        data: Array.from(uniqueItemIds),
        error: res.error,
      };
    });

  if (distinctItemsError) {
    console.error(distinctItemsError);
  }

  const {
    data: items,
    error: itemsError,
    count,
  } = await supabase
    .from("items")
    .select("*", { count: "exact" })
    .in("id", distinctItems)
    .gt("expires_at", new Date().toISOString());

  if (itemsError) {
    console.error(itemsError);
  }

  return (
    <div>
      <ItemsList items={items ?? []} count={count ?? 0} />
    </div>
  );
}
