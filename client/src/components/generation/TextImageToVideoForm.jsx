import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Wand2 } from 'lucide-react';
import { createGeneration } from '../../services/generation.service.js';
import { Input, Label } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import { parseApiError } from '../../lib/apiError.js';

export function TextImageToVideoForm({ onJobCreated }) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const mutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('mode', 'text-image-to-video');
      formData.append('prompt', prompt);
      if (imageFile) formData.append('image', imageFile);
      return createGeneration(formData);
    },
    onSuccess: (data) => {
      toast({ title: 'Generation started', description: 'Your video is being generated.', variant: 'success' });
      onJobCreated?.(data.jobId ?? data._id ?? data.id);
      setPrompt('');
      setImageFile(null);
      setImagePreview(null);
    },
    onError: (err) => {
      const { message } = parseApiError(err);
      toast({ title: 'Generation failed', description: message, variant: 'destructive' });
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="ti2v-prompt">Prompt</Label>
        <textarea
          id="ti2v-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how the image should animate…"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Input image</Label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
          <Wand2 className="h-4 w-4" />
          {imageFile ? imageFile.name : 'Choose image'}
        </Button>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 rounded-md max-h-48 object-cover" />
        )}
      </div>
      <Button type="submit" isLoading={mutation.isPending} disabled={!prompt.trim() || !imageFile}>
        <Wand2 className="h-4 w-4" />
        Generate
      </Button>
    </form>
  );
}
