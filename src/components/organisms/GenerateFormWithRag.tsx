'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateTextWithRag } from '@/app/actions/generateTextWithRag';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { useHistoryContext } from '@/context/HistoryContext';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { toast } from 'sonner';
import { ArrowUp, Paperclip } from 'lucide-react';
import { useRef } from 'react';

const generateSchemaWithDoc = z.object({
  prompt: z.string().min(1, { message: 'El prompt no puede estar vacío.' }),
  document: z.string().min(1, { message: 'Debes subir un documento.' }),
});

type GenerateInput = z.infer<typeof generateSchemaWithDoc>;

export const GenerateFormWithRag = ({
  isPending,
  startTransition,
}: {
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
}) => {
  const { addMessageToConversation } = useHistoryContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border-t bg-background"
    >
      <div className="flex items-center space-x-2">
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          className="hidden"
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
                    toast.success('📄 Archivo cargado correctamente');
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
                  toast.success('📄 Archivo cargado correctamente');
                };
                reader.readAsText(file);
              }
            }
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip />
        </Button>
        <Input
          placeholder="Escribe una pregunta sobre el documento..."
          disabled={isPending}
          {...register('prompt')}
          className="flex-1"
        />
        <Button type="submit" disabled={isPending} size="icon">
          {isPending ? <LoadingSpinner /> : <ArrowUp />}
        </Button>
      </div>
      <input type="hidden" {...register('document')} />
      {errors.prompt && (
        <p className="text-sm text-red-500 mt-2">{errors.prompt.message}</p>
      )}
      {errors.document && (
        <p className="text-sm text-red-500 mt-2">{errors.document.message}</p>
      )}
    </form>
  );
};
