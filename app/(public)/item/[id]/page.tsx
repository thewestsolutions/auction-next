import { notFound } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Timer from "@/components/display/timer";
import ItemPrice from "./item-price";
import { createClient } from "@/lib/supabase-server";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemPage({ params }: ItemPageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: items, error } = await supabase.from("items").select("*").eq("id", id);

  if (error || items.length < 1) {
    notFound();
  }

  const item = items[0];

  console.log(item);

  return (
    <div className="container">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Item Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image src={item.image_cover} alt={item.title} fill className="object-cover" priority />
        </div>

        {/* Item Details */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">{item.title}</h1>

          <ItemPrice price={item.price_bid} retailPrice={item.price_retail} />

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>{item.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Left:</span>
              <span>
                <Timer timeLeft={item.expires_at} />
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
