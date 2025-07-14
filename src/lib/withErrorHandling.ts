export function withErrorHandling<TArgs extends any[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>,
) {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await action(...args);
    } catch (error) {
      let message = 'Ha ocurrido un error inesperado.';

      if (error instanceof Error) {
        message = error.message;
      }

      console.error('[Server Action Error]', error);

      //We've thrown a new Error so Next.js can serialize it.
      throw new Error(message);
    }
  };
}
