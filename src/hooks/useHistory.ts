import { useEffect, useState } from 'react';

const getStorageKey = (key: string, userId?: string | null) =>
  `ai_history_${key}_${userId || 'anonymous'}`;

type HistoryItem = {
  prompt: string;
  response: string;
};

export function useHistory(key: string, userId?: string | null) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const storageKey = getStorageKey(key, userId);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setHistory(JSON.parse(stored));
  }, [storageKey, userId]);

  const addToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(storageKey);
  };

  return { history, addToHistory, clearHistory };
}
