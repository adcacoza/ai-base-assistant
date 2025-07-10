'use client';

import { useFormState } from 'react-dom';
import { createMessageAction } from './actions';

export const ContactForm = () => {
  const [state, formAction] = useFormState(createMessageAction, {
    message: '',
    success: false,
  });

  return (
    <form action={formAction} className="space-y-4">
      <input
        name="message"
        placeholder="Escribe tu mensaje..."
        className="border rounded p-2 w-full"
      />
      <button
        type="submit"
        className="rounded bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
      >
        Enviar mensaje
      </button>
      {state.success && (
        <p className="text-green-600 text-sm">
          Mensaje enviado: {state.message}
        </p>
      )}
    </form>
  );
};
