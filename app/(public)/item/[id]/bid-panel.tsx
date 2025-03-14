"use client";

import { Button } from "@/components/ui/button";
import { BidHistory, Item } from "@/types/supabase";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { addBid } from "@/lib/db-items";
import { createClient } from "@/lib/supabase-browser";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
interface BidPanelProps {
  item: Item;
  history: BidHistory[];
  userId?: string;
}

export default function BidPanel({ item, history, userId }: BidPanelProps) {
  const supabase = createClient();
  const [bid, setBid] = useState(item.price_bid);
  const [bidHistory, setBidHistory] = useState<BidHistory[]>(history);

  const handleBid = async () => {
    if (!userId) {
      alert("Please login to bid");
      return;
    }

    const { data, error } = await addBid(supabase, item.id, userId, bid + 10);

    if (error) {
      alert("Error adding bid");
      return;
    }

    setBid(data?.price_bid || 0);
  };

  useEffect(() => {
    const channel = supabase.channel("bid_history");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bid_history" },
        (payload) => {
          setBidHistory((prev) => [payload.new as BidHistory, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [history, supabase]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <p className="text-muted-foreground text-sm">Current bid</p>
          <p className="text-3xl font-bold">${bid}</p>
          <p className="text-muted-foreground text-sm">
            Retail price: ${item.price_retail} (
            {(((item.price_retail - bid) / item.price_retail) * 100).toFixed(2)}% off)
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant={"primary"} onClick={handleBid}>
            Bid ${bid + 10}
          </Button>
        </CardFooter>
      </Card>

      <Card className="py-0">
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="cursor-pointer font-bold">Bid history</AccordionTrigger>
              <AccordionContent>
                {bidHistory.length > 0 ? (
                  bidHistory.map((bid) => (
                    <div key={bid.id}>
                      <p>{bid.amount}</p>
                    </div>
                  ))
                ) : (
                  <p>No bids yet</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
