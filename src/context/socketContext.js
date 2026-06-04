import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./authContext";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const socketRef = useRef(null);

  const [fraudAlert, setFraudAlert] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
    socketRef.current = io("http://localhost:5000");
    
    // join a room named after this user
    socketRef.current.emit("join_room", { userId: user.id });
    
    socketRef.current.on("fraud_alert", (alert) => {
      setFraudAlert(alert);
    });
  }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user?.id]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, fraudAlert, setFraudAlert }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
};
