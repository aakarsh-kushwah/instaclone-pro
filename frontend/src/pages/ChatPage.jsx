import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const sampleUsers = [
  { id: 1, username: 'sophia', online: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
  { id: 2, username: 'alex', online: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
  { id: 3, username: 'nina', online: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' }
];

const sampleMessages = [
  { id: 1, senderId: 1, text: 'Hey! You up for a coffee?', mine: false },
  { id: 2, senderId: 2, text: 'Yeah, let’s do 6pm.', mine: true },
  { id: 3, senderId: 1, text: 'Perfect 👌', mine: false }
];

export default function ChatPage() {
  const [users] = useState(sampleUsers);
  const [selectedUserId, setSelectedUserId] = useState(sampleUsers[0].id);
  const [messages, setMessages] = useState(sampleMessages);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:5000', { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('message:receive', (message) => {
      setMessages((prev) => [...prev, { ...message, mine: false }]);
    });

    socket.on('typing:indicator', (payload) => {
      if (payload?.typing) setTyping(true);
      else setTyping(false);
    });

    return () => socket.disconnect();
  }, []);

  const activeUser = useMemo(() => users.find((user) => user.id === selectedUserId) || users[0], [selectedUserId, users]);

  const handleSend = () => {
    if (!draft.trim()) return;
    const message = { id: Date.now(), senderId: 2, text: draft, mine: true };
    setMessages((prev) => [...prev, message]);
    socketRef.current?.emit('message:send', {
      senderId: 2,
      receiverId: selectedUserId,
      text: draft
    });
    setDraft('');
  };

  const handleTyping = (value) => {
    setDraft(value);
    socketRef.current?.emit('typing:start', { receiverId: selectedUserId, userId: 2, conversationId: 'chat-' + selectedUserId });
  };

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <h2>Messages</h2>
        {users.map((user) => (
          <button key={user.id} className={`chat-user ${selectedUserId === user.id ? 'active' : ''}`} onClick={() => setSelectedUserId(user.id)}>
            <img src={user.avatar} alt={user.username} className="avatar avatar-md" />
            <div>
              <strong>{user.username}</strong>
              <small>{user.online ? 'online' : 'offline'}</small>
            </div>
            {user.online && <span className="online-dot" />}
          </button>
        ))}
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div className="user-row">
            <img src={activeUser.avatar} alt={activeUser.username} className="avatar avatar-md" />
            <div>
              <strong>{activeUser.username}</strong>
              <small>{activeUser.online ? 'online now' : 'last active recently'}</small>
            </div>
          </div>
        </header>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.mine ? 'mine' : ''}`}>
              {msg.text}
            </div>
          ))}
          {typing && <div className="typing-indicator">Typing...</div>}
        </div>

        <div className="chat-input-row">
          <input value={draft} onChange={(e) => handleTyping(e.target.value)} placeholder="Message..." />
          <button onClick={handleSend}>Send</button>
        </div>
      </section>
    </div>
  );
}
