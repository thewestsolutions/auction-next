"use client";

import { useEffect, useState } from "react";
import ItemCard from "../cards/item-card";
import { Item } from "@/types/supabase";
import { createClient } from "@/lib/supabase-browser";
import Pagination from "@/components/display/pagination";
import { getItems } from "@/lib/db-items";
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/lib/config";
import { useBidding } from "@/lib/hooks/use-bidding";

interface ItemsListProps {
  items: Item[];
  categoryId?: number;
  count: number;
  size?: number;
}

export default function ItemsList({
  items: defaultItems,
  categoryId,
  count: defaultCount,
  size = ITEMS_PER_PAGE,
}: ItemsListProps) {
  const searchParams = useSearchParams();

  // Get initial page from URL or default to 1
  const [items, setItems] = useState<Item[]>(defaultItems);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalCount, setTotalCount] = useState(defaultCount);
  const supabase = createClient();

  const { placeBid } = useBidding({
    onBid: (item) => {
      setItems((prevItems) =>
        prevItems.map((i) => (i.id === item.id ? { ...i, price_bid: item.amount } : i))
      );
    },
  });

  const fetchItems = async (page: number) => {
    try {
      // Calculate range for pagination
      const { data, count, error } = await getItems(supabase, {
        categoryId,
        page,
        size,
      });

      if (error) {
        console.error("Error fetching items:", error);
        return;
      }

      setItems(data || []);
      if (count !== null) {
        setTotalCount(count);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Update URL when page changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (currentPage === 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", currentPage.toString());
    }

    // Replace state instead of pushing to avoid creating extra history entries
    window.history.replaceState({}, "", url.toString());
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    fetchItems(page);
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.images?.[0]}
            price={item.price_bid}
            retailPrice={item.price_retail}
            discountPercentage={0}
            timeLeft={item.expires_at}
            onBid={async (price) => await placeBid(item.id, price)}
            isWinning={false}
          />
        ))}
      </div>

      {totalCount > size && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={size}
          onPageChange={handlePageChange}
          className="mt-8"
        />
      )}
    </div>
  );
}
