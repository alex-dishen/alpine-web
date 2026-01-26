import { createFileRoute } from '@tanstack/react-router';
import { JobsPage } from '@/pages/jobs/jobs.page';

export const Route = createFileRoute('/_authenticated/jobs')({
  component: JobsPage,
});
