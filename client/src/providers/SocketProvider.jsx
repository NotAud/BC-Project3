import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from '../composables/socket/SocketContext';

const SOCKET_SERVER_URL = "https://bc-project3.onrender.com";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    setSocket(newSocket);

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