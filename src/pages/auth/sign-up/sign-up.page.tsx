import { Card } from '@/shared/shadcn/components/card';
import { SignUpHeader } from '@/pages/auth/sign-up/features/sign-up.header';
import { SignUpForm } from '@/pages/auth/sign-up/features/sign-up.form';
import { SignUpFooter } from '@/pages/auth/sign-up/features/sign-up.footer';

const SignupPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <SignUpHeader />
        <SignUpForm />
        <SignUpFooter />
      </Card>
    </div>
  );
};

export default SignupPage;
