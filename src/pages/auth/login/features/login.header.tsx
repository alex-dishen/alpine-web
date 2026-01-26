import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';

export const LoginHeader = () => {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl">Sign in</CardTitle>
      <CardDescription>
        Enter your email and password to access your account
      </CardDescription>
    </CardHeader>
  );
};
