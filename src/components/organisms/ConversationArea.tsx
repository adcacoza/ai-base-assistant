'use client';

import { useHistoryContext, Message } from '@/context/HistoryContext';
import { Button } from '@/components/atoms/button';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { toast } from 'sonner';

interface ConversationAreaProps {
  isPending: boolean;
}

export const ConversationArea: React.FC<ConversationAreaProps> = ({
  isPending,
}) => {
  const { activeConversation } = useHistoryContext();

  const handleCopy = (text: string | null) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success('Texto copiado al portapapeles');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
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
  );
};
