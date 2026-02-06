import type { ReactNode } from 'react';
import { QueryProvider } from '@/app/providers/query-provider';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { ModalsProvider } from '@/app/providers/modals-provider';
import { ToastProvider } from '@/app/providers/toast-provider';

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <ModalsProvider />
        <ToastProvider />
      </ThemeProvider>
    </QueryProvider>
  );
};
