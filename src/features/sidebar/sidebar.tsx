import { Sidebar, SidebarFooter } from '@/shared/shadcn/components/sidebar';
import { SidebarLogo } from '@/features/sidebar/ui/sidebar-logo';
import { SidebarNav } from '@/features/sidebar/ui/sidebar-nav';
import { SidebarLogoutButton } from '@/features/sidebar/ui/sidebar-logout-button';
import { SidebarThemeToggle } from '@/features/sidebar/ui/sidebar-theme-toggle';

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarLogo />
      <SidebarNav />
      <SidebarFooter className="flex flex-col items-center gap-2 p-2">
        <SidebarLogoutButton />
        <SidebarThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
};
