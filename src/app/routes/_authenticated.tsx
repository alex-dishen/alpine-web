import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/shadcn/components/sidebar';
import { AppSidebar } from '@/features/sidebar/sidebar';
import { Separator } from '@/shared/shadcn/components/separator';
import { restoreSession } from '@/configs/auth/session';
import { PreferencesProvider } from '@/features/preferences/preferences-provider';
import { useSidebarPreference } from '@/features/preferences/model/use-sidebar-preference';

const AuthenticatedLayoutContent = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebarPreference();

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
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

const AuthenticatedLayout = () => {
  return (
    <PreferencesProvider>
      <AuthenticatedLayoutContent />
    </PreferencesProvider>
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
