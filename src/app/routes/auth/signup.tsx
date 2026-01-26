import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/configs/zustand/auth/auth.store';
import SignupPage from '@/pages/auth/sign-up/sign-up.page';

export const Route = createFileRoute('/auth/signup')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: SignupPage,
});
