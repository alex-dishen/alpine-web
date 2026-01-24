import type { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from '@configs/theme/theme-provider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
}
