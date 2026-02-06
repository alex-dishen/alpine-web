import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FILTER_OPERATORS } from '@/configs/api/types/api.enums';
import {
  getDefaultFilterByColumnType,
  type ColumnFilter,
  type Sort,
} from '@/configs/zustand/jobs-filters/jobs-filters.helpers';

type JobsFiltersState = {
  // Persisted state
  search: string;
  filters: ColumnFilter[];
  sort: Sort | null;

  // Non-persisted state (filter dropdown)
  openFilterColumnId: string | null;
  openFilterAt: number;

  // Persisted actions
  setSearch: (search: string) => void;
  setFilters: (filters: ColumnFilter[]) => void;
  addFilter: (filter: ColumnFilter) => void;
  updateFilter: (columnId: string, updates: Partial<ColumnFilter>) => void;
  removeFilter: (columnId: string) => void;
  clearFilters: () => void;
  setSort: (sort: Sort | null) => void;
  clearSort: () => void;
  clearAll: () => void;

  // Non-persisted actions (filter dropdown)
  openFilter: (columnId: string) => void;
  closeFilter: () => void;
  setFilterOpen: (columnId: string, open: boolean) => void;
  canCloseFilter: () => boolean;
};

export const useJobsFiltersStore = create<JobsFiltersState>()(
  persist(
    (set, get) => ({
      // Persisted state
      search: '',
      filters: [],
      sort: null,

      // Non-persisted state
      openFilterColumnId: null,
      openFilterAt: 0,

      setSearch: (search) => set({ search }),

      setFilters: (filters) => set({ filters }),

      addFilter: (filter) => {
        const { filters } = get();

        if (filters.some((f) => f.columnId === filter.columnId)) return;

        set({ filters: [...filters, filter] });
      },

      updateFilter: (columnId, updates) => {
        const { filters } = get();
        set({
          filters: filters.map((f) =>
            f.columnId === columnId ? { ...f, ...updates } : f
          ),
        });
      },

      removeFilter: (columnId) => {
        const { filters } = get();
        set({
          filters: filters.filter((f) => f.columnId !== columnId),
        });
      },

      clearFilters: () => set({ filters: [] }),

      setSort: (sort) => set({ sort }),

      clearSort: () => set({ sort: null }),

      clearAll: () => {
        const { filters } = get();
        const resetFilters = filters.map((f) => {
          // For "is_empty" or "is_not_empty", reset to default operator based on column type
          if (
            f.operator === FILTER_OPERATORS.IS_EMPTY ||
            f.operator === FILTER_OPERATORS.IS_NOT_EMPTY
          ) {
            const defaults = getDefaultFilterByColumnType(f.columnType);

            return { ...f, operator: defaults.operator, value: defaults.value };
          }

          let resetValue: unknown;
          switch (f.operator) {
            case FILTER_OPERATORS.IS_ANY_OF:
            case FILTER_OPERATORS.IS_NONE_OF:
              resetValue = [];
              break;
            case FILTER_OPERATORS.BETWEEN:
              resetValue = ['', ''];
              break;
            default:
              resetValue = undefined;
          }

          return { ...f, value: resetValue };
        });

        set({ search: '', filters: resetFilters, sort: null });
      },

      // Filter dropdown actions (non-persisted)
      openFilter: (columnId) => {
        // Delay to let column header dropdown close first
        setTimeout(() =>
          set({ openFilterColumnId: columnId, openFilterAt: Date.now() })
        );
      },
      closeFilter: () => set({ openFilterColumnId: null }),
      setFilterOpen: (columnId, open) => {
        set({ openFilterColumnId: open ? columnId : null });
      },
      canCloseFilter: () => Date.now() - get().openFilterAt > 200,
    }),
    {
      name: 'alpine-jobs-filters',
      partialize: (state) => ({
        search: state.search,
        filters: state.filters,
        sort: state.sort,
      }),
    }
  )
);
