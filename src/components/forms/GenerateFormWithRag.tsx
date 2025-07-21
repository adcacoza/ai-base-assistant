'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateTextWithRag } from '@/app/actions/generateTextWithRag';

const generateSchemaWithDoc = z.object({
  prompt: z.string().min(1, { message: 'El prompt no puede estar vacío.' }),
  document: z.string().min(1, { message: 'Debes subir un documento.' }),
});
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { useHistoryContext, Message } from '@/context/HistoryContext';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { toast } from 'sonner';

type GenerateInput = z.infer<typeof generateSchemaWithDoc>;

export const GenerateFormWithRag = () => {
  const { activeConversation, addMessageToConversation } = useHistoryContext();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<GenerateInput>({
    resolver: zodResolver(generateSchemaWithDoc),
  });

  const onSubmit = (data: GenerateInput) => {
    startTransition(async () => {
      const result = await generateTextWithRag(data);
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
        type="file"
        accept=".txt,.pdf"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            if (file.type === 'application/pdf') {
              const formData = new FormData();
              formData.append('file', file);
              try {
                const response = await fetch('/api/parse-pdf', {
                  method: 'POST',
                  body: formData,
                });
                const data = await response.json();
                if (response.ok) {
                  setValue('document', data.text);
                } else {
                  toast.error(`❌ ${data.error}`);
                }
              } catch {
                toast.error('❌ Error al procesar el PDF.');
              }
            } else {
              const reader = new FileReader();
              reader.onload = (e) => {
                const text = e.target?.result as string;
                setValue('document', text);
              };
              reader.readAsText(file);
            }
          }
        }}
      />
      <Input
        placeholder="Escribe un prompt para el RAG..."
        disabled={isPending}
        {...register('prompt')}
      />
      <input type="hidden" {...register('document')} />
      {errors.prompt && (
        <p className="text-sm text-red-500">{errors.prompt.message}</p>
      )}
      {errors.document && (
        <p className="text-sm text-red-500">{errors.document.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Generando con RAG...' : 'Generar con RAG'}
      </Button>

      <div className="space-y-4">
        {activeConversation?.messages?.map((message: Message) => (
          <div key={message.id} className="p-2 bg-muted rounded-lg space-y-1">
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
