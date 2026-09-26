import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.get('/stories')
      .then((res) => setStories(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Stories</h1>
      <div className="card-grid">
        {stories.map((story) => (
          <div key={story.id} className="card">
            <img src={story.media_url} alt="Story" className="post-image" />
            <p>{story.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
