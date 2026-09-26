import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function ExplorePage() {
  const [results, setResults] = useState({ users: [], posts: [] });
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query) return;
    api.get(`/explore/search?q=${query}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.error(err));
  }, [query]);

  return (
    <div>
      <h1>Explore</h1>
      <input placeholder="Search users or posts" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="card-grid">
        {results.users.map((user) => (
          <div key={user.id} className="card">
            <h3>{user.username}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
