import { useCallback, useRef, useState } from 'react';
import { ImagePlus, X, AlertTriangle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '../../services/upload.service.js';
import { parseApiError } from '../../lib/apiError.js';
import { cn } from '../../lib/utils.js';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_CLIENT_SIZE_BYTES = 25 * 1024 * 1024; // mirrors the server default; server is the real limit

/**
 * Client-side checks here (type, size) are a UX nicety to fail fast before
 * spending an upload — the server's sharp-based byte inspection
 * (services/upload.service.js) is the actual security boundary and always
 * re-validates regardless of what this component allows through.
 */
export function ImageUploadField({ value, onChange, error }) {
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState(null);
  const inputRef = useRef(null);

  const uploadMutation = useMutation({
    mutationFn: ({ file, onProgress }) => uploadImage(file, onProgress),
    onSuccess: (result) => {
      onChange(result.file);
    },
    onError: (err) => {
      const { message } = parseApiError(err);
      setLocalError(message);
      setPreview(null);
    },
  });

  const [progress, setProgress] = useState(0);

  const handleFile = useCallback(
    (file) => {
      setLocalError(null);
      if (!file) return;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setLocalError('Use a JPEG, PNG, or WebP image.');
        return;
      }
      if (file.size > MAX_CLIENT_SIZE_BYTES) {
        setLocalError('Image is too large.');
        return;
      }

      setPreview(URL.createObjectURL(file));
      setProgress(0);
      uploadMutation.mutate({ file, onProgress: setProgress });
    },
    [uploadMutation]
  );

  const handleRemove = () => {
    setPreview(null);
    setLocalError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const isUploading = uploadMutation.isPending;
  const displayError = error || localError;

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'w-full aspect-video rounded-md border-2 border-dashed border-input flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors',
            displayError && 'border-destructive text-destructive-text'
          )}
        >
          <ImagePlus className="h-6 w-6" />
          <span className="text-sm">Click to upload an image</span>
          <span className="text-xs">JPEG, PNG, or WebP</span>
        </button>
      ) : (
        <div className="relative rounded-md overflow-hidden border border-border">
          <img src={preview} alt="Upload preview" className="w-full aspect-video object-cover" />
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm">
              Uploading… {progress}%
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove image"
              className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!isUploading && value && (
            <span className="absolute bottom-2 left-2 rounded-full bg-emerald-500/90 px-2 py-0.5 text-xs text-white">
              Ready
            </span>
          )}
        </div>
      )}

      {displayError && (
        <p className="text-sm text-destructive-text flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          {displayError}
        </p>
      )}
    </div>
  );
}
