'use server';

export async function fetchPostsServer(limit: number) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`,
  );
  const posts = await res.json();
  return posts.map((p: any) => p.title);
}
