import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import {
  fetchAdminModels,
  updateAdminModel,
  createAdminModel,
  deleteAdminModel,
  fetchAvailableAdapters,
} from '../../services/admin.service.js';
import { Card, CardContent } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import { parseApiError } from '../../lib/apiError.js';
import { ModelFormDialog } from './ModelFormDialog.jsx';
import { ModelVersionsPanel } from './ModelVersionsPanel.jsx';

export function ModelsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create mode
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [formError, setFormError] = useState(null);

  const modelsQuery = useQuery({ queryKey: ['admin', 'models'], queryFn: fetchAdminModels });
  const adaptersQuery = useQuery({ queryKey: ['admin', 'adapters'], queryFn: fetchAvailableAdapters });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'models'] });

  const toggleMutation = useMutation({
    mutationFn: ({ id, updates }) => updateAdminModel(id, updates),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Model updated' });
    },
    onError: (err) => toast({ title: 'Could not update model', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const createMutation = useMutation({
    mutationFn: createAdminModel,
    onSuccess: () => {
      invalidate();
      setFormOpen(false);
      setFormError(null);
      toast({ title: 'Model created' });
    },
    onError: (err) => setFormError(parseApiError(err).message),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, updates }) => updateAdminModel(id, updates),
    onSuccess: () => {
      invalidate();
      setFormOpen(false);
      setEditTarget(null);
      setFormError(null);
      toast({ title: 'Model updated' });
    },
    onError: (err) => setFormError(parseApiError(err).message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminModel(id),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
      toast({ title: 'Model deleted' });
    },
    onError: (err) => toast({ title: 'Could not delete model', description: parseApiError(err).message, variant: 'destructive' }),
  });

  if (modelsQuery.isLoading) return <LoadingState label="Loading models…" />;
  if (modelsQuery.isError) return <ErrorState onRetry={modelsQuery.refetch} description="Couldn't load models." />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditTarget(null);
            setFormError(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New model
        </Button>
      </div>

      {modelsQuery.data.length === 0 ? (
        <EmptyState title="No models configured" description="Run the seed scripts or create one." />
      ) : (
        modelsQuery.data.map((model) => (
          <Card key={model._id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground">{model.name}</p>
                    {model.isDefault && (
                      <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">Default</span>
                    )}
                    <span
                      className={
                        model.isEnabled
                          ? 'text-xs rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5'
                          : 'text-xs rounded-full bg-secondary text-muted-foreground px-2 py-0.5'
                      }
                    >
                      {model.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {model.modelId} · adapter: {model.adapterKey} · {model.license}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    isLoading={toggleMutation.isPending && toggleMutation.variables?.id === model._id}
                    onClick={() => toggleMutation.mutate({ id: model._id, updates: { isEnabled: !model.isEnabled } })}
                  >
                    {model.isEnabled ? 'Disable' : 'Enable'}
                  </Button>
                  {!model.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMutation.mutate({ id: model._id, updates: { isDefault: true } })}
                    >
                      Make default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditTarget(model);
                      setFormError(null);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive-text hover:text-destructive-text"
                    onClick={() => setDeleteTarget(model)}
                  >
                    Delete
                  </Button>
                  <button
                    onClick={() => setExpandedId(expandedId === model._id ? null : model._id)}
                    aria-label="Toggle versions"
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    {expandedId === model._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {expandedId === model._id && <ModelVersionsPanel modelId={model._id} />}
            </CardContent>
          </Card>
        ))
      )}

      <ModelFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
          setFormError(null);
        }}
        onSubmit={(payload) =>
          editTarget
            ? editMutation.mutate({ id: editTarget._id, updates: payload })
            : createMutation.mutate(payload)
        }
        model={editTarget}
        availableAdapters={adaptersQuery.data}
        isLoading={createMutation.isPending || editMutation.isPending}
        error={formError}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        title="Delete model"
        description={`"${deleteTarget?.name}" will be permanently removed. Past generations that used it are kept.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
