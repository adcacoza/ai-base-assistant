import { z } from 'zod';

export const promptSchema = z.object({
  prompt: z.string().min(1).max(500),
});

export type PromptInput = z.infer<typeof promptSchema>;
