import { CardContent } from '@/shared/shadcn/components/card';
import { Button } from '@/shared/shadcn/components/button';
import { Input } from '@/shared/shadcn/components/input';
import { Label } from '@/shared/shadcn/components/label';
import { PasswordInput } from '@/shared/shadcn/components/password-input';
import { Separator } from '@/shared/shadcn/components/separator';
import { GoogleLoginButton } from '@/features/google-login-button/google-login-button';
import { useSignUp } from '@/pages/auth/sign-up/model/use-sign-up';

export const SignUpForm = () => {
  const { signUpData, errors, isPending, handleChange, handleSubmit } =
    useSignUp();

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="John"
              value={signUpData.first_name}
              onChange={handleChange}
              aria-invalid={!!errors.first_name}
            />
            {errors.first_name && (
              <p className="text-destructive text-sm">{errors.first_name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Doe"
              value={signUpData.last_name}
              onChange={handleChange}
              aria-invalid={!!errors.last_name}
            />
            {errors.last_name && (
              <p className="text-destructive text-sm">{errors.last_name}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={signUpData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Create a password"
            value={signUpData.password}
            onChange={handleChange}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmation_password">Confirm password</Label>
          <PasswordInput
            id="confirmation_password"
            name="confirmation_password"
            placeholder="Confirm your password"
            value={signUpData.confirmation_password}
            onChange={handleChange}
            aria-invalid={!!errors.confirmation_password}
          />
          {errors.confirmation_password && (
            <p className="text-destructive text-sm">
              {errors.confirmation_password}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending}
        >
          {isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleLoginButton />
    </CardContent>
  );
};
