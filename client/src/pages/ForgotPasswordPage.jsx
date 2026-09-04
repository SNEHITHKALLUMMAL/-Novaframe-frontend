import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';
import { Input, Label, FieldError } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { forgotPasswordRequest } from '../services/auth.service.js';
import { forgotPasswordFormSchema } from '../lib/validation/authSchemas.js';
import { parseApiError } from '../lib/apiError.js';
import { useToast } from '../components/ui/toast/ToastContext.jsx';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordFormSchema) });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await forgotPasswordRequest(values);
      // Always shows success, regardless of whether the email matched an
      // account — mirrors the backend's deliberately enumeration-safe
      // response (server's docs/SESSIONS.md). There is no "wrong email"
      // error state to show here; that's the point.
      setSubmitted(true);
    } catch (err) {
      const { message } = parseApiError(err);
      toast({ title: 'Something went wrong', description: message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            If an account exists for that email, we've sent a link to reset your password. It
            expires in 15 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/login" className="text-sm text-primary hover:underline">
            Back to log in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            <FieldError message={errors.email?.message} />
          </div>
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Send reset link
          </Button>
        </form>
        <p className="text-sm text-muted-foreground text-center mt-6">
          <Link to="/login" className="text-primary hover:underline">
            Back to log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
