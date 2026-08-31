import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card.jsx';
import { Label, FieldError } from '../ui/Input.jsx';
import { Select, Textarea } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';

import { fetchModels } from '../../services/model.service.js';
import { createGeneration } from '../../services/generation.service.js';
import { textToVideoFormSchema } from '../../lib/validation/generationSchemas.js';
import { parseApiError } from '../../lib/apiError.js';

export function TextToVideoForm({ onJobCreated }) {
  const { toast } = useToast();

  const modelsQuery = useQuery({
    queryKey: ['models', 'text-to-video'],
    queryFn: () => fetchModels('text-to-video'),
    staleTime: 5 * 60 * 1000, // model catalog changes rarely (admin action only)
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(textToVideoFormSchema),
    defaultValues: { aiModelId: '', prompt: '', negativePrompt: '', resolution: '', durationSeconds: '' },
  });

  const selectedModelId = watch('aiModelId');
  const selectedModel = modelsQuery.data?.find((m) => m._id === selectedModelId);

  useEffect(() => {
    if (modelsQuery.data?.length && !selectedModelId) {
      const first = modelsQuery.data[0];
      reset({
        aiModelId: first._id,
        prompt: '',
        negativePrompt: '',
        resolution: first.supportedResolutions[0] ?? '',
        durationSeconds: first.supportedDurationsSeconds[0] ?? '',
      });
    }
  }, [modelsQuery.data, selectedModelId, reset]);

  const createMutation = useMutation({
    mutationFn: createGeneration,
    onSuccess: (job) => {
      onJobCreated(job._id);
      toast({ title: 'Generation started', description: 'Your video is queued.' });
    },
    onError: (err) => {
      const { message } = parseApiError(err);
      toast({ title: 'Could not start generation', description: message, variant: 'destructive' });
    },
  });

  const onSubmit = (values) => {
    createMutation.mutate({
      type: 'text-to-video',
      aiModelId: values.aiModelId,
      prompt: values.prompt,
      negativePrompt: values.negativePrompt || '',
      parameters: { resolution: values.resolution, durationSeconds: Number(values.durationSeconds) },
    });
  };

  if (modelsQuery.isLoading) return <LoadingState label="Loading available models…" />;
  if (modelsQuery.isError) {
    return <ErrorState onRetry={modelsQuery.refetch} description="Couldn't load available models." />;
  }
  if (modelsQuery.data.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No models available"
        description="There isn't a text-to-video model enabled yet. Check back once one has been configured."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New generation</CardTitle>
        <CardDescription>{selectedModel?.description || 'Configure your generation below.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="aiModelId">Model</Label>
            <Controller
              control={control}
              name="aiModelId"
              render={({ field }) => (
                <Select
                  id="aiModelId"
                  {...field}
                  onChange={(e) => {
                    const model = modelsQuery.data.find((m) => m._id === e.target.value);
                    reset({
                      aiModelId: e.target.value,
                      prompt: watch('prompt'),
                      negativePrompt: watch('negativePrompt'),
                      resolution: model?.supportedResolutions[0] ?? '',
                      durationSeconds: model?.supportedDurationsSeconds[0] ?? '',
                    });
                  }}
                >
                  {modelsQuery.data.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              )}
            />
            <FieldError message={errors.aiModelId?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" rows={4} placeholder="A drone shot flying over..." {...register('prompt')} />
            <FieldError message={errors.prompt?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="negativePrompt">Negative prompt (optional)</Label>
            <Textarea
              id="negativePrompt"
              rows={2}
              placeholder="What to avoid in the result..."
              {...register('negativePrompt')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="resolution">Resolution</Label>
              <Select id="resolution" {...register('resolution')}>
                {selectedModel?.supportedResolutions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.resolution?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="durationSeconds">Duration</Label>
              <Select id="durationSeconds" {...register('durationSeconds')}>
                {selectedModel?.supportedDurationsSeconds.map((d) => (
                  <option key={d} value={d}>
                    {d}s
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={createMutation.isPending}>
            Generate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
