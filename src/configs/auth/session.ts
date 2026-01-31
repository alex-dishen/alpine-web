import { fetchClient } from '@/configs/api/client';
import { USER_QUERY_KEY } from '@/configs/api/query-keys';
import { queryClient } from '@/configs/query-client/query-client';
import { useAuthStore } from '@/configs/zustand/auth/auth.store';

export const restoreSession = async (): Promise<boolean> => {
  const { setAuthenticated, isAuthenticated } = useAuthStore.getState();

  if (isAuthenticated) return true;

  try {
    const data = await queryClient.fetchQuery({
      queryKey: USER_QUERY_KEY,
      queryFn: async () => {
        const { data, error } = await fetchClient.GET('/api/users/current');

        if (error || !data) throw new Error('Failed to fetch user');

        return data;
      },
    });

    if (data) {
      setAuthenticated(true);

      return true;
    }
  } catch {
    setAuthenticated(false);
  }

  return false;
};
