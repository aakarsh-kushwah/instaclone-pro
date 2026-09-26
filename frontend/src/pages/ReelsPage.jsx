import { useEffect, useRef, useState } from 'react';
import api from '../api/client.js';

const fallbackReels = [
  { id: 1, author: 'mila', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', caption: 'Night drive', video: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4', likes: 1254, comments: 88, soundOn: false },
  { id: 2, author: 'noah', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', caption: 'Morning routine', video: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4', likes: 982, comments: 42, soundOn: true }
];

export default function ReelsPage() {
  const [reels, setReels] = useState(fallbackReels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    api.get('/reels')
      .then((res) => {
        const data = Array.isArray(res.data?.reels) ? res.data.reels : fallbackReels;
        setReels(data);
      })
      .catch(() => setReels(fallbackReels));
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === activeIndex) {
          video.play().catch(() => {});
          video.muted = !soundOn;
        } else {
          video.pause();
        }
      }
    });
  }, [activeIndex, soundOn]);

  const handleLike = (id) => {
    setReels((prev) => prev.map((reel) => reel.id === id ? { ...reel, likes: (reel.likes || 0) + 1 } : reel));
  };

  const handleShare = (id) => {
    console.log('share reel', id);
  };

  const handleSwipe = (direction) => {
    if (direction === 'next') setActiveIndex((prev) => Math.min(prev + 1, reels.length - 1));
    else setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="reels-shell">
      <div className="reels-viewport">
        {reels.map((reel, index) => (
          <div key={reel.id} className={`reel-card ${index === activeIndex ? 'active' : ''}`}>
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={reel.video}
              muted={!soundOn}
              playsInline
              autoPlay={index === activeIndex}
              loop
              className="reel-video"
            />

            <div className="reel-overlay">
              <div className="reel-user-row">
                <img src={reel.avatar || 'https://via.placeholder.com/50'} alt={reel.author} className="avatar avatar-md" />
                <span>{reel.author}</span>
                <button className="follow-chip">Follow</button>
              </div>

              <div className="reel-caption">{reel.caption}</div>
            </div>

            <div className="reel-actions">
              <button className="circle-btn" onClick={() => handleLike(reel.id)}>♥ {reel.likes}</button>
              <button className="circle-btn" onClick={() => handleShare(reel.id)}>↗</button>
              <button className="circle-btn" onClick={() => setSoundOn((prev) => !prev)}>{soundOn ? '🔊' : '🔇'}</button>
            </div>
          </div>
        ))}
      </div>

      <div className="reel-nav">
        <button onClick={() => handleSwipe('prev')}>↑</button>
        <button onClick={() => handleSwipe('next')}>↓</button>
      </div>
    </div>
  );
}
