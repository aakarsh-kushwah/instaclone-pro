import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts/feed')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <div className="card-grid">
        {posts.map((post) => (
          <article key={post.id} className="card">
            <h3>{post.username}</h3>
            <p>{post.caption}</p>
            {post.image_url && <img src={post.image_url} alt="Post" className="post-image" />}
          </article>
        ))}
      </div>
    </div>
  );
}
