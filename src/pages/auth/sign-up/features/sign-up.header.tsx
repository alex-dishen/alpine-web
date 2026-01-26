import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/card';

export const SignUpHeader = () => {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl">Create an account</CardTitle>
      <CardDescription>Enter your information to get started</CardDescription>
    </CardHeader>
  );
};
