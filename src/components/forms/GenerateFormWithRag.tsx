'use client';

import { useState, useTransition } from 'react';
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
import { useHistory } from '@/hooks/useHistory';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

type GenerateInput = z.infer<typeof generateSchemaWithDoc>;

export const GenerateFormWithRag = () => {
  const { user } = useUser();
  const { history, addToHistory, clearHistory } = useHistory('rag', user?.id);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setResult(null);
    setError(null);
    startTransition(async () => {
      try {
        const result = await generateTextWithRag(data);
        if (!result.success) {
          if (typeof result.error === 'string') {
            toast.error(`❌ ${result.error}`);
            setError(result.error);
          } else {
            toast.error('❌ Ocurrió un error inesperado.');
            setError('Ocurrió un error inesperado.');
          }
          return;
        }
        toast.success('✅ Texto generado correctamente');
        if (typeof result.data === 'string') {
          addToHistory({ prompt: data.prompt, response: result.data });
          setResult(result.data);
        }
        reset();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Ocurrió un error inesperado al generar el texto.';
        toast.error(`❌ ${message}`);
        setError(message);
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

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Generando con RAG...' : 'Generar con RAG'}
      </Button>

      {isPending && (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {result && (
        <div className="p-4 bg-secondary rounded text-secondary-foreground space-y-2">
          <p>{result}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive text-destructive-foreground rounded">
          {error}
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Historial</h3>
          <ul className="space-y-1">
            {history.map((item, idx) => (
              <li key={idx} className="p-2 bg-muted rounded space-y-2">
                <p className="font-semibold">{item.prompt}</p>
                <p>{item.response}</p>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => handleCopy(item.response)}
                >
                  Copiar
                </Button>
              </li>
            ))}
          </ul>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearHistory}
            type="button"
          >
            Borrar historial
          </Button>
        </div>
      )}
    </form>
  );
};
