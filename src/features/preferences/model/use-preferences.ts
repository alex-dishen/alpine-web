import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/configs/api/client';
import { PREFERENCES_QUERY_KEY } from '@/configs/api/query-keys';
import type { components } from '@/configs/api/types/api.generated';

// Re-export types for convenience
export type PreferencesData = components['schemas']['PreferencesDataDto'];
export type JobsPreferences = components['schemas']['JobsPreferencesDto'];
export type PreferencesColumnFilter = components['schemas']['PreferencesColumnFilterDto'];
export type PreferencesSort = components['schemas']['PreferencesSortDto'];
export type Theme = 'light' | 'dark' | 'system';

/**
 * Hook to fetch user preferences from the server.
 * Returns the preferences query result.
 */
export const usePreferences = () => {
  return $api.useQuery('get', '/api/users/current/preferences', undefined, {
    staleTime: Infinity, // Preferences don't change often, keep fresh until manually invalidated
  });
};

/**
 * Hook to get preferences data from the cache with subscription.
 * Re-renders when preferences change.
 * Returns undefined if not loaded yet.
 */
export const usePreferencesData = (): PreferencesData | undefined => {
  const { data } = usePreferences();
  return data?.preferences as PreferencesData | undefined;
};

/**
 * Hook to update user preferences on the server.
 * Provides optimistic updates and automatic cache invalidation.
 */
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return $api.useMutation('put', '/api/users/current/preferences', {
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: PREFERENCES_QUERY_KEY });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<{ preferences: PreferencesData }>(PREFERENCES_QUERY_KEY);

      // Optimistically update the cache
      queryClient.setQueryData(PREFERENCES_QUERY_KEY, {
        preferences: variables.body.preferences,
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(PREFERENCES_QUERY_KEY, context.previousData);
      }
    },
  });
};

/**
 * Helper to update a specific preference key while preserving others.
 * Uses the mutation hook internally.
 */
export const useUpdatePreference = () => {
  const queryClient = useQueryClient();
  const mutation = useUpdatePreferences();

  const updatePreference = <K extends keyof PreferencesData>(
    key: K,
    value: PreferencesData[K]
  ) => {
    const currentData = queryClient.getQueryData<{ preferences: PreferencesData }>(PREFERENCES_QUERY_KEY);
    const currentPreferences = currentData?.preferences ?? {};

    mutation.mutate({
      body: {
        preferences: {
          ...currentPreferences,
          [key]: value,
        },
      },
    });
  };

  return { updatePreference, ...mutation };
};
