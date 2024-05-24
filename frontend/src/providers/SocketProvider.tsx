import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from '../composables/socket/SocketContext';

const SOCKET_SERVER_URL = "http://localhost:8080";

export const SocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    setSocket(newSocket as any);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};