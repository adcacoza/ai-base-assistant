'use client';

import { useState, useTransition } from 'react';
import { fetchPostsServer } from './actions';

export const FetchButton = () => {
  const [posts, setPosts] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleFetch = () => {
    startTransition(async () => {
      const data = await fetchPostsServer(3);
      setPosts(data);
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleFetch}
        className="rounded bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
      >
        {isPending ? 'Loading...' : 'Fetch Posts'}
      </button>
      <ul className="space-y-2">
        {posts.map((title, i) => (
          <li key={i} className="border p-2 rounded">
            {title}
          </li>
        ))}
      </ul>
    </div>
  );
};
