import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Clapperboard, X } from 'lucide-react';

import { fetchVideos, renameVideo, deleteVideo, assignVideoProject } from '../services/video.service.js';
import { fetchProjects } from '../services/project.service.js';
import { Input } from '../components/ui/Input.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Button } from '../components/ui/Button.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { PromptDialog } from '../components/ui/PromptDialog.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { useToast } from '../components/ui/toast/ToastContext.jsx';
import { VideoCard } from '../components/library/VideoCard.jsx';
import { VideoPreviewDialog } from '../components/library/VideoPreviewDialog.jsx';
import { parseApiError } from '../lib/apiError.js';

export default function LibraryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const projectFilter = searchParams.get('project') ?? '';
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const [previewVideo, setPreviewVideo] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Debounce free-text search so we don't refetch on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  const videosQuery = useQuery({
    queryKey: ['videos', { search, type, status, projectFilter, sort, page }],
    queryFn: () =>
      fetchVideos({
        search: search || undefined,
        type: type || undefined,
        status: status || undefined,
        projectId: projectFilter || undefined,
        sort,
        page,
      }),
    placeholderData: (prev) => prev,
  });

  const invalidateVideos = () => queryClient.invalidateQueries({ queryKey: ['videos'] });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }) => renameVideo(id, title),
    onSuccess: () => {
      invalidateVideos();
      setRenameTarget(null);
      toast({ title: 'Video renamed' });
    },
    onError: (err) => toast({ title: 'Rename failed', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteVideo(id),
    onSuccess: () => {
      invalidateVideos();
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
      setDeleteTarget(null);
      toast({ title: 'Video deleted' });
    },
    onError: (err) => toast({ title: 'Delete failed', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const moveMutation = useMutation({
    mutationFn: ({ id, projectId }) => assignVideoProject(id, projectId),
    onSuccess: () => {
      invalidateVideos();
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Video moved' });
    },
    onError: (err) => toast({ title: 'Move failed', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const clearProjectFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('project');
    setSearchParams(next);
    setPage(1);
  };

  const activeProject = projectsQuery.data?.find((p) => p._id === projectFilter);
  const total = videosQuery.data?.total ?? 0;
  const limit = videosQuery.data?.limit ?? 24;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Video Library</h1>
        <p className="text-muted-foreground">Search, filter, and manage everything you've generated.</p>
      </div>

      {activeProject && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filtered by project:</span>
          <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 flex items-center gap-1.5">
            {activeProject.name}
            <button onClick={clearProjectFilter} aria-label="Clear project filter">
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or prompt..."
            className="pl-9"
          />
        </div>
        <Select aria-label="Filter by type" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="w-auto">
          <option value="">All types</option>
          <option value="text-to-video">Text to Video</option>
          <option value="image-to-video">Image to Video</option>
          <option value="text-image-to-video">Text + Image</option>
        </Select>
        <Select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-auto">
          <option value="">All statuses</option>
          <option value="ready">Ready</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </Select>
        <Select aria-label="Sort order" value={sort} onChange={(e) => setSort(e.target.value)} className="w-auto">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title (A-Z)</option>
        </Select>
      </div>

      {videosQuery.isLoading && <LoadingState label="Loading your videos…" />}
      {videosQuery.isError && (
        <ErrorState onRetry={videosQuery.refetch} description="Couldn't load your video library." />
      )}

      {videosQuery.data && videosQuery.data.videos.length === 0 && (
        <EmptyState
          icon={Clapperboard}
          title="No videos found"
          description="Try adjusting your filters, or generate your first video."
        />
      )}

      {videosQuery.data && videosQuery.data.videos.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {videosQuery.data.videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                projects={projectsQuery.data ?? []}
                onPreview={setPreviewVideo}
                onRename={setRenameTarget}
                onDelete={setDeleteTarget}
                onMove={(v, projectId) => moveMutation.mutate({ id: v._id, projectId })}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <VideoPreviewDialog video={previewVideo} onClose={() => setPreviewVideo(null)} />

      <PromptDialog
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        onSubmit={(title) => renameMutation.mutate({ id: renameTarget._id, title })}
        title="Rename video"
        label="Title"
        initialValue={renameTarget?.title ?? ''}
        isLoading={renameMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        title="Delete video"
        description={`This will permanently delete "${deleteTarget?.title}" and its file. This can't be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
