'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateSchema } from '@/lib/validation/generateSchema';
import { generateText } from '@/app/actions/generateText';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { useHistoryContext, Message } from '@/context/HistoryContext';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { toast } from 'sonner';

type GenerateInput = z.infer<typeof generateSchema>;

export const GenerateForm = () => {
  const { activeConversation, addMessageToConversation } = useHistoryContext();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GenerateInput>({
    resolver: zodResolver(generateSchema),
  });

  const onSubmit = (data: GenerateInput) => {
    startTransition(async () => {
      const result = await generateText(data.prompt);
      if (result.success) {
        toast.success('✅ Texto generado correctamente');
        if (typeof result.data === 'string') {
          addMessageToConversation(data.prompt, result.data);
        }
        reset();
      } else {
        toast.error(`❌ ${result.error}`);
      }
    });
  };

  const handleCopy = (text: string | null) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success('Texto copiado al portapapeles');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="Escribe un prompt..."
        disabled={isPending}
        {...register('prompt')}
      />
      {errors.prompt && (
        <p className="text-sm text-red-500">{errors.prompt.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Generando...' : 'Generar'}
      </Button>

      <div className="space-y-4">
        {activeConversation?.messages?.map((message: Message) => (
          <div key={message.id} className="p-4 bg-muted rounded-lg space-y-2">
            <p className="font-semibold">{message.prompt}</p>
            <p>{message.response}</p>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => handleCopy(message.response)}
            >
              Copiar
            </Button>
          </div>
        ))}
        {isPending && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </form>
  );
};
