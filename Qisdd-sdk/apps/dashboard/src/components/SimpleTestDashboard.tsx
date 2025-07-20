// Simple Test Dashboard Component

import React from 'react';

export default function SimpleTestDashboard() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#1f2937', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>QISDD Dashboard Test</h1>
      <div style={{ backgroundColor: '#374151', padding: '20px', borderRadius: '8px' }}>
        <p>If you can see this, React is working!</p>
        <p>Dashboard should load properly.</p>
      </div>
    </div>
  );
}
