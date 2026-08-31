import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { ScrollText } from 'lucide-react';

export function AuditLogTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={ScrollText}
          title="No audit entries"
          description="Audit log entries will appear here."
        />
      </CardContent>
    </Card>
  );
}
