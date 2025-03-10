import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Timer from "@/components/display/timer";
import ItemPrice from "./item-price";

export default function ItemPage({ params }: { params: { id: string } }) {
  const item = db.getItemById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Item Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" priority />
        </div>

        {/* Item Details */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">{item.title}</h1>

          <ItemPrice
            price={item.price}
            retailPrice={item.retailPrice}
            discountPercentage={item.discountPercentage}
            id={item.id}
          />

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
