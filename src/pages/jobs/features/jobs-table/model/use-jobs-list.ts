import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { startOfDay, endOfDay, parseISO, isValid } from 'date-fns';
import { fetchClient, $api } from '@/configs/api/client';
import { useJobsPreferences } from '@/features/preferences/model/use-jobs-preferences';
import type { components } from '@/configs/api/types/api.generated';

type SortByEnum = components['schemas']['JobSortDto']['sort_by'];

// Core field keys that map directly to sort_by enum
const CORE_SORT_FIELDS: Set<string> = new Set([
  'stage',
  'category',
  'is_archived',
  'company_name',
  'job_title',
  'applied_at',
  'salary_min',
  'salary_max',
  'created_at',
]);

export const useJobsList = () => {
  // Get filters from preferences (debounced values for API calls)
  const {
    debouncedSearch,
    debouncedColumnFilters,
    sorts,
  } = useJobsPreferences();

  // Get columns for mapping sorts/filters
  const { data: columns = [] } = $api.useQuery('get', '/api/jobs/columns');

  // Take the first sort for API (backend currently supports single sort)
  const primarySort = sorts[0];
  const apiSort = useMemo(() => {
    if (!primarySort) return undefined;

    const column = columns.find((c) => c.id === primarySort.columnId);

    if (!column) return undefined;

    // Core columns use field_key directly as sort_by
    if (
      column.is_core &&
      column.field_key &&
      CORE_SORT_FIELDS.has(column.field_key)
    ) {
      return {
        sort_by: column.field_key as SortByEnum,
        order: primarySort.direction,
      };
    }

    // Custom columns use 'custom_column' with column_id
    return {
      sort_by: 'custom_column' as SortByEnum,
      order: primarySort.direction,
      column_id: column.id,
    };
  }, [primarySort, columns]);

  // Map column filters to API format
  const apiColumnFilters = useMemo(() => {
    return debouncedColumnFilters.map((f) => {
      const column = columns.find((c) => c.id === f.columnId);
      const columnId =
        column?.is_core && column?.field_key ? column.field_key : f.columnId;
      const isDateType = column?.column_type === 'date';

      let operator =
        f.operator as components['schemas']['ColumnFilterDto']['operator'];
      let value = f.value as components['schemas']['ColumnFilterDto']['value'];

      // For date fields, use date-fns to handle start/end of day for timestamp comparisons
      if (isDateType) {
        // Handle "between" operator with two dates
        if (f.operator === 'between' && Array.isArray(f.value)) {
          const [startDateStr, endDateStr] = f.value;
          if (startDateStr && endDateStr) {
            const startDate = parseISO(startDateStr);
            const endDate = parseISO(endDateStr);
            if (isValid(startDate) && isValid(endDate)) {
              value = [
                startOfDay(startDate).toISOString(),
                endOfDay(endDate).toISOString(),
              ];
            }
          }
        }
        // Handle single date operators
        else if (typeof f.value === 'string' && f.value) {
          const date = parseISO(f.value);
          if (isValid(date)) {
            switch (f.operator) {
              case 'equals':
                operator = 'between';
                value = [
                  startOfDay(date).toISOString(),
                  endOfDay(date).toISOString(),
                ];
                break;
              case 'lt':
                value = startOfDay(date).toISOString();
                break;
              case 'lte':
                value = endOfDay(date).toISOString();
                break;
              case 'gt':
                value = endOfDay(date).toISOString();
                break;
              case 'gte':
                value = startOfDay(date).toISOString();
                break;
            }
          }
        }
      }

      return {
        column_id: columnId,
        operator,
        value,
        column_type:
          column?.column_type as components['schemas']['ColumnFilterDto']['column_type'],
      };
    });
  }, [debouncedColumnFilters, columns]);

  const query = useInfiniteQuery({
    queryKey: ['jobs', debouncedSearch, sorts, debouncedColumnFilters],
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.POST('/api/jobs/list', {
        body: {
          filters: {
            search: debouncedSearch || undefined,
            is_archived: false,
          },
          column_filters:
            apiColumnFilters.length > 0 ? apiColumnFilters : undefined,
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
