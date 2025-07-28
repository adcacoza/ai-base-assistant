import { z } from 'zod';
import { mapApiError } from './errorMapper';

type ActionState<TInput, TOutput> =
  | {
      success: true;
      data: TOutput;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<keyof TInput, string[] | undefined>;
    };

type Action<TInput, TOutput> = (
  data: TInput,
) => Promise<ActionState<TInput, TOutput>>;

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<TOutput>,
): Action<TInput, TOutput> => {
  return async (data: TInput) => {
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten()
        .fieldErrors as Record<keyof TInput, string[] | undefined>;
      const message = 'Datos de entrada no válidos.';

      console.error('[Validation Error]', fieldErrors);
      return {
        success: false,
        error: message,
        fieldErrors,
      };
    }

    try {
      const result = await handler(validationResult.data);
      return { success: true, data: result };
    } catch (error) {
      const message = mapApiError(error);
      console.error('[Server Action Error]', error);
      return { success: false, error: message };
    }
  };
};
