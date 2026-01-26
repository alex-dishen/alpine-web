import { AppProviders } from '@/app/providers';
import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import { router } from '@/app/routes/-router';

export const App = () => {
  return (
    <AppProviders>
      <TanStackRouterProvider router={router} />
    </AppProviders>
  );
};
