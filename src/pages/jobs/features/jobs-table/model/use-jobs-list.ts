import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchClient } from '@/configs/api/client';
import { getJobsQueryKey } from '@/configs/api/query-keys';
import type { JobFilters } from '@/pages/jobs/registry/jobs.types';

export const useJobsList = (filters: JobFilters = {}) => {
  const query = useInfiniteQuery({
    queryKey: getJobsQueryKey(filters),
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.POST('/api/jobs/list', {
        body: {
          filters: {
            search: filters.search || undefined,
            stage_id: filters.stage_id || undefined,
            category: filters.category || undefined,
            is_archived: filters.is_archived,
          },
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
  };
};
