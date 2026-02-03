import { create } from 'zustand';

type FilterDropdownStore = {
  openColumnId: string | null;
  openedAt: number;
  openFilter: (columnId: string) => void;
  closeFilter: () => void;
  setOpen: (columnId: string, open: boolean) => void;
  canClose: () => boolean;
};

export const useFilterDropdownStore = create<FilterDropdownStore>(
  (set, get) => ({
    openColumnId: null,
    openedAt: 0,
    openFilter: (columnId) => {
      // Delay to let column header dropdown close first
      setTimeout(() => set({ openColumnId: columnId, openedAt: Date.now() }));
    },
    closeFilter: () => set({ openColumnId: null }),
    setOpen: (columnId, open) => {
      set({ openColumnId: open ? columnId : null });
    },
    // Prevent closing within 200ms of programmatic open
    canClose: () => Date.now() - get().openedAt > 200,
  })
);
