import { JobsTable } from '@/pages/jobs/features/jobs-table/jobs.jobs-table';
import { TableToolbar } from '@/pages/jobs/features/table-toolbar/table-toolbar';

export const JobsTableView = () => {
  return (
    <div className="space-y-4">
      <TableToolbar />

      <div className="rounded-lg">
        <JobsTable />
      </div>
    </div>
  );
};
