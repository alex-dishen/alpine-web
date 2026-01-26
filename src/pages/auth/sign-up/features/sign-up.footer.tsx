import { Link } from '@tanstack/react-router';
import { CardFooter } from '@/shared/shadcn/components/card';

export const SignUpFooter = () => {
  return (
    <CardFooter className="flex justify-center">
      <p className="text-muted-foreground text-sm">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </CardFooter>
  );
};
