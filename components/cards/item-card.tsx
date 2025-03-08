"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, MapPin, Tag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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
  // Parse the time string (e.g., "5h 30m" or "2d 12h")
  const parseTimeString = (timeStr: string) => {
    const parts = timeStr.split(" ");
    let totalSeconds = 0;

    parts.forEach((part) => {
      const value = parseInt(part);
      const unit = part.replace(/[0-9]/g, "");

      if (unit === "d") totalSeconds += value * 86400;
      else if (unit === "h") totalSeconds += value * 3600;
      else if (unit === "m") totalSeconds += value * 60;
      else if (unit === "s") totalSeconds += value;
    });

    return totalSeconds;
  };

  // Convert seconds to formatted time string with max 2 units
  const formatTimeString = (seconds: number) => {
    if (seconds <= 0) return "Expired";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let result = "";
    let unitCount = 0;

    if (days > 0 && unitCount < 2) {
      result += `${days}d `;
      unitCount++;
    }

    if (hours > 0 && unitCount < 2) {
      result += `${hours}h `;
      unitCount++;
    }

    if (minutes > 0 && unitCount < 2) {
      result += `${minutes}m `;
      unitCount++;
    }

    if (secs > 0 && unitCount < 2) {
      result += `${secs}s`;
      unitCount++;
    }

    return result.trim();
  };

  // Initial parsing
  const initialSeconds = parseTimeString(timeLeft);
  const initialTimeDisplay = initialSeconds <= 0 ? "Expired" : formatTimeString(initialSeconds);

  const [remainingTime, setRemainingTime] = useState(initialTimeDisplay);
  const [isExpired, setIsExpired] = useState(initialSeconds <= 0);

  useEffect(() => {
    // Set the initial time display immediately
    if (initialSeconds <= 0) {
      setIsExpired(true);
      setRemainingTime("Expired");
    } else {
      setRemainingTime(formatTimeString(initialSeconds));
    }

    let secondsLeft = initialSeconds;

    // Update the timer every second
    const timer = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        clearInterval(timer);
        setIsExpired(true);
        setRemainingTime("Expired");
      } else {
        setRemainingTime(formatTimeString(secondsLeft));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [initialSeconds, timeLeft]);

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0">
      <CardHeader className="p-0">
        <Link href={`/items/${id}`}>
          <div className="relative">
            {/* Time left indicator */}
            <div
              className={`absolute top-3 left-3 z-10 rounded-full ${isExpired ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-600"} px-3 py-1 text-sm`}
            >
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {remainingTime}
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
        <Button className="w-full bg-amber-500 hover:bg-amber-600" disabled={isExpired}>
          {isExpired ? "Auction Ended" : `Bid $${price.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
