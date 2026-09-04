import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';
import { Input, Label, FieldError } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { resetPasswordRequest } from '../services/auth.service.js';
import { resetPasswordFormSchema } from '../lib/validation/authSchemas.js';
import { parseApiError } from '../lib/apiError.js';
import { useToast } from '../components/ui/toast/ToastContext.jsx';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordFormSchema) });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await resetPasswordRequest({ token, newPassword: values.newPassword });
      toast({ title: 'Password reset', description: 'Please log in with your new password.', variant: 'success' });
      navigate('/login', { replace: true });
    } catch (err) {
      const { message } = parseApiError(err);
      // The backend deliberately returns a generic "invalid or expired"
      // message here (no distinction between "wrong token" and "token
      // expired") — nothing more specific to show, so surfacing the
      // server's own message as-is is correct.
      toast({ title: 'Could not reset password', description: message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid reset link</CardTitle>
          <CardDescription>
            This link is missing its reset token. Request a new one below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Request a new reset link
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              {...register('newPassword')}
            />
            <FieldError message={errors.newPassword?.message} />
          </div>
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Reset password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
