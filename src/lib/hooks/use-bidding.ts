import { useEffect } from "react";
import { createClient } from "@/src/lib/supabase-browser";

export function useBidding({
  onUpdate,
}: {
  onUpdate?: (payload: { id: number; amount: number }) => void;
}) {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel("bid-channel", {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on<{ id: number; amount: number }>("broadcast", { event: "bid-placed" }, (payload) => {
        onUpdate?.(payload.payload);
      })
      .subscribe(console.log);

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, onUpdate]);

  async function placeBid(id: number, amount: number) {
    await supabase.from("items").update({ price_bid: amount }).eq("id", id);
    await supabase.from("bid_history").insert({
      item_id: id,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      amount,
    });

    const channel = supabase.channel("bid-channel");
    channel.send({
      type: "broadcast",
      event: "bid-placed",
      payload: {
        id,
        amount,
      },
    });
  }

  return { placeBid };
}
