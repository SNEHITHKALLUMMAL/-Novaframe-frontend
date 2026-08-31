import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import { createGeneration } from '../../services/generation.service.js';
import { Input, Label, FieldError } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import { parseApiError } from '../../lib/apiError.js';

export function TextToVideoForm({ onJobCreated }) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');

  const mutation = useMutation({
    mutationFn: () =>
      createGeneration({
        mode: 'text-to-video',
        prompt,
        durationSeconds: Number(duration),
      }),
    onSuccess: (data) => {
      toast({ title: 'Generation started', description: 'Your video is being generated.', variant: 'success' });
      onJobCreated?.(data.jobId ?? data._id ?? data.id);
      setPrompt('');
    },
    onError: (err) => {
      const { message } = parseApiError(err);
      toast({ title: 'Generation failed', description: message, variant: 'destructive' });
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
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
        <Input
          id="t2v-duration"
          type="number"
          min={1}
          max={10}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>
      <Button type="submit" isLoading={mutation.isPending} disabled={!prompt.trim()}>
        <Sparkles className="h-4 w-4" />
        Generate
      </Button>
    </form>
  );
}
