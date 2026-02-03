import { useEffect } from 'react';
import { usePreferences, type PreferencesData, type Theme } from './model/use-preferences';

type PreferencesProviderProps = {
  children: React.ReactNode;
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

/**
 * Provider component that loads user preferences and applies them.
 * Should wrap the authenticated portion of the app.
 */
export const PreferencesProvider = ({ children }: PreferencesProviderProps) => {
  const { data, isLoading } = usePreferences();

  // Apply theme when preferences load or change
  useEffect(() => {
    const theme = (data?.preferences as PreferencesData)?.theme ?? 'system';
    applyThemeToDocument(theme);
  }, [data?.preferences]);

  // Listen for system theme changes when using 'system' theme
  useEffect(() => {
    const theme = (data?.preferences as PreferencesData)?.theme ?? 'system';

    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyThemeToDocument('system');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [data?.preferences]);

  // Show loading state while preferences are being fetched
  // This prevents flash of wrong theme
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
