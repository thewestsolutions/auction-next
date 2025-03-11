"use client";

interface ItemPriceProps {
  price: number;
  retailPrice: number;
}

export default function ItemPrice({ price, retailPrice }: ItemPriceProps) {
  const discountPercentage = (((retailPrice - price) / retailPrice) * 100).toFixed(0);

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
