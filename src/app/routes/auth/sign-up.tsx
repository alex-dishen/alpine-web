import { createFileRoute, redirect } from '@tanstack/react-router';
import { restoreSession } from '@/configs/auth/session';
import SignupPage from '@/pages/auth/sign-up/sign-up.page';

export const Route = createFileRoute('/auth/sign-up')({
  beforeLoad: async () => {
    const isAuthenticated = await restoreSession();

    if (isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: SignupPage,
});
