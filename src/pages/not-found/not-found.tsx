import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/shadcn/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';

export const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <CardTitle className="text-6xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">Page not found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button asChild variant="outline">
            <Link to="/" onClick={() => window.history.back()}>
              Go back
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
