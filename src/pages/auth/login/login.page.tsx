import { Card } from '@/shared/shadcn/components/card';
import { LoginHeader } from '@/pages/auth/login/features/login.header';
import { LoginForm } from '@/pages/auth/login/features/login.form';
import { LoginFooter } from '@/pages/auth/login/features/login.footer';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <LoginHeader />
        <LoginForm />
        <LoginFooter />
      </Card>
    </div>
  );
};

export default LoginPage;
