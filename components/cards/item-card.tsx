"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, Tag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Timer from "../display/timer";
import { getNextBidPrice } from "@/lib/bidding";
import { isDateExpired } from "@/lib/date";

interface ItemCardProps {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  retailPrice: number;
  discountPercentage: number;
  timeLeft: string;
  onBid: (price: number) => void;
  isWinning: boolean; // Added property to show if it is winning
}

export default function ItemCard({
  id,
  title,
  imageUrl,
  price,
  retailPrice,
  discountPercentage,
  timeLeft,
  onBid,
  isWinning, // Destructure the new property
}: ItemCardProps) {
  const [isExpired, setIsExpired] = useState(isDateExpired(timeLeft));
  const [nextBid, setNextBid] = useState(getNextBidPrice(price));

  useEffect(() => {
    setNextBid(getNextBidPrice(price));
  }, [price]);

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0 shadow-none">
      <CardHeader className="p-1">
        <Link href={`/item/${id}`}>
          <div className="relative">
            <div className="absolute z-10 flex w-full items-center justify-between gap-1">
              <div
                className={`rounded-md ${isExpired ? "bg-gray-100 text-gray-600" : "border border-red-200 bg-red-100 text-red-600"} px-1 py-0.5 text-xs`}
              >
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  <Timer timeLeft={timeLeft} onExpired={setIsExpired} />
                </span>
              </div>

              {isWinning && ( // Conditional rendering for winning badge
                <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs text-green-600">
                  Is Winning
                </span>
              )}
            </div>

            <div className="relative h-64 w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="rounded-md object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="flex-grow px-2 py-2">
        <Link href={`/item/${id}`} className="block">
          <h3 className="mb-1 line-clamp-2 text-sm">{title}</h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Tag size={16} />
            Retail ${retailPrice.toFixed(2)} ({discountPercentage}% off)
          </span>
        </div>
      </CardContent>

      <CardFooter className="mt-auto px-2 pt-0 pb-4">
        <Button
          className="w-full cursor-pointer bg-amber-300 text-amber-900 hover:bg-amber-400"
          onClick={() => onBid(nextBid)}
          disabled={isExpired || isWinning}
        >
          {`Bid $${nextBid}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
