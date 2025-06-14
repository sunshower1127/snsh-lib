"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from ".";

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export default function ClientPagination({ currentPage, totalPages, className }: ClientPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      const newUrl = params.toString() ? `/?${params.toString()}` : "/";
      router.push(newUrl);
    });
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={isPending ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        )}

        {/* 첫 페이지 */}
        {currentPage > 3 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                1
              </PaginationLink>
            </PaginationItem>
            {currentPage > 4 && <PaginationEllipsis />}
          </>
        )}

        {/* 현재 페이지 주변 */}
        {Array.from({ length: 3 }, (_, i) => {
          const page = currentPage - 1 + i;
          if (page < 1 || page > totalPages) return null;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={page === currentPage}
                className={page === currentPage ? "" : "cursor-pointer"}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* 마지막 페이지 */}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={isPending ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
