import { createFileRoute } from '@tanstack/react-router';
import { CallbackPage } from '@/pages/auth/callback/callback.page';

export const Route = createFileRoute('/auth/callback')({
  component: CallbackPage,
});
