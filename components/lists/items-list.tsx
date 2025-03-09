"use client";

import { useEffect, useState } from "react";
import ItemCard from "../cards/item-card";
import { Item } from "@/lib/db";
import useSocket from "@/lib/useSocket";

interface ItemsListProps {
  items: Item[];
}

export default function ItemsList({ items: defaultItems }: ItemsListProps) {
  const [items, setItems] = useState(defaultItems);
  const { isConnected, emit, on, off } = useSocket();

  const handleBid = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || !isConnected) return;

    // Calculate new bid amount
    const bidIncrement = item.price < 100 ? 5 : 10;
    const newPrice = item.price + bidIncrement;

    // Emit bid event to server
    emit("place_bid", {
      itemId,
      price: newPrice,
      timestamp: Date.now(),
    });

    // Update local state immediately (optimistic update)
    updateItemPrice(itemId, newPrice);
  };

  const updateItemPrice = (itemId: string, newPrice: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? { ...item, price: newPrice } : item))
    );
  };

  useEffect(() => {
    // Listen for bid updates from other users
    on<{ itemId: string; newPrice: number }>("bid_update", (data) => {
      updateItemPrice(data.itemId, data.newPrice);
    });

    return () => {
      // Clean up event listener on unmount
      off("bid_update");
    };
  }, [on, off]);

  useEffect(() => {
    setItems(defaultItems);
  }, [defaultItems]);

  return items.map((item) => (
    <ItemCard
      key={item.id}
      id={item.id}
      title={item.title}
      imageUrl={item.imageUrl}
      price={item.price}
      retailPrice={item.retailPrice}
      discountPercentage={item.discountPercentage}
      location={item.location}
      timeLeft={item.timeLeft}
      onBid={() => handleBid(item.id)}
    />
  ));
}
