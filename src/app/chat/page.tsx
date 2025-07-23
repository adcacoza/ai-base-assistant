'use client';

import { useTransition } from 'react';
import { GenerateForm } from '@/components/organisms/GenerateForm';
import { HistorySidebar } from '@/components/organisms/HistorySidebar';
import { HistoryProvider } from '@/context/HistoryContext';
import { useUser } from '@clerk/nextjs';
import { ConversationArea } from '@/components/organisms/ConversationArea';

const ChatPage = () => {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  return (
    <HistoryProvider historyKey="chat" userId={user?.id}>
      <main className="flex h-[calc(100vh-4rem)]">
        <HistorySidebar />
        <div className="flex-1 flex flex-col bg-background">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">
              Asistente de Chat ✨
            </h1>
          </div>
          <ConversationArea isPending={isPending} />
          <GenerateForm
            isPending={isPending}
            startTransition={startTransition}
          />
        </div>
      </main>
    </HistoryProvider>
  );
};

export default ChatPage;
