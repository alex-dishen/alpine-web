import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { $api } from '@/configs/api/client';
import { PREFERENCES_QUERY_KEY } from '@/configs/api/query-keys';
import type { components } from '@/configs/api/types/api.generated';

type UserPreferences = components['schemas']['UserPreferencesDto'];
type UpdatePreferencesDto = components['schemas']['UpdatePreferencesDto'];
type MutationContext = { previousPreferences: UserPreferences | undefined };

export const usePreferences = () => {
  return $api.useQuery('get', '/api/users/current/preferences');
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mutation = $api.useMutation('put', '/api/users/current/preferences', {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: PREFERENCES_QUERY_KEY,
      });

      const previousPreferences = queryClient.getQueryData(
        PREFERENCES_QUERY_KEY
      ) as UserPreferences | undefined;

      queryClient.setQueryData(
        PREFERENCES_QUERY_KEY,
        (old: UserPreferences | undefined) => ({
          ...old,
          ...variables.body,
        })
      );

      return { previousPreferences };
    },
    onError: (_error, _variables, context) => {
      const ctx = context as MutationContext | undefined;

      if (ctx?.previousPreferences) {
        queryClient.setQueryData(
          PREFERENCES_QUERY_KEY,
          ctx.previousPreferences
        );
      }
    },
  });

  // Debounced update to avoid too many requests
  const debouncedUpdate = useCallback(
    (preferences: UpdatePreferencesDto) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        mutation.mutate({ body: preferences });
      }, 500);
    },
    [mutation]
  );

  return {
    ...mutation,
    debouncedUpdate,
  };
};
