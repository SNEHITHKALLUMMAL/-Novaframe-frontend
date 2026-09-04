import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Plus, Pencil, Trash2 } from 'lucide-react';

import { fetchProjects, createProject, updateProject, deleteProject } from '../services/project.service.js';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { PromptDialog } from '../components/ui/PromptDialog.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { useToast } from '../components/ui/toast/ToastContext.jsx';
import { parseApiError } from '../lib/apiError.js';

export default function ProjectsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['projects'] });

  const createMutation = useMutation({
    mutationFn: (name) => createProject({ name }),
    onSuccess: () => {
      invalidate();
      setCreateOpen(false);
      toast({ title: 'Project created' });
    },
    onError: (err) => toast({ title: 'Could not create project', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, name }) => updateProject(id, { name }),
    onSuccess: () => {
      invalidate();
      setRenameTarget(null);
      toast({ title: 'Project renamed' });
    },
    onError: (err) => toast({ title: 'Rename failed', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setDeleteTarget(null);
      toast({ title: 'Project deleted' });
    },
    onError: (err) => toast({ title: 'Delete failed', description: parseApiError(err).message, variant: 'destructive' }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Group your generations into projects.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      {projectsQuery.isLoading && <LoadingState label="Loading your projects…" />}
      {projectsQuery.isError && (
        <ErrorState onRetry={projectsQuery.refetch} description="Couldn't load your projects." />
      )}

      {projectsQuery.data && projectsQuery.data.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create a project to start organizing your generated videos."
          actionLabel="New project"
          onAction={() => setCreateOpen(true)}
        />
      )}

      {projectsQuery.data && projectsQuery.data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsQuery.data.map((project) => (
            <Card key={project._id}>
              <CardContent className="p-5 space-y-3">
                <Link to={`/library?project=${project._id}`} className="block">
                  <p className="font-medium text-foreground hover:text-primary transition-colors truncate">
                    {project.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {project.videoCount} {project.videoCount === 1 ? 'video' : 'videos'}
                  </p>
                </Link>
                <div className="flex items-center gap-1 pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setRenameTarget(project)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Rename
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive-text hover:text-destructive-text"
                    onClick={() => setDeleteTarget(project)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PromptDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(name) => createMutation.mutate(name)}
        title="New project"
        label="Project name"
        submitLabel="Create"
        isLoading={createMutation.isPending}
      />

      <PromptDialog
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        onSubmit={(name) => renameMutation.mutate({ id: renameTarget._id, name })}
        title="Rename project"
        label="Project name"
        initialValue={renameTarget?.name ?? ''}
        isLoading={renameMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        title="Delete project"
        description={`"${deleteTarget?.name}" will be deleted. Videos inside it are kept, just unfiled.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
