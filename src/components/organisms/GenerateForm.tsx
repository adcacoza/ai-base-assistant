'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateSchema } from '@/lib/validation/generateSchema';
import { generateText } from '@/app/actions/generateText';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { useHistoryContext } from '@/context/HistoryContext';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { toast } from 'sonner';
import { ArrowUp } from 'lucide-react';

type GenerateInput = z.infer<typeof generateSchema>;

export const GenerateForm = ({
  isPending,
  startTransition,
}: {
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
}) => {
  const { addMessageToConversation } = useHistoryContext();

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border-t bg-background"
    >
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Escribe un prompt..."
          disabled={isPending}
          {...register('prompt')}
          className="flex-1"
        />
        <Button type="submit" disabled={isPending} size="icon">
          {isPending ? <LoadingSpinner /> : <ArrowUp />}
        </Button>
      </div>
      {errors.prompt && (
        <p className="text-sm text-red-500 mt-2">{errors.prompt.message}</p>
      )}
    </form>
  );
};
