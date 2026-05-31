import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./authContext";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const socketRef = useRef(null);

  const [fraudAlert, setFraudAlert] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      socketRef.current = io("http://localhost:5000");

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
  }, [isAuthenticated]);

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
