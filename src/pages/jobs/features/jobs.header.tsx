import { Briefcase } from 'lucide-react';

export const JobsHeader = () => {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
        <Briefcase className="size-8" />
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Job Tracking</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Track your job applications and their status
        </p>
      </div>
    </div>
  );
};
