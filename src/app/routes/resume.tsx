import { createFileRoute } from '@tanstack/react-router';
import { ResumePage } from '@pages/resume/resume';

export const Route = createFileRoute('/resume')({
  component: ResumePage,
});
