import { useState, useEffect, useCallback, useRef } from 'react';
import { MCP_URL } from '../../../config';

export interface UseWebSocketOptions {
  sessionId?: string;
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { sessionId, onMessage, onConnect, onDisconnect, onError } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    const wsUrl = `${MCP_URL.replace('https://', 'wss://').replace('http://', 'ws://')}/studio/ws${sessionId ? `?session=${sessionId}` : ''}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnected(true);
      onConnect?.();
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        onMessage?.(data);
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      onDisconnect?.();
    };
    
    ws.onerror = (error) => {
      onError?.(error);
    };
    
    wsRef.current = ws;
  }, [sessionId, onConnect, onDisconnect, onError, onMessage]);
  
  // Send message
  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);
  
  // Disconnect
  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);
  
  return {
    isConnected,
    lastMessage,
    connect,
    send,
    disconnect,
  };
}
