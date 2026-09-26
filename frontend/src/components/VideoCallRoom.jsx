import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function VideoCallRoom() {
  const socketRef = useRef(null);
  const [peerId, setPeerId] = useState('');
  const [roomId, setRoomId] = useState('call-room-123');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000', { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setPeerId(socket.id);
      socket.emit('user:online', 'demo-user');
      setConnected(true);
    });

    socket.on('call:incoming', (payload) => {
      console.log('Incoming call', payload);
    });

    socket.on('call:answered', (payload) => {
      console.log('Call answered', payload);
    });

    return () => socket.disconnect();
  }, []);

  const startCall = () => {
    socketRef.current?.emit('call:initiate', {
      callerId: peerId || 'demo-user',
      receiverId: 'target-user',
      roomId,
      callType: 'video'
    });
  };

  const answerCall = () => {
    socketRef.current?.emit('call:answer', { roomId, callerId: 'target-user' });
  };

  return (
    <div className="card">
      <h3>WebRTC Room</h3>
      <p>{connected ? 'Connected' : 'Connecting...'}</p>
      <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room ID" />
      <div className="request-actions">
        <button className="primary-btn" onClick={startCall}>Start Call</button>
        <button className="ghost-btn" onClick={answerCall}>Answer Call</button>
      </div>
    </div>
  );
}
