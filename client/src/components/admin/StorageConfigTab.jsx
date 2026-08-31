import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { HardDrive } from 'lucide-react';

export function StorageConfigTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage & Config</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={HardDrive}
          title="Storage configuration"
          description="Storage provider settings will be shown here."
        />
      </CardContent>
    </Card>
  );
}
