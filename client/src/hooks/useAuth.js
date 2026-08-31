import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../services/auth.service.js';
import { isRefreshing } from '../services/apiClient.js';
import { setUser, clearUser } from '../store/slices/authSlice.js';

/**
 * Single hook every auth-aware component uses. Wraps the "who am I" query
 * (runs once on app load, and after login/register/logout to keep the
 * server as the source of truth) plus mutations for register/login/logout,
 * syncing results into the authSlice so components that only need
 * `status`/`user` (e.g. Topbar's AccountMenu) don't have to know about
 * TanStack Query at all.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user, status } = useSelector((state) => state.auth);

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (meQuery.isSuccess) {
      dispatch(setUser(meQuery.data));
    } else if (meQuery.isError) {
      // Don't dispatch clearUser() while the interceptor is refreshing —
      // the retried /auth/me request will resolve shortly and set the
      // user. Dispatching clearUser() here would flip status to
      // 'unauthenticated' prematurely, causing ProtectedRoute to flash a
      // redirect to /login even though the refresh will succeed.
      if (!isRefreshing()) {
        dispatch(clearUser());
      }
    }
  }, [meQuery.isSuccess, meQuery.isError, meQuery.data, dispatch]);

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (registeredUser) => {
      dispatch(setUser(registeredUser));
      queryClient.setQueryData(['auth', 'me'], registeredUser);
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (loggedInUser) => {
      dispatch(setUser(loggedInUser));
      queryClient.setQueryData(['auth', 'me'], loggedInUser);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
    },
  });

  return {
    user,
    status, // 'unknown' | 'authenticated' | 'unauthenticated'
    isCheckingAuth: meQuery.isLoading,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
