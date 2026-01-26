import { z } from 'zod';

const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^a-zA-Z0-9]/,
    'Password must contain at least one special character'
  );

export const signUpSchema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: strongPasswordSchema,
    confirmation_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmation_password, {
    message: 'Passwords do not match',
    path: ['confirmation_password'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
