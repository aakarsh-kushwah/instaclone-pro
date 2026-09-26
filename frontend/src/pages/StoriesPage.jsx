import { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';

const fallbackStories = [
  { id: 1, author: 'sophia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', media: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', caption: 'Sunset mood' },
  { id: 2, author: 'alex', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', media: 'https://images.unsplash.com/photo-1517849845537-4d257902454a', caption: 'Coffee run' },
  { id: 3, author: 'nina', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', media: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1', caption: 'Weekend vibes' }
];

export default function StoriesPage() {
  const [stories, setStories] = useState(fallbackStories);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reply, setReply] = useState('');

  useEffect(() => {
    api.get('/stories')
      .then((res) => {
        const data = Array.isArray(res.data?.stories) ? res.data.stories : fallbackStories;
        setStories(data);
      })
      .catch(() => setStories(fallbackStories));
  }, []);

  useEffect(() => {
    if (!stories.length) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStoryIndex((current) => (current + 1) % stories.length);
          return 0;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [stories, storyIndex]);

  const currentStory = stories[storyIndex] || fallbackStories[0];

  const handleNext = () => {
    setStoryIndex((prev) => (prev + 1) % stories.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
    setProgress(0);
  };

  const handleReply = () => {
    if (!reply.trim()) return;
    console.log('Story reply:', reply);
    setReply('');
  };

  return (
    <div className="story-viewer">
      <div className="story-progress-row">
        {stories.map((_, index) => (
          <div key={index} className="story-progress-bar">
            <div style={{ width: index === storyIndex ? `${progress}%` : '100%' }} className="story-progress-fill" />
          </div>
        ))}
      </div>

      <div className="story-card">
        <div className="story-topbar">
          <button onClick={handlePrev}>←</button>
          <div className="story-user-info">
            <img src={currentStory.avatar || 'https://via.placeholder.com/50'} alt={currentStory.author} className="avatar avatar-md" />
            <span>{currentStory.author || 'user'}</span>
          </div>
          <button onClick={handleNext}>→</button>
        </div>

        <img src={currentStory.media || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'} alt="story" className="story-media" />
        <p className="story-caption">{currentStory.caption || 'Story caption'}</p>
      </div>

      <div className="story-reply">
        <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Send reply to story" />
        <button onClick={handleReply}>Send</button>
      </div>
    </div>
  );
}
