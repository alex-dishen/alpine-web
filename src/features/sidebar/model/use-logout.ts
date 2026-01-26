import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { $api } from '@/configs/api/client';
import { useAuthStore } from '@/configs/zustand/auth/auth.store';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const { mutate: logout, isPending: isLoggingOut } = $api.useMutation(
    'post',
    '/api/auth/logout',
    {
      onSuccess: () => {
        setAuthenticated(false);
        queryClient.clear();
        navigate({ to: '/auth/login' });
      },
    }
  );

  const handleLogout = () => {
    logout(undefined);
  };

  return {
    isLoggingOut,
    handleLogout,
  };
};
