import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/users/notifications')
      .then((res) => setItems(res.data.notifications || []))
      .catch(() => setItems([]));
  }, []);

  const handleFollowDecision = async (requestId, action) => {
    try {
      await api.post(`/users/follow-request/${requestId}`, { action });
      setItems((prev) => prev.filter((item) => item.id !== requestId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-shell">
      <h2>Notifications</h2>
      <div className="stack">
        {items.length === 0 && <p>No notifications yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="card notification-card">
            <div>
              <strong>{item.title || item.type}</strong>
              <p>{item.message}</p>
            </div>
            {item.type === 'follow' && item.title?.includes('request') && (
              <div className="request-actions">
                <button className="primary-btn" onClick={() => handleFollowDecision(item.id, 'accept')}>Accept</button>
                <button className="ghost-btn" onClick={() => handleFollowDecision(item.id, 'decline')}>Decline</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
