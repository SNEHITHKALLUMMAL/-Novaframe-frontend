import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Wand2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card.jsx';
import { Label, FieldError } from '../ui/Input.jsx';
import { Select, Textarea } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import { ImageUploadField } from './ImageUploadField.jsx';

import { fetchModels } from '../../services/model.service.js';
import { createGeneration } from '../../services/generation.service.js';
import { textImageToVideoFormSchema } from '../../lib/validation/generationSchemas.js';
import { parseApiError } from '../../lib/apiError.js';

/**
 * Combines the two pieces built in Phases 13 (prompt input) and 14 (image
 * upload) — genuinely new work here is just the schema requiring both, and
 * the submission shape (type: 'text-image-to-video' with both prompt and
 * inputFileIds populated). No new infrastructure.
 */
export function TextImageToVideoForm({ onJobCreated }) {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState(null);

  const modelsQuery = useQuery({
    queryKey: ['models', 'text-image-to-video'],
    queryFn: () => fetchModels('text-image-to-video'),
    staleTime: 5 * 60 * 1000, // model catalog changes rarely (admin action only)
  });

  const {
    handleSubmit,
    register,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(textImageToVideoFormSchema),
    defaultValues: {
      aiModelId: '',
      uploadedFileId: '',
      prompt: '',
      negativePrompt: '',
      resolution: '',
      durationSeconds: '',
    },
  });

  const selectedModelId = watch('aiModelId');
  const selectedModel = modelsQuery.data?.find((m) => m._id === selectedModelId);

  useEffect(() => {
    if (modelsQuery.data?.length && !selectedModelId) {
      const first = modelsQuery.data[0];
      reset({
        aiModelId: first._id,
        uploadedFileId: '',
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
      type: 'text-image-to-video',
      aiModelId: values.aiModelId,
      prompt: values.prompt,
      negativePrompt: values.negativePrompt || '',
      inputFileIds: [values.uploadedFileId],
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
        icon={Wand2}
        title="No models available"
        description="There isn't a text+image-to-video model enabled yet. Check back once one has been configured."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New generation</CardTitle>
        <CardDescription>
          {selectedModel?.description || 'Upload an image and describe how it should come to life.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label>Source image</Label>
            <ImageUploadField
              value={uploadedFile}
              onChange={(file) => {
                setUploadedFile(file);
                setValue('uploadedFileId', file?._id ?? '', { shouldValidate: true });
              }}
              error={errors.uploadedFileId?.message}
            />
          </div>

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
                      uploadedFileId: watch('uploadedFileId'),
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
            <Textarea
              id="prompt"
              rows={3}
              placeholder="Describe how the image should come to life..."
              {...register('prompt')}
            />
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
