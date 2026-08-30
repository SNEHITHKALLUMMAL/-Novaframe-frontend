import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card.jsx';
import { Input, Label, FieldError } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';

import { updateMyProfile, changeMyPassword, deleteMyAccount } from '../../services/user.service.js';
import {
  profileFormSchema,
  passwordFormSchema,
  deleteAccountFormSchema,
} from '../../lib/validation/settingsSchemas.js';
import { parseApiError } from '../../lib/apiError.js';

export function ProfileTab() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState(null);

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => toast({ title: 'Profile updated' }),
    onError: (err) => toast({ title: 'Update failed', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const changePasswordMutation = useMutation({
    mutationFn: changeMyPassword,
    onSuccess: async () => {
      toast({ title: 'Password changed', description: 'Please log in again.' });
      passwordForm.reset();
      await logout();
      navigate('/login', { replace: true });
    },
    onError: (err) => {
      const { message, fieldErrors } = parseApiError(err);
      Object.entries(fieldErrors).forEach(([field, msg]) => passwordForm.setError(field, { message: msg }));
      if (!Object.keys(fieldErrors).length) {
        toast({ title: 'Password change failed', description: message, variant: 'destructive' });
      }
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: async () => {
      await logout();
      navigate('/', { replace: true });
    },
    onError: (err) => setDeleteError(parseApiError(err).message),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit((values) => updateProfileMutation.mutate(values))}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-1.5 max-w-sm">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...profileForm.register('name')} />
              <FieldError message={profileForm.formState.errors.name?.message} />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <Label>Email</Label>
              <Input value={user?.email ?? ''} disabled />
            </div>
            <Button type="submit" isLoading={updateProfileMutation.isPending}>
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>You'll be logged out on other devices after this.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit((values) => changePasswordMutation.mutate(values))}
            className="space-y-4 max-w-sm"
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input id="currentPassword" type="password" {...passwordForm.register('currentPassword')} />
              <FieldError message={passwordForm.formState.errors.currentPassword?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" type="password" {...passwordForm.register('newPassword')} />
              <FieldError message={passwordForm.formState.errors.newPassword?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input id="confirmPassword" type="password" {...passwordForm.register('confirmPassword')} />
              <FieldError message={passwordForm.formState.errors.confirmPassword?.message} />
            </div>
            <Button type="submit" isLoading={changePasswordMutation.isPending}>
              Change password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive-text">Delete account</CardTitle>
          <CardDescription>This deactivates your account. This can't be undone from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete my account
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeletePassword('');
          setDeleteError(null);
        }}
        onConfirm={() => {
          const result = deleteAccountFormSchema.safeParse({ password: deletePassword });
          if (!result.success) {
            setDeleteError(result.error.issues[0]?.message ?? 'Invalid password');
            return;
          }
          deleteAccountMutation.mutate(deletePassword);
        }}
        title="Delete your account?"
        isLoading={deleteAccountMutation.isPending}
        confirmLabel="Delete account"
        description={
          <div className="space-y-3">
            <p>Enter your password to confirm. This action can't be undone.</p>
            <Input
              type="password"
              placeholder="Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              autoFocus
            />
            {deleteError && <p className="text-sm text-destructive-text">{deleteError}</p>}
          </div>
        }
      />
    </div>
  );
}
