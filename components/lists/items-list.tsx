"use client";

import { useEffect, useState } from "react";
import ItemCard from "../cards/item-card";
import { Item } from "@/types/supabase";
import { createClient } from "@/lib/supabase-browser";

interface ItemsListProps {
  items: Item[];
}

export default function ItemsList({ items: defaultItems }: ItemsListProps) {
  const [items, setItems] = useState(defaultItems);
  const supabase = createClient();

  const handleBid = async (item: Item) => {
    await supabase
      .from("items")
      .update({ price_bid: item.price_bid + 5 })
      .eq("id", item.id);
  };

  useEffect(() => {
    setItems(defaultItems);
  }, [defaultItems]);

  useEffect(() => {
    const channel = supabase
      .channel("items")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "items" }, (payload) => {
        const updatedItem = payload.new as Item;
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return items.map((item) => (
    <ItemCard
      key={item.id}
      id={item.id}
      title={item.title}
      imageUrl={item.image_cover}
      price={item.price_bid}
      retailPrice={item.price_retail}
      discountPercentage={0}
      timeLeft={item.expires_at}
      onBid={() => handleBid(item)}
    />
  ));
}
