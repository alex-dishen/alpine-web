import { useEffect, useMemo, useState } from 'react';
import { debounce } from '@/shared/utils/debounce';
import { useJobsTableStore } from '@/configs/zustand/jobs-table/jobs-table.store';
import {
  isFilterActive,
  type ColumnFilter,
} from '@/configs/zustand/jobs-table/jobs-table.helpers';

const DEBOUNCE_MS = 400;

/**
 * Returns debounced search and filters from the jobs filters store.
 * Used to avoid making API calls on every keystroke.
 */
export const useDebouncedFilters = () => {
  const [debouncedSearch, setDebouncedSearch] = useState(
    () => useJobsTableStore.getState().search
  );
  const [debouncedFilters, setDebouncedFilters] = useState<ColumnFilter[]>(() =>
    useJobsTableStore.getState().filters.filter(isFilterActive)
  );

  const debouncedSetSearch = useMemo(
    () => debounce((search: string) => setDebouncedSearch(search), DEBOUNCE_MS),
    []
  );

  const debouncedSetFilters = useMemo(
    () =>
      debounce((filters: ColumnFilter[]) => {
        const newActiveFilters = filters.filter(isFilterActive);
        setDebouncedFilters((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(newActiveFilters)) {
            return prev;
          }

          return newActiveFilters;
        });
      }, DEBOUNCE_MS),
    []
  );

  useEffect(() => {
    const unsubscribe = useJobsTableStore.subscribe((state, prevState) => {
      if (state.search !== prevState.search) {
        debouncedSetSearch(state.search);
      }

      if (state.filters !== prevState.filters) {
        debouncedSetFilters(state.filters);
      }
    });

    return () => {
      unsubscribe();
      debouncedSetSearch.cancel();
      debouncedSetFilters.cancel();
    };
  }, [debouncedSetSearch, debouncedSetFilters]);

  return { debouncedSearch, debouncedFilters };
};
