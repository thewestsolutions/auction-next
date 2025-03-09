"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useSocket from "@/lib/useSocket";

interface BidButtonProps {
  itemId: string;
  price: number;
  isExpired: boolean;
  onBidPlaced?: (newPrice: number) => void;
}

export function BidButton({ itemId, price, isExpired, onBidPlaced }: BidButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, emit, on, off } = useSocket();

  // Listen for bid updates from other users
  useEffect(() => {
    on<{ itemId: string; newPrice: number }>("bid_update", (data) => {
      if (data.itemId === itemId) {
        // Only notify if it's not our own bid (handled separately)
        if (data.newPrice !== price && onBidPlaced) {
          onBidPlaced(data.newPrice);
        }
      }
    });

    // Clean up event listener on unmount
    return () => {
      off("bid_update");
    };
  }, [itemId, on, off, onBidPlaced, price]);

  const handleBid = async () => {
    if (isExpired || !isConnected) return;

    setIsLoading(true);
    try {
      // Calculate new bid (typically current price + some increment)
      const bidIncrement = price < 100 ? 5 : 10; // Example increment logic
      const newPrice = price + bidIncrement;

      // Emit bid event to server
      emit("place_bid", {
        itemId,
        price: newPrice,
        timestamp: Date.now(),
      });

      // Update local state immediately (optimistic update)
      if (onBidPlaced) {
        onBidPlaced(newPrice);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full bg-amber-500 hover:bg-amber-600"
      disabled={isExpired || isLoading || !isConnected}
      onClick={handleBid}
    >
      {isExpired ? "Auction Ended" : isLoading ? "Processing..." : `Bid $${price.toFixed(2)}`}
    </Button>
  );
}
