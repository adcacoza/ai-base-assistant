'use client';

import { useState, useTransition, FormEvent } from 'react';
import { generateText } from '@/app/actions/generateText';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { useHistory } from '@/hooks/useHistory';
import { toast } from 'sonner';

export const GenerateForm = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const { history, addToHistory, clearHistory } = useHistory();
  const MAX_LENGTH = 500;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = prompt.trim();
    if (!trimmed) {
      setError('Por favor escribe un prompt.');
      return;
    }
    if (trimmed.length > 500) {
      setError('El prompt es demasiado largo (máximo 500 caracteres).');
      return;
    }

    setError('');
    setResult('');

    startTransition(async () => {
      try {
        const text = await generateText(trimmed);
        setResult(text);
        addToHistory({ prompt: trimmed, response: text });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success('Texto copiado al portapapeles');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Escribe un prompt..."
        value={prompt}
        onChange={(e) => {
          if (e.target.value.length <= MAX_LENGTH) {
            setPrompt(e.target.value);
          }
        }}
        disabled={isPending}
      />
      <div className="text-xs text-muted-foreground text-right">
        {prompt.length}/{MAX_LENGTH}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Generando...' : 'Generar'}
      </Button>

      {isPending && (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {result && (
        <div className="p-4 bg-secondary rounded text-secondary-foreground space-y-2">
          <p>{result}</p>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={handleCopy}
          >
            Copiar
          </Button>
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
              <li key={idx} className="p-2 bg-muted rounded">
                <p className="font-semibold">{item.prompt}</p>
                <p>{item.response}</p>
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
