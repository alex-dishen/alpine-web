import { useEffect, type ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Apply system theme to document.
 * This is used as the default before user preferences are loaded.
 * PreferencesProvider will override this for authenticated users.
 */
const applySystemTheme = () => {
  const root = window.document.documentElement;
  // Only apply if no theme class is set yet
  if (!root.classList.contains('light') && !root.classList.contains('dark')) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  }
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  useEffect(() => {
    applySystemTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      // Only update if user hasn't set a preference (no explicit light/dark from server)
      // This is a basic fallback - PreferencesProvider handles this better for authenticated users
      if (!root.classList.contains('light') && !root.classList.contains('dark')) {
        applySystemTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return <>{children}</>;
};
