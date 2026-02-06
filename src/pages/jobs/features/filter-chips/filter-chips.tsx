import { useJobsTableStore } from '@/configs/zustand/jobs-table/jobs-table.store';
import { FilterChip } from '@/pages/jobs/features/filter-chips/filter-chip';
import type { JobColumn } from '@/pages/jobs/registry/jobs.types';

type FilterChipsProps = {
  columns: JobColumn[];
};

export const FilterChips = ({ columns }: FilterChipsProps) => {
  const filters = useJobsTableStore((state) => state.filters);

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <FilterChip key={filter.columnId} filter={filter} columns={columns} />
      ))}
    </div>
  );
};
