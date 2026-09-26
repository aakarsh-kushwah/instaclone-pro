import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

export default function useCallSocket() {
  const [socketInstance] = useState(socket);

  useEffect(() => {
    socketInstance.on('connect', () => console.log('call socket connected'));
    return () => socketInstance.off();
  }, [socketInstance]);

  return socketInstance;
}
