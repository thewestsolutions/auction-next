"use client";

import { useEffect, useState } from "react";
import ItemCard from "../cards/item-card";
import { Item } from "@/types/supabase";
import { createClient } from "@/lib/supabase-browser";
import Pagination from "@/components/display/pagination";
import { getItems } from "@/lib/db-items";
import { useSearchParams } from "next/navigation";

interface ItemsListProps {
  items: Item[];
  categoryId?: number;
}

export default function ItemsList({ items: defaultItems, categoryId }: ItemsListProps) {
  const searchParams = useSearchParams();

  // Get initial page from URL or default to 1
  const initialPage = Number(searchParams.get("page")) || 1;

  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 8;
  const supabase = createClient();

  const fetchItems = async (page: number) => {
    setLoading(true);
    try {
      // Calculate range for pagination
      const { data, count, error } = await getItems(supabase, {
        categoryId,
        page,
        itemsPerPage,
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
    } finally {
      setLoading(false);
    }
  };

  const handleBid = async (item: Item) => {
    const amount = item.price_bid + 5;

    await supabase.from("items").update({ price_bid: amount }).eq("id", item.id);

    await supabase.from("bid_history").insert({
      item_id: item.id,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      amount: amount,
    });
  };

  useEffect(() => {
    // Initialize with items for the current page from URL
    fetchItems(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Set initial items from props (for SSR)
    if (defaultItems.length > 0 && items.length === 0) {
      setItems(defaultItems);
      setTotalCount(defaultItems.length > itemsPerPage ? defaultItems.length : itemsPerPage * 2); // Estimate if we don't know exact count
    }
  }, [defaultItems, items.length]);

  useEffect(() => {
    const channel = supabase
      .channel("items")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "items" }, (payload) => {
        const updatedItem = payload.new as Item;
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full py-8 text-center">Loading items...</div>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.image_cover}
              price={item.price_bid}
              retailPrice={item.price_retail}
              discountPercentage={0}
              timeLeft={item.expires_at}
              onBid={() => handleBid(item)}
            />
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalCount}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        className="mt-8"
      />
    </div>
  );
}
