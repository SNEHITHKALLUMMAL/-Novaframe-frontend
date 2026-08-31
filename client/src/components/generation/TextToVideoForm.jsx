import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import { createGeneration } from '../../services/generation.service.js';
import { fetchModels } from '../../services/model.service.js';
import { Input, Label } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import { parseApiError } from '../../lib/apiError.js';
import { LoadingState } from '../ui/LoadingState.jsx';

export function TextToVideoForm({ onJobCreated }) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [selectedModelId, setSelectedModelId] = useState('');

  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['models', 'text-to-video'],
    queryFn: () => fetchModels('text-to-video'),
  });

  useEffect(() => {
    if (models && models.length > 0 && !selectedModelId) {
      const defaultModel = models.find((m) => m.isDefault) || models[0];
      setSelectedModelId(defaultModel._id);
    }
  }, [models, selectedModelId]);

  const supportedDurations = models?.find((m) => m._id === selectedModelId)?.supportedDurationsSeconds || [5];

  const mutation = useMutation({
    mutationFn: () =>
      createGeneration({
        type: 'text-to-video',
        aiModelId: selectedModelId,
        prompt,
        parameters: { durationSeconds: Number(duration) },
      }),
    onSuccess: (data) => {
      toast({ title: 'Generation started', description: 'Your video is being generated.', variant: 'success' });
      onJobCreated?.(data._id ?? data.id);
      setPrompt('');
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
          <Label htmlFor="t2v-model">Model</Label>
          <Select
            id="t2v-model"
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
        <Label htmlFor="t2v-prompt">Prompt</Label>
        <textarea
          id="t2v-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to generate…"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t2v-duration">Duration (seconds)</Label>
        <Select
          id="t2v-duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          {supportedDurations.map((d) => (
            <option key={d} value={d}>
              {d}s
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" isLoading={mutation.isPending} disabled={!prompt.trim() || !selectedModelId}>
        <Sparkles className="h-4 w-4" />
        Generate
      </Button>
    </form>
  );
}
