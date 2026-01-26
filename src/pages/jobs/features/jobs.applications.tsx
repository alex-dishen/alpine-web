import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';
import { Badge } from '@/shared/shadcn/components/badge';
import { recentApplications } from '@/pages/jobs/registry/jobs.constants';

export const JobsApplications = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Your latest job applications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentApplications.map((job, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-medium">{job.company}</p>
              <p className="text-muted-foreground text-sm">{job.role}</p>
            </div>
            <Badge variant={job.variant}>{job.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
