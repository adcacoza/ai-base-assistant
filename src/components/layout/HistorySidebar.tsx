'use client';

import { useHistoryContext } from '@/context/HistoryContext';
import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils';

export const HistorySidebar = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    startNewConversation,
    deleteConversation,
  } = useHistoryContext();

  return (
    <div className="w-64 bg-muted/40 p-4 flex flex-col space-y-4">
      <Button onClick={() => startNewConversation()}>
        + Nueva Conversación
      </Button>
      <div className="flex-grow space-y-2">
        <h2 className="text-lg font-semibold">Historial</h2>
        {conversations.map((convo, index) => (
          <div
            key={index}
            className={cn(
              'p-2 rounded-md cursor-pointer hover:bg-muted flex justify-between items-center',
              activeConversation?.id === convo.id && 'bg-muted',
            )}
            onClick={() => setActiveConversation(convo.id)}
          >
            <p className="truncate flex-grow">{convo.title}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(convo.id);
              }}
            >
              🗑️
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
