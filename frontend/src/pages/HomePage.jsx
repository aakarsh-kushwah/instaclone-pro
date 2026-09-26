import { useEffect, useState } from 'react';
import api from '../api/client.js';
import PostCard from '../components/PostCard.jsx';

const fallbackStories = [
  { id: 1, author: 'sophia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', seen: false },
  { id: 2, author: 'alex', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', seen: true },
  { id: 3, author: 'nina', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', seen: false }
];

const fallbackPosts = [
  { id: 1, author: 'sophia', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', caption: 'Sunset vibes 🌅', location: 'Paris', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', likes: 256, commentsCount: 18, liked: false, comments: [{ id: 1, user: 'alex', text: 'Amazing!' }] },
  { id: 2, author: 'nina', authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', caption: 'Fresh morning run', location: 'NYC', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a', likes: 412, commentsCount: 24, liked: true, comments: [{ id: 1, user: 'sam', text: 'Love it' }] }
];

export default function HomePage() {
  const [stories, setStories] = useState(fallbackStories);
  const [posts, setPosts] = useState(fallbackPosts);

  useEffect(() => {
    api.get('/posts/feed')
      .then((res) => {
        const data = Array.isArray(res.data?.posts) ? res.data.posts : fallbackPosts;
        setPosts(data);
      })
      .catch(() => setPosts(fallbackPosts));

    api.get('/stories')
      .then((res) => {
        const data = Array.isArray(res.data?.stories) ? res.data.stories : fallbackStories;
        setStories(data);
      })
      .catch(() => setStories(fallbackStories));
  }, []);

  const handleLike = (postId, next) => {
    setPosts((prev) => prev.map((post) => post.id === postId ? { ...post, liked: next, likes: next ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1) } : post));
  };

  const handleComment = (postId, text) => {
    setPosts((prev) => prev.map((post) => post.id === postId ? { ...post, commentsCount: (post.commentsCount || 0) + 1, comments: [...(post.comments || []), { id: Date.now(), user: 'you', text }] } : post));
  };

  const handleShare = (postId) => {
    console.log('Share post', postId);
  };

  return (
    <div className="page-shell">
      <div className="stories-row">
        {stories.map((story) => (
          <button key={story.id} className="story-pill" type="button">
            <img src={story.avatar || 'https://via.placeholder.com/64'} alt={story.author} className={`story-avatar ${story.seen ? 'seen' : ''}`} />
            <span>{story.author}</span>
          </button>
        ))}
      </div>

      <div className="feed-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} onCommentToggle={handleComment} onShare={handleShare} />
        ))}
      </div>
    </div>
  );
}
