import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PREFERENCES_QUERY_KEY } from '@/configs/api/query-keys';
import { fetchClient } from '@/configs/api/client';
import {
  usePreferencesData,
  type PreferencesData,
  type PreferencesColumnFilter,
  type PreferencesSort,
  type JobsPreferences,
} from './use-preferences';

const DEBOUNCE_MS = 300;

// Re-export types for convenience
export type { PreferencesColumnFilter, PreferencesSort };

// Filter operator type (matches backend)
export type FilterOperator =
  | 'contains'
  | 'not_contains'
  | 'equals'
  | 'not_equals'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'between'
  | 'is_true'
  | 'is_false'
  | 'is_any_of'
  | 'is_none_of';

// Filter out empty column filters (for API calls)
const getActiveFilters = (filters: PreferencesColumnFilter[]): PreferencesColumnFilter[] => {
  const noValueOperators = ['is_empty', 'is_not_empty'];
  return filters.filter((f) => {
    if (noValueOperators.includes(f.operator)) return true;
    if (Array.isArray(f.value)) {
      if (f.operator === 'between') {
        return f.value.length === 2 && f.value[0] !== '' && f.value[1] !== '';
      }
      return f.value.length > 0;
    }
    if (typeof f.value === 'boolean') return true;
    return f.value !== undefined && f.value !== '';
  });
};

/**
 * Hook to manage jobs page filters, sorts, and search.
 * Uses optimistic cache updates for immediate UI feedback,
 * then persists to server in background.
 */
export const useJobsPreferences = () => {
  const queryClient = useQueryClient();
  const preferences = usePreferencesData();

  // Get current jobs preferences from cache
  const jobsPrefs = preferences?.jobs;
  const columnFilters = useMemo(() => jobsPrefs?.columnFilters ?? [], [jobsPrefs?.columnFilters]);
  const sorts = useMemo(() => jobsPrefs?.sorts ?? [], [jobsPrefs?.sorts]);
  const searchFromCache = jobsPrefs?.search ?? '';

  // Local state for search (for smooth typing with debounce)
  const [search, setSearchLocal] = useState(searchFromCache);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromCache);

  // Debounced column filters for API calls
  const [debouncedColumnFilters, setDebouncedColumnFilters] = useState<PreferencesColumnFilter[]>(
    () => getActiveFilters(columnFilters)
  );

  // Debounce timer refs
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const columnFiltersDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync search from cache when it changes externally
  const searchFromCacheRef = useRef(searchFromCache);
  useEffect(() => {
    if (searchFromCache !== searchFromCacheRef.current) {
      searchFromCacheRef.current = searchFromCache;
      setSearchLocal(searchFromCache);
      setDebouncedSearch(searchFromCache);
    }
  }, [searchFromCache]);

  // Sync debounced column filters when cache changes
  useEffect(() => {
    setDebouncedColumnFilters(getActiveFilters(columnFilters));
  }, [columnFilters]);

  // Optimistically update cache and persist to server
  const updateJobsPreferences = useCallback(async (updates: Partial<JobsPreferences>) => {
    const currentData = queryClient.getQueryData<{ preferences: PreferencesData }>(PREFERENCES_QUERY_KEY);
    const currentPrefs = currentData?.preferences ?? {};
    const currentJobs = currentPrefs.jobs ?? {};

    const newJobs: JobsPreferences = {
      ...currentJobs,
      ...updates,
    };

    const newPreferences: PreferencesData = {
      ...currentPrefs,
      jobs: newJobs,
    };

    // Optimistic update - immediately update cache
    queryClient.setQueryData(PREFERENCES_QUERY_KEY, { preferences: newPreferences });

    // Persist to server (fire and forget, errors handled globally)
    try {
      await fetchClient.PUT('/api/users/current/preferences', {
        body: { preferences: newPreferences },
      });
    } catch {
      // Rollback on error
      queryClient.setQueryData(PREFERENCES_QUERY_KEY, currentData);
    }
  }, [queryClient]);

  // Search actions
  const setSearch = useCallback((value: string) => {
    setSearchLocal(value);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      updateJobsPreferences({ search: value || undefined });
    }, DEBOUNCE_MS);
  }, [updateJobsPreferences]);

  // Column filter actions with optimistic updates
  const addFilter = useCallback((columnId: string, operator: FilterOperator, value: unknown) => {
    const hasFilter = columnFilters.some((f) => f.columnId === columnId);
    if (hasFilter) return;

    const newFilters = [...columnFilters, { columnId, operator, value }];

    // Optimistic update
    updateJobsPreferences({ columnFilters: newFilters });

    // Debounce the active filters update for API calls
    if (columnFiltersDebounceRef.current) {
      clearTimeout(columnFiltersDebounceRef.current);
    }
    columnFiltersDebounceRef.current = setTimeout(() => {
      setDebouncedColumnFilters(getActiveFilters(newFilters));
    }, DEBOUNCE_MS);
  }, [columnFilters, updateJobsPreferences]);

  const updateFilter = useCallback((columnId: string, updates: Partial<PreferencesColumnFilter>) => {
    const newFilters = columnFilters.map((f) =>
      f.columnId === columnId ? { ...f, ...updates } : f
    );

    // Optimistic update
    updateJobsPreferences({ columnFilters: newFilters });

    // Debounce the active filters update for API calls
    if (columnFiltersDebounceRef.current) {
      clearTimeout(columnFiltersDebounceRef.current);
    }
    columnFiltersDebounceRef.current = setTimeout(() => {
      setDebouncedColumnFilters(getActiveFilters(newFilters));
    }, DEBOUNCE_MS);
  }, [columnFilters, updateJobsPreferences]);

  const removeFilter = useCallback((columnId: string) => {
    const newFilters = columnFilters.filter((f) => f.columnId !== columnId);

    // Optimistic update
    updateJobsPreferences({ columnFilters: newFilters });

    // Immediate update for removals (no debounce)
    setDebouncedColumnFilters(getActiveFilters(newFilters));
  }, [columnFilters, updateJobsPreferences]);

  const clearFilters = useCallback(() => {
    updateJobsPreferences({ columnFilters: [] });
    setDebouncedColumnFilters([]);
  }, [updateJobsPreferences]);

  const setColumnFilters = useCallback((filters: PreferencesColumnFilter[]) => {
    updateJobsPreferences({ columnFilters: filters });

    if (columnFiltersDebounceRef.current) {
      clearTimeout(columnFiltersDebounceRef.current);
    }
    columnFiltersDebounceRef.current = setTimeout(() => {
      setDebouncedColumnFilters(getActiveFilters(filters));
    }, DEBOUNCE_MS);
  }, [updateJobsPreferences]);

  // Sort actions with optimistic updates
  const setSorts = useCallback((newSorts: PreferencesSort[]) => {
    updateJobsPreferences({ sorts: newSorts });
  }, [updateJobsPreferences]);

  const addSort = useCallback((columnId: string, direction: 'asc' | 'desc') => {
    const existingIndex = sorts.findIndex((s) => s.columnId === columnId);
    let newSorts: PreferencesSort[];

    if (existingIndex >= 0) {
      newSorts = [...sorts];
      newSorts[existingIndex] = { columnId, direction };
    } else {
      newSorts = [...sorts, { columnId, direction }];
    }

    updateJobsPreferences({ sorts: newSorts });
  }, [sorts, updateJobsPreferences]);

  const removeSort = useCallback((columnId: string) => {
    const newSorts = sorts.filter((s) => s.columnId !== columnId);
    updateJobsPreferences({ sorts: newSorts });
  }, [sorts, updateJobsPreferences]);

  const clearSorts = useCallback(() => {
    updateJobsPreferences({ sorts: [] });
  }, [updateJobsPreferences]);

  // Clear all (resets values but keeps filter chips)
  const clearAll = useCallback(() => {
    const resetFilters = columnFilters.map((f) => {
      if (f.operator === 'is_empty' || f.operator === 'is_not_empty') {
        return f;
      }

      let resetValue: unknown;
      switch (f.operator) {
        case 'is_any_of':
        case 'is_none_of':
          resetValue = [];
          break;
        case 'between':
          resetValue = ['', ''];
          break;
        default:
          resetValue = undefined;
      }

      return { ...f, value: resetValue };
    });

    setSearchLocal('');
    setDebouncedSearch('');
    setDebouncedColumnFilters([]);
    updateJobsPreferences({
      search: undefined,
      columnFilters: resetFilters
    });
  }, [columnFilters, updateJobsPreferences]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      if (columnFiltersDebounceRef.current) clearTimeout(columnFiltersDebounceRef.current);
    };
  }, []);

  return {
    // Live state (for UI) - reads from cache
    search,
    columnFilters,
    sorts,

    // Debounced state (for API calls)
    debouncedSearch,
    debouncedColumnFilters,

    // Search actions
    setSearch,

    // Column filter actions
    setColumnFilters,
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,

    // Sort actions
    setSorts,
    addSort,
    removeSort,
    clearSorts,

    // Clear all
    clearAll,
  };
};
