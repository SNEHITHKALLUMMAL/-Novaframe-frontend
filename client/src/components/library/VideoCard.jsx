import { MoreHorizontal, Pencil, Trash2, FolderInput } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '../StatusBadge.jsx';
import { Button } from '../ui/Button.jsx';
import { cn } from '../../lib/utils.js';

export function VideoCard({ video, projects = [], onPreview, onRename, onDelete, onMove }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden">
      <div
        className="aspect-video bg-secondary cursor-pointer relative"
        onClick={() => onPreview?.(video)}
      >
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-xs">No preview</span>
          </div>
        )}
        <span className="absolute top-2 right-2">
          <StatusBadge status={video.status} />
        </span>
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
        <p className="text-xs text-muted-foreground truncate">{video.type || 'Video'}</p>
      </div>
      <div className="px-3 pb-3 flex justify-end">
        <div className="relative">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMenuOpen(!menuOpen)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 bottom-full mb-1 w-36 rounded-md border border-border bg-card shadow-lg z-20 py-1">
                <button
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-foreground hover:bg-accent"
                  onClick={() => { onPreview?.(video); setMenuOpen(false); }}
                >
                  Preview
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-foreground hover:bg-accent"
                  onClick={() => { onRename?.(video); setMenuOpen(false); }}
                >
                  <Pencil className="h-3.5 w-3.5" /> Rename
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-foreground hover:bg-accent"
                  onClick={() => { onMove?.(video); setMenuOpen(false); }}
                >
                  <FolderInput className="h-3.5 w-3.5" /> Move
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-destructive-text hover:bg-accent"
                  onClick={() => { onDelete?.(video); setMenuOpen(false); }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
