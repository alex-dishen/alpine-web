import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PREFERENCES_QUERY_KEY } from '@/configs/api/query-keys';
import { usePreferencesData, useUpdatePreference, type Theme, type PreferencesData } from './use-preferences';

// Re-export Theme type for convenience
export type { Theme };

/**
 * Hook to get and set the user's theme preference.
 * Reads from React Query cache and syncs with server.
 */
export const useTheme = () => {
  const preferences = usePreferencesData();
  const { updatePreference, isPending } = useUpdatePreference();

  const theme: Theme = preferences?.theme ?? 'system';

  const setTheme = (newTheme: Theme) => {
    updatePreference('theme', newTheme);
  };

  return { theme, setTheme, isPending };
};

/**
 * Hook to apply the theme to the document.
 * Should be used once at the app root level.
 */
export const useApplyTheme = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to preferences changes
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === PREFERENCES_QUERY_KEY[0] &&
          event.query.queryKey[1] === PREFERENCES_QUERY_KEY[1]) {
        const data = event.query.state.data as { preferences: PreferencesData } | undefined;
        const theme = data?.preferences?.theme ?? 'system';
        applyThemeToDocument(theme);
      }
    });

    // Apply initial theme from cache
    const data = queryClient.getQueryData<{ preferences: PreferencesData }>(PREFERENCES_QUERY_KEY);
    const theme = data?.preferences?.theme ?? 'system';
    applyThemeToDocument(theme);

    return unsubscribe;
  }, [queryClient]);
};

/**
 * Apply theme class to document root element.
 */
const applyThemeToDocument = (theme: Theme) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};
