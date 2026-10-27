import { useCallback, useMemo, useState } from 'react';

type UsePageStateOptions = {
  initialPage?: number;
  initialPageSize?: number;
};

export type PageState = {
  page: number;
  pageSize: number;
  changePage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
};

export function usePageState({
  initialPage = 0,
  initialPageSize = 6,
}: UsePageStateOptions = {}): PageState {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const changePage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const changePageSize = useCallback((nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(0);
  }, []);

  return useMemo(
    () => ({
      page,
      pageSize,
      changePage,
      changePageSize,
    }),
    [changePage, changePageSize, page, pageSize],
  );
}
