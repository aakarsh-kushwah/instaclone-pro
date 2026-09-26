import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function ReelsPage() {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    api.get('/reels')
      .then((res) => setReels(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Reels</h1>
      <div className="card-grid">
        {reels.map((reel) => (
          <div key={reel.id} className="card">
            <video src={reel.video_url} controls className="post-image" />
            <p>{reel.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
