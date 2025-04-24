import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const serverURL = import.meta.env.VITE_SOCKET_SERVER || 'http://localhost:3000';
    console.log('[Socket] Connecting to:', serverURL);

    const socketInstance = io(serverURL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected! Socket ID:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
    });

    setSocket(socketInstance);
    console.log('[Socket] Instance created');

    return () => {
      console.log('[Socket] Disconnecting...');
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    console.warn('[Socket] useSocket must be used within a SocketProvider');
  } else {
    console.log('[Socket] useSocket hook accessed');
  }
  return context;
};
