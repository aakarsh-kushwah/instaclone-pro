import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function VideoCallModal({ visible, roomId, callerId, onClose, onEndCall }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const socket = io('http://localhost:5000', { transports: ['websocket'] });
    socket.emit('call:initiate', { callerId, receiverId: roomId, roomId, callType: 'video' });

    return () => socket.disconnect();
  }, [visible, roomId, callerId]);

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card call-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Video Call</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <video ref={videoRef} autoPlay muted={isMuted} className="call-video" />
        <div className="call-controls">
          <button onClick={() => setIsMuted((prev) => !prev)}>{isMuted ? 'Unmute' : 'Mute'}</button>
          <button onClick={() => setIsCameraOn((prev) => !prev)}>{isCameraOn ? 'Camera off' : 'Camera on'}</button>
          <button className="danger-btn" onClick={onEndCall}>End Call</button>
        </div>
      </div>
    </div>
  );
}
