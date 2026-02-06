import { Plus, Search, Settings2, Columns3 } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { Input } from '@/shared/shadcn/components/input';
import { Badge } from '@/shared/shadcn/components/badge';
import { useJobsHeader } from '@/pages/jobs/features/header/model/use-jobs-header';

export const JobsHeader = () => {
  const {
    count,
    search,
    handleSearchChange,
    handleOpenColumnManager,
    handleOpenStageManager,
    handleOpenAddJob,
  } = useJobsHeader();

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            Job Tracker
            {count !== undefined && <Badge variant="secondary">{count}</Badge>}
          </h1>
          <p className="text-muted-foreground text-sm">
            Track and manage your job applications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleOpenColumnManager}
          >
            <Columns3 className="mr-2 size-4" />
            Columns
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleOpenStageManager}
          >
            <Settings2 className="mr-2 size-4" />
            Stages
          </Button>
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={handleOpenAddJob}
          >
            <Plus className="mr-2 size-4" />
            Add Job
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search jobs by company or position..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
};
