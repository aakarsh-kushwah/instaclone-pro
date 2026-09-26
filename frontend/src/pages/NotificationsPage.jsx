import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/notifications')
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <div className="stack">
        {items.map((item) => (
          <div key={item.id} className="card">
            <strong>{item.type}</strong>
            <p>{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
