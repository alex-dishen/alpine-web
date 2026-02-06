import { useState } from 'react';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';
import { useJobsFiltersStore } from '@/configs/zustand/jobs-filters/jobs-filters.store';

type UseSortChipProps = {
  columns: JobColumn[];
};

export const useSortChip = ({ columns }: UseSortChipProps) => {
  const [open, setOpen] = useState(false);

  const sort = useJobsFiltersStore((state) => state.sort);
  const setSort = useJobsFiltersStore((state) => state.setSort);
  const clearSort = useJobsFiltersStore((state) => state.clearSort);

  const handleUpdateSort = (field: 'columnId' | 'direction', value: string) => {
    if (field === 'columnId') {
      const column = columns.find((c) => c.id === value);
      // When selecting a column, set default direction to 'desc' if no existing sort
      const direction = sort?.direction ?? 'desc';
      setSort({
        columnId: value,
        columnName: column?.name ?? value,
        direction,
      });
    } else if (sort) {
      setSort({ ...sort, direction: value as 'asc' | 'desc' });
    }
  };

  const handleClearSort = () => {
    clearSort();
    setOpen(false);
  };

  return {
    open,
    sort,
    columns,
    setOpen,
    handleUpdateSort,
    handleClearSort,
  };
};
