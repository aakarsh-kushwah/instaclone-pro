import { useState } from 'react';

export default function PostCard({ post, onLike, onCommentToggle, onShare }) {
  const [liked, setLiked] = useState(post.liked || false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleDoubleTapLike = () => {
    setLiked((prev) => {
      const next = !prev;
      onLike?.(post.id, next);
      return next;
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onCommentToggle?.(post.id, commentText);
    setCommentText('');
    setShowComments(false);
  };

  return (
    <article className="feed-card">
      <header className="feed-header">
        <div className="user-row">
          <img src={post.authorAvatar || 'https://via.placeholder.com/60'} alt="avatar" className="avatar avatar-md" />
          <div>
            <strong>{post.author || 'username'}</strong>
            <small>{post.location || 'Your location'}</small>
          </div>
        </div>
        <button className="ghost-btn">•••</button>
      </header>

      <div className="post-media-wrap" onDoubleClick={handleDoubleTapLike}>
        <img src={post.image || post.media || 'https://images.unsplash.com/photo-1517849845537-4d257902454a'} alt="post" className="post-media" />
      </div>

      <div className="post-actions">
        <button className={liked ? 'action-btn active' : 'action-btn'} onClick={() => { const next = !liked; setLiked(next); onLike?.(post.id, next); }}>{liked ? '♥' : '♡'} {post.likes || 0}</button>
        <button className="action-btn" onClick={() => setShowComments(true)}>💬 {post.commentsCount || 0}</button>
        <button className="action-btn" onClick={() => onShare?.(post.id)}>↗ Share</button>
      </div>

      <div className="post-caption">
        <strong>{post.author || 'username'}</strong> {post.caption || 'Beautiful day'}
      </div>

      {showComments && (
        <div className="modal-overlay" onClick={() => setShowComments(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Comments</h3>
              <button onClick={() => setShowComments(false)}>✕</button>
            </div>
            <div className="comment-list">
              {(post.comments || [{ id: 1, user: 'demo', text: 'Looks amazing!' }]).map((comment) => (
                <div key={comment.id} className="comment-item">
                  <strong>{comment.user || 'demo'}</strong>
                  <span>{comment.text || 'Looks amazing!'}</span>
                </div>
              ))}
            </div>
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." />
              <button type="submit">Post</button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
}
