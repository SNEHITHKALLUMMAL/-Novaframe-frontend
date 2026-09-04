import { X } from 'lucide-react';

export function VideoPreviewDialog({ video, onClose }) {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="relative w-full max-w-3xl mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white"
          aria-label="Close preview"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="rounded-lg overflow-hidden bg-black">
          {video.videoUrl ? (
            <video
              controls
              autoPlay
              className="w-full"
              src={video.videoUrl}
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-white/50">
              <p className="text-sm">No video available</p>
            </div>
          )}
        </div>
        <div className="mt-3 text-white/80">
          <p className="text-sm font-medium">{video.title}</p>
          {video.prompt && <p className="text-xs text-white/50 mt-1">{video.prompt}</p>}
        </div>
      </div>
    </div>
  );
}
