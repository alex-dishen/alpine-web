import { useState } from 'react';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';
import { useJobsTableStore } from '@/configs/zustand/jobs-table/jobs-table.store';

type UseSortChipProps = {
  columns: JobColumn[];
};

export const useSortChip = ({ columns }: UseSortChipProps) => {
  const [open, setOpen] = useState(false);

  const sort = useJobsTableStore((state) => state.sort);
  const setSort = useJobsTableStore((state) => state.setSort);
  const clearSort = useJobsTableStore((state) => state.clearSort);

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
