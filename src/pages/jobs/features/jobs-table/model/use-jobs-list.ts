import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchClient, $api } from '@/configs/api/client';
import { getJobsListQueryKey } from '@/configs/api/query-keys';
import { useJobsTableStore } from '@/configs/zustand/jobs-table/jobs-table.store';
import { useDebouncedFilters } from '@/pages/jobs/model/use-debounced-filters';
import { mapFiltersToApi } from '@/pages/jobs/model/map-filters-to-api';
import { mapSortToApi } from '@/pages/jobs/model/map-sort-to-api';

export const useJobsList = () => {
  const { debouncedSearch, debouncedFilters } = useDebouncedFilters();
  const sort = useJobsTableStore((state) => state.sort);

  const { data: columns = [] } = $api.useQuery('get', '/api/jobs/columns');

  const apiSort = useMemo(() => mapSortToApi(sort, columns), [sort, columns]);

  const apiFilters = useMemo(
    () => mapFiltersToApi(debouncedFilters),
    [debouncedFilters]
  );

  // Use JSON strings for stable query key comparison
  const sortKey = JSON.stringify(sort);
  const filtersKey = JSON.stringify(debouncedFilters);

  const query = useInfiniteQuery({
    queryKey: getJobsListQueryKey(debouncedSearch, sortKey, filtersKey),
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.POST('/api/jobs/list', {
        body: {
          filters: {
            search: debouncedSearch || undefined,
            is_archived: false,
            column_filters: apiFilters.length > 0 ? apiFilters : undefined,
          },
          sort: apiSort,
          pagination: {
            take: 50,
            cursor: pageParam ?? null,
          },
        },
      });

      if (!data) {
        throw new Error('Failed to fetch jobs');
      }

      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;

      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.cursor
        : undefined;
    },
    initialPageParam: null as string | null,
  });

  const jobs = useMemo(
    () => query.data?.pages.flatMap((page) => page?.data ?? []) ?? [],
    [query.data?.pages]
  );

  return {
    ...query,
    jobs,
    columns,
  };
};
