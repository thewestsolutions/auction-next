"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, MapPin, Tag } from "lucide-react";
import Link from "next/link";

interface ItemCardProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  retailPrice: number;
  discountPercentage: number;
  location: string;
  timeLeft: string;
}

export default function ItemCard({
  id,
  title,
  imageUrl,
  price,
  retailPrice,
  discountPercentage,
  location,
  timeLeft,
}: ItemCardProps) {
  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0">
      <CardHeader className="p-0">
        <Link href={`/items/${id}`}>
          <div className="relative">
            {/* Time left indicator */}
            <div className="absolute top-3 left-3 z-10 rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {timeLeft}
              </span>
            </div>

            {/* Item image */}
            <div className="relative h-64 w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="flex-grow p-4">
        <Link href={`/items/${id}`} className="block">
          <h3 className="mb-1 line-clamp-2 text-lg font-semibold">{title}</h3>
        </Link>

        <div className="mb-3 flex items-center gap-2">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={16} />
            {location}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Tag size={16} />
            Retail ${retailPrice.toFixed(2)} ({discountPercentage}% off)
          </span>
        </div>
      </CardContent>

      <CardFooter className="mt-auto px-4 pt-0 pb-4">
        <Button className="w-full bg-amber-500 hover:bg-amber-600">Bid ${price.toFixed(2)}</Button>
      </CardFooter>
    </Card>
  );
}
