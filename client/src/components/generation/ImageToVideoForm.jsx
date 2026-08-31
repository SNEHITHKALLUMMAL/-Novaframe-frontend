import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ImageIcon } from 'lucide-react';
import { createGeneration } from '../../services/generation.service.js';
import { fetchModels } from '../../services/model.service.js';
import { uploadImage } from '../../services/upload.service.js';
import { Input, Label } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import { parseApiError } from '../../lib/apiError.js';
import { LoadingState } from '../ui/LoadingState.jsx';

export function ImageToVideoForm({ onJobCreated }) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState('');
  const fileRef = useRef(null);

  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['models', 'image-to-video'],
    queryFn: () => fetchModels('image-to-video'),
  });

  useEffect(() => {
    if (models && models.length > 0 && !selectedModelId) {
      const defaultModel = models.find((m) => m.isDefault) || models[0];
      setSelectedModelId(defaultModel._id);
    }
  }, [models, selectedModelId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      // Upload the image first, then create the generation job
      let inputFileIds = [];
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        inputFileIds = [uploadResult.file._id];
      }
      return createGeneration({
        type: 'image-to-video',
        aiModelId: selectedModelId,
        prompt,
        inputFileIds,
        parameters: {},
      });
    },
    onSuccess: (data) => {
      toast({ title: 'Generation started', description: 'Your video is being generated.', variant: 'success' });
      onJobCreated?.(data._id ?? data.id);
      setPrompt('');
      setImageFile(null);
      setImagePreview(null);
    },
    onError: (err) => {
      const { message } = parseApiError(err);
      toast({ title: 'Generation failed', description: message, variant: 'destructive' });
    },
  });

  if (modelsLoading) {
    return <LoadingState message="Loading models…" />;
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
      {models && models.length > 1 && (
        <div className="space-y-1.5">
          <Label htmlFor="i2v-model">Model</Label>
          <Select
            id="i2v-model"
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
          >
            {models.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="i2v-prompt">Prompt (optional)</Label>
        <textarea
          id="i2v-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how the image should animate…"
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Input image</Label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
          {imageFile ? imageFile.name : 'Choose image'}
        </Button>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 rounded-md max-h-48 object-cover" />
        )}
      </div>
      <Button type="submit" isLoading={mutation.isPending} disabled={!imageFile || !selectedModelId}>
        <ImageIcon className="h-4 w-4" />
        Generate
      </Button>
    </form>
  );
}
