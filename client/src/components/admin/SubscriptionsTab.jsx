import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { CreditCard } from 'lucide-react';

export function SubscriptionsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={CreditCard}
          title="Billing not configured"
          description="Subscription management will be available once payment is set up."
        />
      </CardContent>
    </Card>
  );
}
