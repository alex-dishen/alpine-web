import { JobsFilterBar } from '@/pages/jobs/features/filter-bar/jobs.filter-bar';
import { JobsTable } from '@/pages/jobs/features/jobs-table/jobs.jobs-table';
import type { JobFilters } from '@/pages/jobs/registry/jobs.types';

type JobsTableViewProps = {
  filters: JobFilters;
  setFilters: React.Dispatch<React.SetStateAction<JobFilters>>;
};

export const JobsTableView = ({ filters, setFilters }: JobsTableViewProps) => {
  return (
    <div className="space-y-4">
      <JobsFilterBar filters={filters} setFilters={setFilters} />

      <div className="rounded-lg border">
        <JobsTable filters={filters} />
      </div>
    </div>
  );
};
