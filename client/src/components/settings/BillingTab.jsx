import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import {
  fetchPlans,
  fetchMySubscription,
  createRazorpayOrder,
  verifyRazorpayPayment,
  cancelSubscription,
  reactivateSubscription,
} from '../../services/subscription.service.js';
import { Check, X, CreditCard, Zap, Infinity, ArrowLeft } from 'lucide-react';

const PLAN_ICONS = {
  free: X,
  pro: Zap,
  unlimited: Infinity,
};

const PLAN_COLORS = {
  free: 'border-border',
  pro: 'border-primary',
  unlimited: 'border-accent',
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function BillingTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedBillingCycle, setSelectedBillingCycle] = useState('monthly');
  const [processingPlan, setProcessingPlan] = useState(null);

  const checkoutResult = searchParams.get('checkout');

  const {
    data: plans = [],
    isLoading: plansLoading,
  } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  });

  const {
    data: subscriptionData,
    isLoading: subLoading,
  } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: fetchMySubscription,
  });

  const subscription = subscriptionData?.subscription;
  const currentPlan = subscription?.plan || 'free';

  // Handle checkout result redirect
  useEffect(() => {
    if (checkoutResult === 'success') {
      toast({ title: 'Payment successful!', description: 'Your subscription has been activated.' });
      queryClient.invalidateQueries({ queryKey: ['mySubscription'] });
      setSearchParams({});
    } else if (checkoutResult === 'cancelled') {
      toast({ title: 'Payment cancelled', description: 'Your subscription was not changed.', variant: 'destructive' });
      setSearchParams({});
    }
  }, [checkoutResult, toast, queryClient, setSearchParams]);

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast({ title: 'Subscription cancelled', description: 'Your subscription will end at the current period.' });
      queryClient.invalidateQueries({ queryKey: ['mySubscription'] });
    },
    onError: (err) => {
      toast({
        title: 'Cancellation failed',
        description: err.response?.data?.message || 'Could not cancel subscription.',
        variant: 'destructive',
      });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: reactivateSubscription,
    onSuccess: () => {
      toast({ title: 'Subscription reactivated' });
      queryClient.invalidateQueries({ queryKey: ['mySubscription'] });
    },
    onError: (err) => {
      toast({
        title: 'Reactivation failed',
        description: err.response?.data?.message || 'Could not reactivate subscription.',
        variant: 'destructive',
      });
    },
  });

  const handleSubscribe = useCallback(
    async (plan) => {
      if (plan === 'free' || plan === currentPlan) return;

      setProcessingPlan(plan);

      try {
        // Load Razorpay checkout script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast({ title: 'Error', description: 'Failed to load payment gateway. Please try again.', variant: 'destructive' });
          setProcessingPlan(null);
          return;
        }

        // Create order on backend
        const orderData = await createRazorpayOrder({
          plan,
          billingCycle: selectedBillingCycle,
        });

        // Open Razorpay checkout popup
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'BrightBots NovaFrame',
          description: `NovaFrame ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan (${selectedBillingCycle})`,
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              toast({ title: 'Payment successful!', description: 'Your subscription has been activated.' });
              queryClient.invalidateQueries({ queryKey: ['mySubscription'] });
            } catch (verifyErr) {
              toast({
                title: 'Verification failed',
                description: verifyErr.response?.data?.message || 'Payment was made but verification failed. Contact support.',
                variant: 'destructive',
              });
            }
            setProcessingPlan(null);
          },
          prefill: {
            name: '',
            email: '',
          },
          theme: {
            color: '#0284c7',  // Sky blue primary matching BrightBots theme
          },
          modal: {
            ondismiss: function () {
              toast({ title: 'Payment cancelled', description: 'Your subscription was not changed.' });
              setProcessingPlan(null);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response) {
          toast({
            title: 'Payment failed',
            description: response.error?.description || 'Payment could not be completed.',
            variant: 'destructive',
          });
          setProcessingPlan(null);
        });
        razorpay.open();
      } catch (err) {
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'Could not start checkout.',
          variant: 'destructive',
        });
        setProcessingPlan(null);
      }
    },
    [currentPlan, selectedBillingCycle, queryClient, toast]
  );

  if (plansLoading || subLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Current subscription */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {subscription.plan === 'free' ? 'Free' : subscription.plan === 'pro' ? 'Pro' : 'Unlimited'}
                  {subscription.billingCycle === 'yearly' ? ' (Yearly)' : ' (Monthly)'}
                </p>
                {subscription.cancelAtPeriodEnd && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Cancels at end of current period
                  </p>
                )}
                {subscription.currentPeriodEnd && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {subscription.cancelAtPeriodEnd ? 'Ends' : 'Renews'}:{' '}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {subscription.plan !== 'free' && !subscription.cancelAtPeriodEnd && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isPending}
                  >
                    Cancel Plan
                  </Button>
                )}
                {subscription.cancelAtPeriodEnd && (
                  <Button
                    size="sm"
                    onClick={() => reactivateMutation.mutate()}
                    disabled={reactivateMutation.isPending}
                  >
                    Reactivate
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing cycle toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-md border border-border bg-secondary p-1">
          <button
            type="button"
            onClick={() => setSelectedBillingCycle('monthly')}              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
              selectedBillingCycle === 'monthly'
                ? 'bg-card text-foreground shadow-sm border border-border/50'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setSelectedBillingCycle('yearly')}              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
              selectedBillingCycle === 'yearly'
                ? 'bg-card text-foreground shadow-sm border border-border/50'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = PLAN_ICONS[plan.id] || CreditCard;
          const isCurrentPlan = plan.id === currentPlan;
          const price =
            selectedBillingCycle === 'yearly' ? plan.priceYearlyCents : plan.priceMonthlyCents;
          const isPopular = plan.id === 'pro';

          return (
            <Card
              key={plan.id}
              className={`relative ${PLAN_COLORS[plan.id]} ${
                isPopular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-3xl font-bold">
                    {price === 0 ? 'Free' : `₹${(price / 100).toLocaleString()}`}
                  </span>
                  {price > 0 && (
                    <span className="text-sm text-muted-foreground">
                      /{selectedBillingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  )}
                </div>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>
                      {plan.generationsPerMonth === null
                        ? 'Unlimited generations'
                        : `${plan.generationsPerMonth} generations/month`}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{plan.maxDurationSeconds}s max duration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{plan.maxResolution} resolution</span>
                  </li>
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : 'default'}
                  disabled={isCurrentPlan || processingPlan === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : processingPlan === plan.id
                    ? 'Processing...'
                    : price === 0
                    ? 'Switch to Free'
                    : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
