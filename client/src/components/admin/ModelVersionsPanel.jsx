import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { fetchModelVersions, createModelVersion, deleteModelVersion } from '../../services/admin.service.js';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import { parseApiError } from '../../lib/apiError.js';

export function ModelVersionsPanel({ modelId }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newVersion, setNewVersion] = useState('');

  const versionsQuery = useQuery({
    queryKey: ['admin', 'model-versions', modelId],
    queryFn: () => fetchModelVersions(modelId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'model-versions', modelId] });

  const createMutation = useMutation({
    mutationFn: (version) => createModelVersion(modelId, { version }),
    onSuccess: () => {
      invalidate();
      setNewVersion('');
      toast({ title: 'Version added' });
    },
    onError: (err) => toast({ title: 'Could not add version', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (versionId) => deleteModelVersion(versionId),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Version removed' });
    },
    onError: (err) => toast({ title: 'Could not remove version', description: parseApiError(err).message, variant: 'destructive' }),
  });

  if (versionsQuery.isLoading) return <LoadingState label="Loading versions…" />;

  return (
    <div className="space-y-3 pt-3 border-t border-border">
      {versionsQuery.data?.length === 0 && (
        <p className="text-xs text-muted-foreground">No versions recorded yet.</p>
      )}
      {versionsQuery.data?.map((v) => (
        <div key={v._id} className="flex items-center justify-between text-sm">
          <span className="text-foreground font-mono text-xs">{v.version}</span>
          <button
            onClick={() => deleteMutation.mutate(v._id)}
            aria-label="Delete version"
            className="p-1 rounded-md text-muted-foreground hover:text-destructive-text hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newVersion.trim()) createMutation.mutate(newVersion.trim());
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={newVersion}
          onChange={(e) => setNewVersion(e.target.value)}
          placeholder="e.g. 2.2.1"
          className="h-8 text-xs"
        />
        <Button type="submit" size="sm" variant="outline" isLoading={createMutation.isPending}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </form>
    </div>
  );
}
