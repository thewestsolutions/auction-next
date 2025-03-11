"use client";

import { useEffect, useState } from "react";
import ItemCard from "../cards/item-card";
import useSocket from "@/lib/useSocket";
import { Item } from "@/types/supabase";

interface ItemsListProps {
  items: Item[];
}

export default function ItemsList({ items: defaultItems }: ItemsListProps) {
  const [items, setItems] = useState(defaultItems);
  const { isConnected, on, off } = useSocket();

  const handleBid = (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || !isConnected) return;

    // Calculate new bid amount
    const bidIncrement = item.price_bid < 100 ? 5 : 10;
    const newPrice = item.price_bid + bidIncrement;
  };

  const updateItemPrice = (itemId: string, newPrice: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? { ...item, price: newPrice } : item))
    );
  };

  useEffect(() => {
    // Listen for bid updates from other users
    on<{ itemId: string; newPrice: number }>("bid.update", (data) => {
      updateItemPrice(data.itemId, data.newPrice);
    });

    return () => {
      // Clean up event listener on unmount
      off("bid.update");
    };
  }, [on, off, isConnected]);

  useEffect(() => {
    setItems(defaultItems);
  }, [defaultItems]);

  return items.map((item) => (
    <ItemCard
      key={item.id}
      id={item.id}
      title={item.title}
      imageUrl={item.image_cover}
      price={item.price_bid}
      retailPrice={item.price_retail}
      discountPercentage={0}
      location={""}
      timeLeft={item.expires_at}
      onBid={() => handleBid(item.id)}
    />
  ));
}
