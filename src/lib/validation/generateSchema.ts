import { z } from 'zod';

export const generateSchema = z.object({
  prompt: z
    .string()
    .min(1, 'El prompt es obligatorio.')
    .max(500, 'El prompt no puede superar 500 caracteres.'),
});
