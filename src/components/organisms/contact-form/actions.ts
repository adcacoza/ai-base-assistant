'use server';

interface CreateMessageActionProps {
  previusMessage: string;
}

export async function createMessageAction(
  prevState: any | CreateMessageActionProps,
  formData: FormData,
) {
  const message = formData.get('message') as string;

  console.log('🔵 Recibido mensaje:', message);

  // Aquí podrías guardar en base de datos, enviar email, etc.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message,
  };
}
