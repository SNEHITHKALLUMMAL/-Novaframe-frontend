import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';
import { Input, Label, FieldError } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { loginFormSchema } from '../lib/validation/authSchemas.js';
import { parseApiError } from '../lib/apiError.js';
import { useToast } from '../components/ui/toast/ToastContext.jsx';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginFormSchema) });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast({ title: 'Welcome back', variant: 'success' });
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true });
    } catch (err) {
      const { message, fieldErrors } = parseApiError(err);
      Object.entries(fieldErrors).forEach(([field, msg]) =>
        setError(field, { type: 'server', message: msg })
      );
      if (!Object.keys(fieldErrors).length) {
        toast({ title: 'Login failed', description: message, variant: 'destructive' });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Welcome back — enter your details to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
            />
            <FieldError message={errors.password?.message} />
          </div>
          <Button type="submit" className="w-full" isLoading={isLoggingIn}>
            Log in
          </Button>
        </form>
        <p className="text-sm text-muted-foreground text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
