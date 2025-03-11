"use client";

import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't render pagination if only one page exists
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers with ellipsis for large number of pages
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
    <UIPagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
                onClick={() => onPageChange(number)}
                className="cursor-pointer"
              >
                {number}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
}
