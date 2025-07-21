'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// --- Types (copied from useHistory) ---
export type Message = {
  id: string;
  prompt: string;
  response: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
};

// --- Helper Functions (copied from useHistory) ---
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
};

const getStorageKey = (key: string, userId?: string | null) =>
  `ai_history_${key}_${userId || 'anonymous'}`;

// --- Context Definition ---
interface HistoryContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  startNewConversation: () => void;
  setActiveConversation: (id: string) => void;
  addMessageToConversation: (prompt: string, response: string) => void;
  deleteConversation: (id: string) => void;
  clearAllHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

// --- Provider Component ---
interface HistoryProviderProps {
  children: ReactNode;
  historyKey: 'chat' | 'rag';
  userId?: string | null;
}

export const HistoryProvider = ({
  children,
  historyKey,
  userId,
}: HistoryProviderProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const storageKey = getStorageKey(historyKey, userId);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsedConversations: Conversation[] = JSON.parse(stored);
      setConversations(parsedConversations);
      if (parsedConversations.length > 0) {
        setActiveConversationId(parsedConversations[0].id);
      }
    }
  }, [storageKey]);

  const saveConversations = useCallback(
    (newConversations: Conversation[]) => {
      setConversations(newConversations);
      localStorage.setItem(storageKey, JSON.stringify(newConversations));
    },
    [storageKey],
  );

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: generateUniqueId(),
      title: 'New Conversation',
      messages: [],
      timestamp: Date.now(),
    };
    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
    setActiveConversationId(newConversation.id);
  };

  const addMessageToConversation = (prompt: string, response: string) => {
    if (!activeConversationId) {
      const newMessage: Message = { id: generateUniqueId(), prompt, response };
      const newConversation: Conversation = {
        id: generateUniqueId(),
        title: prompt.substring(0, 30),
        messages: [newMessage],
        timestamp: Date.now(),
      };
      const updatedConversations = [newConversation, ...conversations];
      saveConversations(updatedConversations);
      setActiveConversationId(newConversation.id);
    } else {
      const updatedConversations = conversations.map((convo) => {
        if (convo.id === activeConversationId) {
          const newMessage: Message = {
            id: generateUniqueId(),
            prompt,
            response,
          };
          const isFirstMessage = convo.messages.length === 0;
          return {
            ...convo,
            title: isFirstMessage ? prompt.substring(0, 30) : convo.title,
            messages: [...convo.messages, newMessage],
          };
        }
        return convo;
      });
      saveConversations(updatedConversations);
    }
  };

  const deleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversationId,
    );
    saveConversations(updatedConversations);
    if (activeConversationId === conversationId) {
      setActiveConversationId(
        updatedConversations.length > 0 ? updatedConversations[0].id : null,
      );
    }
  };

  const clearAllHistory = () => {
    setConversations([]);
    setActiveConversationId(null);
    localStorage.removeItem(storageKey);
  };

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  const value = {
    conversations,
    activeConversation,
    startNewConversation,
    setActiveConversation: setActiveConversationId,
    addMessageToConversation,
    deleteConversation,
    clearAllHistory,
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

// --- Custom Hook ---
export const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistoryContext must be used within a HistoryProvider');
  }
  return context;
};
