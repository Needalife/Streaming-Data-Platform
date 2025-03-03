import { useEffect } from 'react';
import { RAW_WS_URL, STRUCTURED_WS_URL } from '../api/websocket';

export const useWebSocket = (onRawMessage, onStructuredMessage) => {
  useEffect(() => {
    const rawWs = new WebSocket(RAW_WS_URL);
    const structuredWs = new WebSocket(STRUCTURED_WS_URL);

    rawWs.onopen = () => console.log('Raw WebSocket connected');
    structuredWs.onopen = () => console.log('Structured WebSocket connected');

    rawWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onRawMessage(data);
      } catch (error) {
        console.error('Error parsing raw message:', error);
      }
    };

    structuredWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onStructuredMessage(data);
      } catch (error) {
        console.error('Error parsing structured message:', error);
      }
    };

    rawWs.onclose = () => console.log('Raw WebSocket closed');
    structuredWs.onclose = () => console.log('Structured WebSocket closed');

    rawWs.onerror = (error) => console.error('Raw WebSocket error:', error);
    structuredWs.onerror = (error) => console.error('Structured WebSocket error:', error);

    return () => {
      rawWs.close();
      structuredWs.close();
    };
  }, [onRawMessage, onStructuredMessage]);
};