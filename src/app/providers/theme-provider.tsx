import { useUserPreferencesStore } from '@/configs/zustand/user-preferences/user-preferences.store';
import { useEffect, type ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useUserPreferencesStore((state) => state.theme);

  useEffect(() => {
    applyTheme(theme);

    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return <>{children}</>;
};
