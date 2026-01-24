import { AppProviders } from './providers';
import { RouterProvider } from './providers/router-provider';

export function App() {
  return (
    <AppProviders>
      <RouterProvider />
    </AppProviders>
  );
}
