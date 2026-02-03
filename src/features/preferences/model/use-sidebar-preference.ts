import { usePreferencesData, useUpdatePreference } from './use-preferences';

/**
 * Hook to get and set the user's sidebar open/closed preference.
 * Reads from React Query cache and syncs with server.
 */
export const useSidebarPreference = () => {
  const preferences = usePreferencesData();
  const { updatePreference, isPending } = useUpdatePreference();

  // Default to true (open) if not set
  const sidebarOpen: boolean = preferences?.sidebarOpen ?? true;

  const setSidebarOpen = (open: boolean) => {
    updatePreference('sidebarOpen', open);
  };

  return { sidebarOpen, setSidebarOpen, isPending };
};
