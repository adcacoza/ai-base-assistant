export function withSafeAction<TArgs extends any[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>,
) {
  return async (
    ...args: TArgs
  ): Promise<
    { success: true; data: TReturn } | { success: false; error: string }
  > => {
    try {
      const data = await action(...args);
      return { success: true, data };
    } catch (error) {
      let message = 'Ha ocurrido un error inesperado.';

      if (error instanceof Error) {
        message = error.message;
      }

      console.error('[Server Action Error]', error);

      return { success: false, error: message };
    }
  };
}
