import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Timer from "@/components/display/timer";

export default function ItemPage({ params }: { params: { id: string } }) {
  const item = db.getItemById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Item Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" priority />
        </div>

        {/* Item Details */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">{item.title}</h1>

          <div className="flex items-end gap-4">
            <div className="text-2xl font-bold">${item.price.toFixed(2)}</div>
            <div className="text-muted-foreground line-through">${item.retailPrice.toFixed(2)}</div>
            <div className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-800">
              {item.discountPercentage}% OFF
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>{item.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Left:</span>
              <span>
                <Timer timeLeft={item.timeLeft} />
              </span>
            </div>
          </div>

          <Separator />

          <Button className="w-full" size="lg">
            Bid
          </Button>
        </div>
      </div>
    </div>
  );
}
