import type { PageState } from '@/shared/hooks/use-page-state.ts';
import { useCallback, useEffect, useMemo } from 'react';

type UsePaginatorOptions = {
  totalPages?: number;
  pagination: PageState;
  pageSizeOptions?: number[];
};

export type PaginatorState = {
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalPages: number;
  pageNumbers: number[];
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const clampPage = (page: number, totalPages: number) =>
  Math.min(Math.max(page, 1), Math.max(totalPages, 1));

export function usePaginator({
  totalPages = 0,
  pagination,
  pageSizeOptions = [6, 12, 24],
}: UsePaginatorOptions): PaginatorState {
  const currentPage = clampPage(pagination.page + 1, totalPages);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  const setPage = useCallback(
    (uiPage: number) => pagination.changePage(clampPage(uiPage, totalPages) - 1),
    [pagination, totalPages],
  );

  const nextPage = useCallback(() => setPage(currentPage + 1), [setPage, currentPage]);
  const previousPage = useCallback(() => setPage(currentPage - 1), [setPage, currentPage]);
  const setPageSize = useCallback(
    (nextPageSize: number) => {
      pagination.changePageSize(nextPageSize);
    },
    [pagination],
  );

  useEffect(() => {
    if (totalPages > 0 && pagination.page + 1 > totalPages) {
      pagination.changePage(totalPages - 1);
    }
  }, [pagination, totalPages]);

  return {
    currentPage,
    pageSize: pagination.pageSize,
    pageSizeOptions,
    totalPages,
    pageNumbers,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}