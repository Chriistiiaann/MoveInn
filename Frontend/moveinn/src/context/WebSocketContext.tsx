import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from '@/context/authcontext';

export interface IWebsocketContext {
  socket: WebSocket | null;
  sendMessage: (receiverId: string, content: string) => void;
  followUser: (targetUserId: string) => void;
  markAsRead: (contactId: string) => void;
  lastMessage: any;
}

const WebsocketContext = createContext<IWebsocketContext | undefined>(undefined);

export const WebsocketProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    const wsUrl = `wss://localhost:7023/api/WebSocket/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;
    setSocket(ws);

    ws.onopen = () => console.log('🟢 [WS] connected to', wsUrl);
    ws.onmessage = (event) => {
      console.log("📩 WS raw data received:", event.data);
      try {
        const parsed = JSON.parse(event.data)
        console.log("🧩 WS received:", parsed) // <-- pon esto temporalmente
        setLastMessage(parsed)
      } catch (e) {
        console.error("⚠️ [WS] invalid JSON", e)
      }
    }
    
    ws.onerror = (err) => console.error('❌ [WS] error', err);
    ws.onclose = () => console.log('🔴 [WS] disconnected');

    // No cerramos aquí en el cleanup para evitar cierres en React Strict Mode o navegación
  }, [token]);

  // Desconectar al hacer logout (token a null)
  useEffect(() => {
    if (!token && socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('🔴 [WS] closing socket due to logout');
      socketRef.current.close(1000, 'Logout');
      setSocket(null);
    }
  }, [token]);

  // Cerrar al recargar/navegar fuera de la página
  useEffect(() => {
    const handleUnload = () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, 'Page unload');
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const sendMessage = (receiverId: string, content: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: 'send_message', receiverId, content }));
    }
  };

  const followUser = (targetUserId: string) => {
    if (!socketRef.current) {
      console.warn("❌ No WebSocket instance.")
      return
    }
  
    if (socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("❌ WebSocket not open. Current state:", socketRef.current.readyState)
      return
    }
  
    const payload = { action: "follow", targetUserId }
    console.log("📤 Sending follow message:", payload)
    socketRef.current.send(JSON.stringify(payload))
  }

  const markAsRead = (contactId: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: 'mark_as_read', contactId }));
    }
  };

  return (
    <WebsocketContext.Provider value={{ socket, sendMessage, followUser, markAsRead, lastMessage }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (!context) throw new Error('useWebsocket debe usarse dentro de WebsocketProvider');
  return context;
};
