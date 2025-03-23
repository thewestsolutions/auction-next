import { useEffect } from "react";
import { createClient } from "@/src/lib/supabase-browser";
import { BidHistory } from "@/types/supabase";

type BidResponse = {
  id: number;
  amount: number;
  history?: BidHistory[];
};

// Make sure to unsubscribe to all channels or create the core channel

export function useBidding({
  onBid: onUpdate,
  loadHistory = false,
}: {
  onBid?: (payload: BidResponse) => void;
  loadHistory?: boolean;
}) {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel("bid-channel", {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on<{ id: number; amount: number }>("broadcast", { event: "bid-placed" }, async (payload) => {
        const response: BidResponse = {
          id: payload.payload.id,
          amount: payload.payload.amount,
        };

        if (loadHistory) {
          const { data } = await supabase
            .from("bid_history")
            .select("*")
            .order("created_at", { ascending: false })
            .eq("item_id", payload.payload.id);

          response.history = data || [];
        }

        onUpdate?.(response);
      })
      .subscribe(console.log);

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, onUpdate, loadHistory]);

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
