import { LogOut } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/button';
import { useLogout } from '@/features/sidebar/model/use-logout';

export const SidebarLogoutButton = () => {
  const { isLoggingOut, handleLogout } = useLogout();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full cursor-pointer"
    >
      <LogOut className="size-4" />
      <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
    </Button>
  );
};
