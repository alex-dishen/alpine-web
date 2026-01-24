import { Briefcase } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const recentApplications = [
  {
    company: 'TechCorp Inc.',
    role: 'Senior Frontend Developer',
    status: 'Interview',
    variant: 'default' as const,
  },
  {
    company: 'StartupXYZ',
    role: 'Full Stack Engineer',
    status: 'Applied',
    variant: 'secondary' as const,
  },
  {
    company: 'BigTech Co.',
    role: 'React Developer',
    status: 'Under Review',
    variant: 'outline' as const,
  },
];

export function JobsPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription>Active Applications</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                3 interviews scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Response Rate</CardDescription>
              <CardTitle className="text-3xl">34%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Above average for your field
              </p>
            </CardContent>
          </Card>
        </div>

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
      </div>
    </div>
  );
}
