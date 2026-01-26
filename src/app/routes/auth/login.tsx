import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/configs/zustand/auth/auth.store';
import LoginPage from '@/pages/auth/login/login.page';

export const Route = createFileRoute('/auth/login')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});
