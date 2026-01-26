import { Button } from '@shared/shadcn/components/button';
import { GoogleIcon } from '@shared/assets/svg/google-icon';

export const GoogleLoginButton = () => {
  const handleClick = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full cursor-pointer"
      onClick={handleClick}
    >
      <GoogleIcon className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
};
