import { Item } from "@/types/supabase";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export function useBidding({ onUpdate }: { onUpdate?: (item: Item) => void }) {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel("custom-all-channel", {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on<Item>("broadcast", { event: "item-update" }, (payload) => {
        console.log(payload);
        onUpdate?.(payload.payload as Item);
      })
      .subscribe(console.log);

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, onUpdate]);

  async function placeBid(id: number, price: number) {
    await supabase.from("items").update({ price_bid: price }).eq("id", id);
    await supabase.from("bid_history").insert({
      item_id: id,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      amount: price,
    });

    const channel = supabase.channel("custom-all-channel");
    channel.send({
      type: "broadcast",
      event: "item-update",
      payload: {
        id,
        price_bid: price,
      },
    });
  }

  return { placeBid };
}
