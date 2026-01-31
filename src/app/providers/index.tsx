import type { ReactNode } from 'react';
import { QueryProvider } from '@/app/providers/query-provider';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { ModalsProvider } from '@/app/providers/modals-provider';
import { Toaster } from '@/shared/shadcn/components/sonner';

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <ModalsProvider />
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  );
};
