import type { Pageable } from '@/api/api.ts';
import type { PageState } from '@/shared/hooks/use-page-state.ts';
import { useMemo } from 'react';

type QueryParamValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | null
  | undefined;

type QueryFilters = Record<string, QueryParamValue>;

type UseQueryParamsOptions<TFilters extends QueryFilters> = {
  pagination: PageState;
  filters?: TFilters;
  sort?: Pageable['sort'];
};

type QueryParams<TFilters extends QueryFilters> = TFilters & {
  pageable: Pageable;
};

export function useQueryParams<TFilters extends QueryFilters = QueryFilters>({
  pagination,
  filters,
  sort,
}: UseQueryParamsOptions<TFilters>): QueryParams<TFilters> {
  return useMemo(() => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters ?? {}).filter(([, value]) => (
        value !== undefined
        && value !== null
        && value !== ''
      )),
    ) as Partial<TFilters>;

    return {
      ...cleanFilters,
      pageable: {
        page: pagination.page,
        size: pagination.pageSize,
        ...(sort?.length ? { sort } : {}),
      },
    } as QueryParams<TFilters>;
  }, [filters, pagination.page, pagination.pageSize, sort]);
}
