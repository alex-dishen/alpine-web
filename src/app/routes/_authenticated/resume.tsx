import { createFileRoute } from '@tanstack/react-router';
import { ResumePage } from '@/pages/resume/resume.page';

export const Route = createFileRoute('/_authenticated/resume')({
  component: ResumePage,
});
