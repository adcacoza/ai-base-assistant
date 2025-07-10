const Dashboard = async () => {
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=5',
  );
  const posts: { id: number; title: string; body: string }[] = await res.json();

  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-semibold">Posts recientes</h2>
      <ul className="grid gap-2">
        {posts.map((post) => (
          <li key={post.id} className="rounded border p-4">
            <h3 className="text-lg font-medium">{post.title}</h3>
            <p className="text-muted-foreground">{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Dashboard;
