import { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';

const trendingTags = ['travel', 'food', 'fashion', 'music', 'ai', 'nature'];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults({ users: [], posts: [] });
        return;
      }

      try {
        setLoading(true);
        const res = await api.get('/users/search', { params: { q: query } });
        setResults({ users: res.data.users || [], posts: [] });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const tagGrid = useMemo(() => trendingTags, []);

  return (
    <div className="page-shell">
      <div className="explore-search-box">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users by username or name" />
      </div>

      <div className="trending-tags">
        {tagGrid.map((tag) => (
          <button key={tag} className="tag-pill" onClick={() => setQuery(tag)}>{'#' + tag}</button>
        ))}
      </div>

      <div className="search-results">
        {loading ? <p>Searching...</p> : null}
        {!loading && results.users.length === 0 && !query ? <p>Search for creators, users, or topics.</p> : null}
        {results.users.map((user) => (
          <div key={user.id} className="result-row">
            <div className="user-row">
              <img src={user.avatar || 'https://via.placeholder.com/50'} alt={user.username} className="avatar avatar-md" />
              <div>
                <strong>{user.username}</strong>
                <small>{user.fullName || 'Creator'}</small>
              </div>
            </div>
            <button className="ghost-btn">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
