import { Dialog } from '../ui/Dialog.jsx';

export function VideoPreviewDialog({ video, onClose }) {
  return (
    <Dialog open={!!video} onClose={onClose} title={video?.title ?? 'Preview'} className="max-w-2xl">
      {video && (
        <video
          controls
          autoPlay
          className="w-full rounded-md border border-border"
          src={video.fileUrl}
          poster={video.thumbnailUrl}
        />
      )}
    </Dialog>
  );
}
