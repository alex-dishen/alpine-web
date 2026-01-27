import { Link } from '@tanstack/react-router';
import { CardFooter } from '@/shared/shadcn/components/card';

export const LoginFooter = () => {
  return (
    <CardFooter className="flex justify-center">
      <p className="text-muted-foreground text-sm">
        Don&apos;t have an account?{' '}
        <Link
          to="/auth/sign-up"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </CardFooter>
  );
};
