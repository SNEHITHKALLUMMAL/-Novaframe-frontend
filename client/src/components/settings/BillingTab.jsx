import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { ProgressBar } from '../ProgressBar.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';

import { fetchPlans, fetchMySubscription, subscribeToPlan, cancelSubscription, reactivateSubscription } from '../../services/subscription.service.js';
import { fetchMyUsage } from '../../services/usage.service.js';
import { fetchPayments } from '../../services/payment.service.js';
import { parseApiError } from '../../lib/apiError.js';
import { cn } from '../../lib/utils.js';

function formatCents(cents) {
  return cents === 0 ? 'Free' : `$${(cents / 100).toFixed(2)}`;
}

export function BillingTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const plansQuery = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
    staleTime: 10 * 60 * 1000, // plan definitions are a static in-code constant server-side
  });
  const subscriptionQuery = useQuery({ queryKey: ['subscription'], queryFn: fetchMySubscription });
  const usageQuery = useQuery({ queryKey: ['usage'], queryFn: fetchMyUsage });
  const paymentsQuery = useQuery({ queryKey: ['payments'], queryFn: fetchPayments });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['subscription'] });
    queryClient.invalidateQueries({ queryKey: ['usage'] });
    queryClient.invalidateQueries({ queryKey: ['payments'] });
  };

  const subscribeMutation = useMutation({
    mutationFn: (plan) => subscribeToPlan({ plan, billingCycle: 'monthly' }),
    onSuccess: () => {
      invalidateAll();
      toast({ title: 'Plan updated', variant: 'success' });
    },
    onError: (err) => toast({ title: 'Could not change plan', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      invalidateAll();
      toast({ title: 'Subscription will cancel at period end' });
    },
    onError: (err) => toast({ title: 'Could not cancel', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const reactivateMutation = useMutation({
    mutationFn: reactivateSubscription,
    onSuccess: () => {
      invalidateAll();
      toast({ title: 'Subscription reactivated' });
    },
    onError: (err) => toast({ title: 'Could not reactivate', description: parseApiError(err).message, variant: 'destructive' }),
  });

  if (plansQuery.isLoading || subscriptionQuery.isLoading) {
    return <LoadingState label="Loading billing information…" />;
  }
  if (plansQuery.isError || subscriptionQuery.isError) {
    return <ErrorState onRetry={() => { plansQuery.refetch(); subscriptionQuery.refetch(); }} description="Couldn't load billing information." />;
  }

  const { subscription, planDefinition } = subscriptionQuery.data;
  const usage = usageQuery.data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">{planDefinition.name}</p>
              <p className="text-sm text-muted-foreground">
                Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                {subscription.cancelAtPeriodEnd && ' — cancels at period end'}
              </p>
            </div>
            {subscription.plan !== 'free' && (
              subscription.cancelAtPeriodEnd ? (
                <Button variant="outline" onClick={() => reactivateMutation.mutate()} isLoading={reactivateMutation.isPending}>
                  Reactivate
                </Button>
              ) : (
                <Button variant="outline" onClick={() => cancelMutation.mutate()} isLoading={cancelMutation.isPending}>
                  Cancel plan
                </Button>
              )
            )}
          </div>

          {usage && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Generations this period</span>
                <span className="text-foreground">
                  {usage.generationsUsed} {usage.generationsLimit !== null ? `/ ${usage.generationsLimit}` : '(unlimited)'}
                </span>
              </div>
              {usage.generationsLimit !== null && (
                <ProgressBar percent={(usage.generationsUsed / usage.generationsLimit) * 100} />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plansQuery.data.map((plan) => {
          const isCurrent = plan.id === subscription.plan;
          return (
            <Card key={plan.id} className={cn(isCurrent && 'border-primary')}>
              <CardContent className="p-5 space-y-3">
                <div>
                  <p className="font-semibold text-foreground">{plan.name}</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {formatCents(plan.priceMonthlyCents)}
                    {plan.priceMonthlyCents > 0 && <span className="text-sm text-muted-foreground">/mo</span>}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {plan.generationsPerMonth === null ? 'Unlimited generations' : `${plan.generationsPerMonth} generations/mo`}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    Up to {plan.maxDurationSeconds}s clips
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    Up to {plan.maxResolution}
                  </li>
                </ul>
                <Button
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                  disabled={isCurrent}
                  isLoading={subscribeMutation.isPending && subscribeMutation.variables === plan.id}
                  onClick={() => subscribeMutation.mutate(plan.id)}
                >
                  {isCurrent ? 'Current plan' : 'Choose plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment history</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentsQuery.isLoading && <LoadingState label="Loading payment history…" />}
          {paymentsQuery.data && paymentsQuery.data.length === 0 && (
            <p className="text-sm text-muted-foreground">No payments yet.</p>
          )}
          {paymentsQuery.data && paymentsQuery.data.length > 0 && (
            <div className="divide-y divide-border">
              {paymentsQuery.data.map((payment) => (
                <div key={payment._id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-foreground">{formatCents(payment.amount)}</span>
                  <span className={cn('capitalize', payment.status === 'succeeded' ? 'text-emerald-400' : 'text-destructive-text')}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
