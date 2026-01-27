import { createFileRoute, redirect } from '@tanstack/react-router';
import { restoreSession } from '@/configs/auth/session';
import LoginPage from '@/pages/auth/login/login.page';

export const Route = createFileRoute('/auth/login')({
  beforeLoad: async () => {
    const isAuthenticated = await restoreSession();

    if (isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});
