import { z } from 'zod';

export const textToVideoFormSchema = z.object({
  aiModelId: z.string().min(1, 'Select a model'),
  prompt: z.string().trim().min(3, 'Describe what you want to see (at least 3 characters)').max(2000),
  negativePrompt: z.string().trim().max(2000).optional(),
  resolution: z.string().min(1, 'Select a resolution'),
  durationSeconds: z.coerce.number().positive(),
});

export const imageToVideoFormSchema = z.object({
  aiModelId: z.string().min(1, 'Select a model'),
  uploadedFileId: z.string().min(1, 'Upload an image to continue'),
  motionPrompt: z.string().trim().max(2000).optional(),
  resolution: z.string().min(1, 'Select a resolution'),
  durationSeconds: z.coerce.number().positive(),
});

export const textImageToVideoFormSchema = z.object({
  aiModelId: z.string().min(1, 'Select a model'),
  uploadedFileId: z.string().min(1, 'Upload an image to continue'),
  prompt: z.string().trim().min(3, 'Describe how the image should come to life (at least 3 characters)').max(2000),
  negativePrompt: z.string().trim().max(2000).optional(),
  resolution: z.string().min(1, 'Select a resolution'),
  durationSeconds: z.coerce.number().positive(),
});
