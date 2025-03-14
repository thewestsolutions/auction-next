"use client";

import { Button } from "@/components/ui/button";
import { addFavorite, removeFavorite } from "@/lib/db-items";
import { Heart } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
interface FavoriteButtonProps {
  itemId: number;
  isFavorite: boolean;
  userId?: string;
}

export default function FavoriteButton({
  itemId,
  isFavorite: defaultIsFavorite,
  userId,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(defaultIsFavorite);
  const supabase = createClient();

  const handleClick = async () => {
    if (!userId) {
      redirect("/login");
    }

    if (isFavorite) {
      await removeFavorite(supabase, itemId, userId);
      setIsFavorite(false);
    } else {
      await addFavorite(supabase, itemId, userId);
      setIsFavorite(true);
    }
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      <Heart className={cn("h-4 w-4", isFavorite && "text-red-500")} />
      <span>Like</span>
    </Button>
  );
}
