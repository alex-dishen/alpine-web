import { createFileRoute } from '@tanstack/react-router';
import { JobsPage } from '@pages/jobs/jobs';

export const Route = createFileRoute('/jobs')({
  component: JobsPage,
});
