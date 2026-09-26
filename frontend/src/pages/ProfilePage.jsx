import { useEffect, useState } from 'react';
import api from '../api/client.js';

const sampleProfile = {
  id: 1,
  username: 'sophia',
  fullName: 'Sophia Carter',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  bio: 'Travel creator ✈️',
  stats: { posts: 142, followers: 12000, following: 369 },
  posts: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
  ],
  reels: [
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
  ],
  bookmarks: ['https://images.unsplash.com/photo-1517849845537-4d257902454a', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1']
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(sampleProfile);
  const [tab, setTab] = useState('posts');

  useEffect(() => {
    api.get('/users/1/profile')
      .then((res) => setProfile(res.data || sampleProfile))
      .catch(() => setProfile(sampleProfile));
  }, []);

  const tabs = {
    posts: profile.posts || [],
    reels: profile.reels || [],
    bookmarks: profile.bookmarks || []
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img src={profile.avatar} alt={profile.username} className="profile-avatar" />
        <div className="profile-meta">
          <div className="profile-top-row">
            <h2>{profile.username}</h2>
            <button className="primary-btn">Edit Profile</button>
          </div>
          <div className="profile-stats">
            <span><strong>{profile.stats?.posts || 0}</strong> posts</span>
            <span><strong>{profile.stats?.followers || 0}</strong> followers</span>
            <span><strong>{profile.stats?.following || 0}</strong> following</span>
          </div>
          <div className="profile-bio">
            <strong>{profile.fullName}</strong>
            <p>{profile.bio}</p>
          </div>
        </div>
      </header>

      <div className="profile-tabs">
        {['posts', 'reels', 'bookmarks'].map((key) => (
          <button key={key} className={tab === key ? 'tab active' : 'tab'} onClick={() => setTab(key)}>
            {key}
          </button>
        ))}
      </div>

      <div className="profile-grid">
        {(tabs[tab] || []).map((item, index) => (
          <img key={`${tab}-${index}`} src={item} alt={`${tab} media`} className="profile-grid-item" />
        ))}
      </div>
    </div>
  );
}
