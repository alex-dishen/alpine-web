import { JobsHeader } from '@/pages/jobs/features/jobs.header';
import { JobsStats } from '@/pages/jobs/features/jobs.stats';
import { JobsApplications } from '@/pages/jobs/features/jobs.applications';

export const JobsPage = () => {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <JobsHeader />
        <JobsStats />
        <JobsApplications />
      </div>
    </div>
  );
};
