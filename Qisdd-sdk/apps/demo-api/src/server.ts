// QISDD Demo API: Server Entry Point

import express from 'express';
import routes from './routes';

const app = express();
app.use(express.json());
app.use('/api', routes);

// --- WebSocket server for /api/events ---
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/api/events' });

wss.on('connection', (ws) => {
  // Optionally handle subscribe/auth messages
  ws.on('message', (msg) => {
    // Parse and ignore for now
  });
  // Emit mock events every 4 seconds
  const sendEvent = () => {
    const now = new Date().toISOString();
    const eventTypes = [
      {
        channel: 'access',
        data: {
          event_type: 'access_authorized',
          data_id: 'data_' + Math.random().toString(36).slice(2, 8),
          blockchain_ref: { transaction: '0x' + Math.random().toString(16).slice(2, 10) },
          timestamp: now,
        },
      },
      {
        channel: 'security',
        data: {
          event_type: 'anomaly_detected',
          data_id: 'data_' + Math.random().toString(36).slice(2, 8),
          blockchain_ref: { transaction: '0x' + Math.random().toString(16).slice(2, 10) },
          timestamp: now,
        },
      },
      {
        channel: 'state_changes',
        data: {
          event_type: 'state_collapsed',
          data_id: 'data_' + Math.random().toString(36).slice(2, 8),
          blockchain_ref: { transaction: '0x' + Math.random().toString(16).slice(2, 10) },
          timestamp: now,
        },
      },
    ];
    const evt = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    ws.send(JSON.stringify({ type: 'event', ...evt }));
  };
  const interval = setInterval(sendEvent, 4000);
  ws.on('close', () => clearInterval(interval));
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Demo API running on port ${PORT}`);
  console.log(`WebSocket event stream available at ws://localhost:${PORT}/api/events`);
}); 