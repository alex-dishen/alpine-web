import { useState } from 'react';
import { JobsHeader } from '@/pages/jobs/features/header/jobs.header';
import { JobsTableView } from '@/pages/jobs/features/table-view/jobs.table-view';
import type { JobFilters } from '@/pages/jobs/registry/jobs.types';

export const JobsPage = () => {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    stage_id: undefined,
    category: undefined,
    is_archived: false,
  });

  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1400px]">
        <JobsHeader
          search={filters.search ?? ''}
          onSearchChange={(search) =>
            setFilters((prev) => ({ ...prev, search: search || undefined }))
          }
        />
        <JobsTableView filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};
