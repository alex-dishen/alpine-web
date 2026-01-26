import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { $publicApi } from '@/configs/api/client';
import { useAuthStore } from '@/configs/zustand/auth/auth.store';
import {
  signInSchema,
  type SignInFormData,
} from '@/pages/auth/login/registry/login.types';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const queryClient = useQueryClient();

  const [loginData, setLoginData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInFormData, string>>
  >({});

  const mutation = $publicApi.useMutation('post', '/api/auth/sign-in', {
    onSuccess: () => {
      setAuthenticated(true);
      queryClient.invalidateQueries({
        queryKey: ['get', '/api/users/current'],
      });
      navigate({ to: '/' });
    },
    onError: () => {
      setErrors({ email: 'Invalid credentials' });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = signInSchema.safeParse(loginData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignInFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignInFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);

      return;
    }

    mutation.mutate({ body: loginData });
  };

  return {
    loginData,
    errors,
    isPending: mutation.isPending,
    handleChange,
    handleSubmit,
  };
};
