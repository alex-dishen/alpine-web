import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { $publicApi } from '@/configs/api/client';
import { useAuthStore } from '@/configs/zustand/auth/auth.store';
import {
  signUpSchema,
  type SignUpFormData,
} from '@/pages/auth/sign-up/registry/sign-up.types';

export const useSignUp = () => {
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const queryClient = useQueryClient();

  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmation_password: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});

  const mutation = $publicApi.useMutation('post', '/api/auth/sign-up', {
    onSuccess: () => {
      setAuthenticated(true);
      queryClient.invalidateQueries({
        queryKey: ['get', '/api/users/current'],
      });
      navigate({ to: '/' });
    },
    onError: () => {
      setErrors({ email: 'Registration failed' });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = signUpSchema.safeParse(signUpData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignUpFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);

      return;
    }

    mutation.mutate({ body: signUpData });
  };

  return {
    signUpData,
    errors,
    isPending: mutation.isPending,
    handleChange,
    handleSubmit,
  };
};
