import { $api } from '@/configs/api/client';
import { JobsTable } from '@/pages/jobs/features/jobs-table/jobs.jobs-table';
import { TableToolbar } from '@/pages/jobs/features/jobs-table/ui/table-toolbar';

export const JobsTableView = () => {
  const { data: columns = [] } = $api.useQuery('get', '/api/jobs/columns');

  return (
    <div className="space-y-4">
      <TableToolbar columns={columns} />

      <div className="rounded-lg">
        <JobsTable />
      </div>
    </div>
  );
};
