import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/shadcn/components/sidebar';
import { AppSidebar } from '@/features/sidebar/sidebar';
import { Separator } from '@/shared/shadcn/components/separator';
import { restoreSession } from '@/configs/auth/session';

const AuthenticatedLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const isAuthenticated = await restoreSession();

    if (!isAuthenticated) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: AuthenticatedLayout,
});
