import { JobsHeader } from '@/pages/jobs/features/header/jobs.header';
import { JobsTableView } from '@/pages/jobs/features/table-view/jobs.table-view';

export const JobsPage = () => {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1400px]">
        <JobsHeader />
        <JobsTableView />
      </div>
    </div>
  );
};
