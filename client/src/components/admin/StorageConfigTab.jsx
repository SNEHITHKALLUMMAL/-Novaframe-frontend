import { useQuery } from '@tanstack/react-query';
import { fetchAdminStorage, fetchAdminConfig } from '../../services/admin.service.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';

function formatBytes(bytes) {
  if (!bytes) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb > 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`;
}

export function StorageConfigTab() {
  const storageQuery = useQuery({ queryKey: ['admin', 'storage'], queryFn: fetchAdminStorage });
  const configQuery = useQuery({ queryKey: ['admin', 'config'], queryFn: fetchAdminConfig });

  if (storageQuery.isLoading || configQuery.isLoading) {
    return <LoadingState label="Loading system info…" />;
  }
  if (storageQuery.isError || configQuery.isError) {
    return (
      <ErrorState
        onRetry={() => { storageQuery.refetch(); configQuery.refetch(); }}
        description="Couldn't load system info."
      />
    );
  }

  const storage = storageQuery.data;
  const config = configQuery.data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Storage usage</CardTitle>
          <CardDescription>Real totals from stored file sizes — not an estimate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total used</span>
            <span className="text-foreground font-medium">{formatBytes(storage.totalBytes)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Videos ({storage.videos.count})</span>
            <span className="text-foreground">{formatBytes(storage.videos.totalBytes)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Uploads ({storage.uploads.count})</span>
            <span className="text-foreground">{formatBytes(storage.uploads.totalBytes)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System configuration</CardTitle>
          <CardDescription>
            Read-only — these are environment variables, changing them requires a server restart.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {Object.entries(config.resourceLimits).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-muted-foreground">{key}</span>
              <span className="text-foreground font-mono text-xs">{String(value)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
            <span className="text-muted-foreground">Storage provider</span>
            <span className="text-foreground">{config.storageProvider}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment provider</span>
            <span className="text-foreground">{config.paymentProvider}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Wan adapter</span>
            <span className="text-foreground">{config.wanAdapterEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
