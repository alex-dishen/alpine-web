import { createFileRoute } from '@tanstack/react-router';
import { ErrorPage } from '@/pages/auth/error/error.page';

export const Route = createFileRoute('/auth/error')({
  validateSearch: (search: Record<string, unknown>) => ({
    error: (search.error as string) || 'An unknown error occurred',
  }),
  component: ErrorPage,
});
