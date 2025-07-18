// QISDD Dashboard: Blockchain Event Stream Component

import React, { useEffect, useState, useRef } from 'react';

export type BlockchainEvent = {
  type: 'access' | 'audit' | 'state';
  dataId: string;
  txHash: string;
  eventType: string;
  timestamp: string;
};

const MOCK_EVENTS: BlockchainEvent[] = [
  {
    type: 'access',
    dataId: 'data_abc123',
    txHash: '0xabc123...',
    eventType: 'access_authorized',
    timestamp: new Date().toISOString(),
  },
  {
    type: 'audit',
    dataId: 'data_def456',
    txHash: '0xdef456...',
    eventType: 'data_erased',
    timestamp: new Date().toISOString(),
  },
  {
    type: 'state',
    dataId: 'data_xyz789',
    txHash: '0xxyz789...',
    eventType: 'state_collapsed',
    timestamp: new Date().toISOString(),
  },
];

const WS_URL = process.env.REACT_APP_EVENTS_WS_URL || 'ws://localhost:3000/api/events';

export function BlockchainEventStream() {
  const [events, setEvents] = useState<BlockchainEvent[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let fallbackTimeout: NodeJS.Timeout | null = null;
    let closed = false;

    function connect() {
      setStatus('connecting');
      ws = new window.WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        // Authenticate/subscribe if needed
        ws.send(
          JSON.stringify({
            type: 'subscribe',
            channels: ['security', 'access', 'state_changes'],
            filters: { severity: ['medium', 'high', 'critical'] },
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          // Normalize event to BlockchainEvent type
          let evt: BlockchainEvent | null = null;
          if (msg.type === 'event' && msg.channel && msg.data) {
            evt = {
              type:
                msg.channel === 'access'
                  ? 'access'
                  : msg.channel === 'security'
                  ? 'audit'
                  : 'state',
              dataId: msg.data.data_id || msg.data.dataId || 'unknown',
              txHash:
                msg.data.blockchain_ref?.transaction ||
                msg.data.blockchain_ref?.txHash ||
                msg.data.blockchain_ref ||
                '-',
              eventType: msg.data.event_type || msg.data.type || msg.channel,
              timestamp: msg.data.timestamp || new Date().toISOString(),
            };
          }
          if (evt) {
            setEvents((evts) => [...evts, evt].slice(-20));
          }
        } catch (err) {
          // Ignore parse errors
        }
      };

      ws.onerror = () => {
        setStatus('error');
        ws?.close();
      };

      ws.onclose = () => {
        setStatus('disconnected');
        if (!closed) {
          // Fallback to mock data after 2s
          fallbackTimeout = setTimeout(() => {
            setEvents(MOCK_EVENTS);
            setStatus('error');
          }, 2000);
        }
      };
    }

    connect();

    return () => {
      closed = true;
      if (ws) ws.close();
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, margin: 16 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        Blockchain Event Stream
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background:
              status === 'connected'
                ? '#0a0'
                : status === 'connecting'
                ? '#ff0'
                : '#f00',
            display: 'inline-block',
          }}
          title={status}
        />
        <span style={{ fontSize: 12, color: '#888' }}>{status}</span>
      </h3>
      <div style={{ maxHeight: 240, overflowY: 'auto' }}>
        {events.length === 0 && <div>No events yet.</div>}
        {events.map((evt, idx) => (
          <div key={idx} style={{ marginBottom: 8, fontFamily: 'monospace', fontSize: 14 }}>
            <b>{evt.eventType}</b> | <span style={{ color: '#888' }}>{evt.dataId}</span> | <span style={{ color: '#0a0' }}>{evt.txHash}</span> | <span style={{ color: '#888' }}>{evt.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 