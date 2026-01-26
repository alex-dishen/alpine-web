import { Link, useSearch } from '@tanstack/react-router';
import { Button } from '@/shared/shadcn/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';

export const ErrorPage = () => {
  const { error } = useSearch({ from: '/auth/error' });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-destructive text-2xl">
            Authentication Error
          </CardTitle>
          <CardDescription>
            We couldn&apos;t complete your sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/auth/login">Try again</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link to="/">Go home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
