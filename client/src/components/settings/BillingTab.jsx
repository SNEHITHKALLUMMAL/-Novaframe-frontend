import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { CreditCard } from 'lucide-react';

export function BillingTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Manage your subscription and payment methods.</CardDescription>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={CreditCard}
          title="No billing configured"
          description="Billing and subscription features will be available soon."
        />
      </CardContent>
    </Card>
  );
}
