'use client';

import { GenerateFormWithRag } from '@/components/forms/GenerateFormWithRag';
import { HistorySidebar } from '@/components/layout/HistorySidebar';
import { HistoryProvider } from '@/context/HistoryContext';
import { useUser } from '@clerk/nextjs';

const RagPage = () => {
  const { user } = useUser();

  return (
    <HistoryProvider historyKey="rag" userId={user?.id}>
      <main className="flex h-[calc(100vh-4rem)]">
        <HistorySidebar />
        <div className="flex-1 flex flex-col p-6 bg-background">
          <div className="flex-1 overflow-y-auto space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Chat con Documentos (RAG) 📚
            </h1>
            <GenerateFormWithRag />
          </div>
        </div>
      </main>
    </HistoryProvider>
  );
};

export default RagPage;
