import { Play, Download, Pencil, Trash2, Clapperboard } from 'lucide-react';
import { StatusBadge } from '../StatusBadge.jsx';
import { Select } from '../ui/Select.jsx';

const TYPE_LABELS = {
  'text-to-video': 'Text to Video',
  'image-to-video': 'Image to Video',
  'text-image-to-video': 'Text + Image',
};

export function VideoCard({ video, projects, onPreview, onRename, onDelete, onMove }) {
  return (
    <div className="group rounded-md overflow-hidden border border-border bg-card">
      <button
        onClick={() => onPreview(video)}
        className="relative block w-full aspect-video bg-secondary"
        aria-label={`Preview ${video.title}`}
      >
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Clapperboard className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="absolute top-2 left-2">
          <StatusBadge status={video.status} />
        </span>
      </button>

      <div className="p-3 space-y-2">
        <div>
          <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
          <p className="text-xs text-muted-foreground">
            {TYPE_LABELS[video.type] ?? video.type} · {video.resolution ?? '—'} ·{' '}
            {video.durationSeconds ? `${video.durationSeconds}s` : '—'}
          </p>
        </div>

        <Select
          aria-label={`Move "${video.title}" to a project`}
          value={video.project?._id ?? video.project ?? ''}
          onChange={(e) => onMove(video, e.target.value || null)}
          className="h-8 text-xs"
        >
          <option value="">Unfiled</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </Select>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <a
              href={video.fileUrl}
              download
              aria-label="Download video"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={() => onRename(video)}
              aria-label="Rename video"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => onDelete(video)}
            aria-label="Delete video"
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive-text hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
