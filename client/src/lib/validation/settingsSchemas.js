import { z } from 'zod';

export const profileFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
});

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters').max(128),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const deleteAccountFormSchema = z.object({
  password: z.string().min(1, 'Enter your password to confirm'),
});
