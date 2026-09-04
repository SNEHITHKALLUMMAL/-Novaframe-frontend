import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';
import { Input, Label, FieldError } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { registerFormSchema } from '../lib/validation/authSchemas.js';
import { parseApiError } from '../lib/apiError.js';
import { useToast } from '../components/ui/toast/ToastContext.jsx';

export default function RegisterPage() {
  const { register: registerAccount, isRegistering } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerFormSchema) });

  const onSubmit = async (values) => {
    try {
      await registerAccount(values);
      toast({ title: 'Account created', description: 'Welcome to NovaFrame!', variant: 'success' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const { message, fieldErrors } = parseApiError(err);
      Object.entries(fieldErrors).forEach(([field, msg]) =>
        setError(field, { type: 'server', message: msg })
      );
      if (!Object.keys(fieldErrors).length) {
        toast({ title: 'Registration failed', description: message, variant: 'destructive' });
      }
    }
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
          <Video className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-xl">Create Your Account</CardTitle>
        <CardDescription>Start generating AI videos in minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" autoComplete="name" placeholder="Your name" {...register('name')} />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              {...register('password')}
            />
            <FieldError message={errors.password?.message} />
          </div>
          <Button type="submit" className="w-full" isLoading={isRegistering}>
            Create Account
          </Button>
        </form>
        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
