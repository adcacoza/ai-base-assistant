'use client';

import { GenerateForm } from '@/components/forms/GenerateForm';
import { HistorySidebar } from '@/components/layout/HistorySidebar';
import { HistoryProvider } from '@/context/HistoryContext';
import { useUser } from '@clerk/nextjs';

const ChatPage = () => {
  const { user } = useUser();

  return (
    <HistoryProvider historyKey="chat" userId={user?.id}>
      <main className="flex h-[calc(100vh-4rem)]">
        <HistorySidebar />
        <div className="flex-1 flex flex-col p-6 bg-background">
          <div className="flex-1 overflow-y-auto space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Asistente de Chat ✨
            </h1>
            <GenerateForm />
          </div>
        </div>
      </main>
    </HistoryProvider>
  );
};

export default ChatPage;
