import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { Cpu } from 'lucide-react';

export function ModelsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Models</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={Cpu}
          title="Model configuration"
          description="AI model management will be available when models are configured."
        />
      </CardContent>
    </Card>
  );
}
