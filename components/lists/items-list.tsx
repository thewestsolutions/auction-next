"use client";

import { useEffect, useState } from "react";
import ItemCard from "../cards/item-card";
import { Item } from "@/types/supabase";
import { createClient } from "@/lib/supabase-browser";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ItemsListProps {
  items: Item[];
}

export default function ItemsList({ items: defaultItems }: ItemsListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 8;
  const supabase = createClient();

  const fetchItems = async (page: number) => {
    setLoading(true);
    try {
      // Calculate range for pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Fetch items with pagination
      const { data, count, error } = await supabase
        .from("items")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("id", { ascending: true });

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
    await supabase
      .from("items")
      .update({ price_bid: item.price_bid + 5 })
      .eq("id", item.id);
  };

  useEffect(() => {
    // Initialize with first page of items
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

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate limited page numbers for pagination
  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show before and after current page
    const pages = [];

    // Always include first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add pages in the calculated range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis
    }

    // Always include last page if it exists
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
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

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {getPageNumbers().map((number, index) => (
              <PaginationItem key={index}>
                {number < 0 ? (
                  <span className="mx-1 flex h-9 w-9 items-center justify-center text-sm">...</span>
                ) : (
                  <PaginationLink
                    isActive={currentPage === number}
                    onClick={() => handlePageChange(number)}
                    className="cursor-pointer"
                  >
                    {number}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
