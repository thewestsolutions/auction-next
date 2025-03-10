"use client";

import useSocket from "@/lib/useSocket";
import { useState, useEffect } from "react";
import { useBid } from "@/lib/useBid";
interface ItemPriceProps {
  price: number;
  retailPrice: number;
  discountPercentage: number;
  id: string;
}

export default function ItemPrice({
  price: defaultPrice,
  retailPrice,
  discountPercentage,
  id,
}: ItemPriceProps) {
  const [price, setPrice] = useState(defaultPrice);
  const { onBidUpdate } = useBid();

  useEffect(() => {
    onBidUpdate(id, (price) => {
      setPrice(price);
    });
  }, [id, onBidUpdate]);

  return (
    <div className="flex items-end gap-4">
      <div className="text-2xl font-bold">${price.toFixed(2)}</div>
      <div className="text-muted-foreground line-through">${retailPrice.toFixed(2)}</div>
      <div className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-800">
        {discountPercentage}% OFF
      </div>
    </div>
  );
}
