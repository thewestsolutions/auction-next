"use client";

import { Button } from "@/components/ui/button";
import { BidHistory, Item } from "@/types/supabase";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useBidding } from "@/src/lib/hooks/use-bidding";
import { getNextBidPrice } from "@/src/lib/bidding";
import { useRouter } from "next/navigation";

interface BidPanelProps {
  item: Item;
  history: BidHistory[];
  userId?: string;
}

export default function BidPanel({ item, history, userId }: BidPanelProps) {
  const router = useRouter();
  const [bid, setBid] = useState(item.price_bid);
  const [nextBid, setNextBid] = useState(getNextBidPrice(bid));
  const [bidHistory, setBidHistory] = useState<BidHistory[]>(history);
  const { placeBid } = useBidding({
    onBid: (payload) => {
      console.log(payload);
      setBid(payload.amount);
      setBidHistory(payload.history || []);
    },
    loadHistory: true,
  });

  const handleBid = async () => {
    if (!userId) {
      router.push("/auth/login");
      return;
    }

    await placeBid(item.id, nextBid);

    setBid(nextBid);
    setNextBid(getNextBidPrice(nextBid));
  };

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
            Bid ${nextBid}
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
