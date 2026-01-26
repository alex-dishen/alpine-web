import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { $api } from '@/configs/api/client';
import { useAuthStore } from '@/configs/zustand/auth/auth.store';

export const useAuthCallback = () => {
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const { data, isLoading, isError } = $api.useQuery(
    'get',
    '/api/users/current'
  );

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data) {
      navigate({
        to: '/auth/error',
        search: { error: 'Failed to fetch user' },
      });
    } else {
      setAuthenticated(true);
      navigate({ to: '/' });
    }
  }, [data, isLoading, isError, navigate, setAuthenticated]);

  return { isLoading };
};
