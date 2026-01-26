import { useAuthCallback } from '@/pages/auth/callback/model/use-auth-callback';

export const CallbackPage = () => {
  useAuthCallback();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};
