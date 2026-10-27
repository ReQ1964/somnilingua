import type { PaginatorState } from '@/shared/hooks/use-paginator.ts';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select.tsx';
import { cn } from '@/shared/lib/utils.ts';
import type { MouseEvent } from 'react';

export default function Paginator({
  currentPage,
  totalPages,
  pageNumbers,
  pageSize,
  pageSizeOptions,
  hasNextPage,
  hasPreviousPage,
  setPage,
  setPageSize,
  nextPage,
  previousPage,
}: PaginatorState) {
  if (totalPages === 0) return null;

  const handlePageChange =
    (changePage: () => void) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      changePage();
    };

  return (
    <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      {totalPages > 1 ? (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={!hasPreviousPage}
                tabIndex={hasPreviousPage ? undefined : -1}
                className={cn(!hasPreviousPage && 'pointer-events-none opacity-50')}
                onClick={handlePageChange(previousPage)}
              />
            </PaginationItem>

            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={handlePageChange(() => setPage(page))}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={!hasNextPage}
                tabIndex={hasNextPage ? undefined : -1}
                className={cn(!hasNextPage && 'pointer-events-none opacity-50')}
                onClick={handlePageChange(nextPage)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : (
        <div />
      )}

      <Select
        value={String(pageSize)}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger className="w-[120px]" aria-label="Page size">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
