# QISDD Dashboard

A monitoring dashboard for real-time security insights and management of QISDD-protected data. 

## Setup for Local Blockchain Event Streaming

To connect the dashboard to a local backend for live blockchain events:

1. Ensure the demo API is running and exposes a WebSocket at ws://localhost:3000/api/events.
2. Set the following environment variable in your dashboard environment:

   REACT_APP_EVENTS_WS_URL=ws://localhost:3000/api/events

This will enable the dashboard to receive real-time blockchain events from your local backend. 