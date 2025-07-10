// QISDD Demo API: Main Routes

import express from 'express';
import { QISDDClient } from '@qisdd/sdk';

const router = express.Router();
const sdk = new QISDDClient({}); // Use default config for now

// POST /protect - Create protected data
router.post('/protect', async (req, res) => {
  try {
    const { data, policy, metadata } = req.body;
    if (!data || !policy) {
      return res.status(400).json({ success: false, error: 'Missing data or policy' });
    }
    const result = await sdk.protect(data, policy);
    return res.status(201).json({
      success: true,
      data: {
        id: result.id,
        type: 'quantum-protected',
        created_at: new Date().toISOString(),
        state_count: policy.superpositionCount || 3,
        policy_summary: {
          observation_limit: policy.observationLimit || policy.observation_limit,
          time_window: policy.timeWindow || policy.time_window,
        },
        blockchain_ref: result.blockchainRef || null,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /data/:id - Access protected data
router.get('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const credentials = {
      apiKey: req.headers['x-api-key'],
      signature: req.headers['x-signature'],
      timestamp: Date.now(),
      metadata: {
        purpose: req.headers['x-purpose'] || req.query.purpose,
        requestId: req.headers['x-request-id'],
      },
    };
    const result = await sdk.observe(id, credentials);
    if (result.error) {
      if (result.state === 'collapsed') {
        return res.status(410).json({ success: false, error: 'DATA_COLLAPSED', message: 'Data is no longer accessible due to security violations', metadata: { collapsed_at: new Date().toISOString(), reason: 'threshold_exceeded' }, blockchain_ref: result.blockchainRef || null });
      }
      return res.status(403).json({ success: false, error: result.error, blockchain_ref: result.blockchainRef || null });
    }
    if (result.warning) {
      return res.status(200).json({ success: false, data: result.data, warning: result.warning, metadata: { response_modified: true, modification_type: 'light_poison' }, blockchain_ref: result.blockchainRef || null });
    }
    return res.status(200).json({ success: true, data: result.data, metadata: { state: result.state }, blockchain_ref: result.blockchainRef || null });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /verify - Zero-knowledge property verification
router.post('/verify', async (req, res) => {
  try {
    const { data_id, property, value } = req.body;
    if (!data_id || !property || typeof value === 'undefined') {
      return res.status(400).json({ success: false, error: 'Missing data_id, property, or value' });
    }
    const result = await sdk.verify(data_id, property, value);
    return res.status(200).json({ success: true, verification: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /audit/:id - Retrieve audit log (mock)
router.get('/audit/:id', (req, res) => {
  try {
    // For MVP, return a mock audit log
    const { id } = req.params;
    return res.status(200).json({
      success: true,
      audit_trail: {
        data_id: id,
        total_events: 3,
        events: [
          { id: 'evt_001', timestamp: new Date().toISOString(), type: 'data_created', actor: 'user_123', context: { ip: '192.168.1.1' } },
          { id: 'evt_002', timestamp: new Date().toISOString(), type: 'access_authorized', actor: 'api_key_456', context: { ip: '10.0.0.5' } },
          { id: 'evt_003', timestamp: new Date().toISOString(), type: 'access_denied', actor: 'unknown', context: { ip: '45.67.89.10' } },
        ],
        statistics: { total_accesses: 2, authorized: 1, unauthorized: 1, unique_actors: 2 },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /compute - Homomorphic computation
router.post('/compute', (req, res) => {
  try {
    const { operation, data_ids, parameters } = req.body;
    if (!operation || !data_ids || !Array.isArray(data_ids)) {
      return res.status(400).json({ success: false, error: 'Missing operation or data_ids' });
    }
    const result = sdk.compute(operation, data_ids, parameters);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /data/:id/policy - Update access policy
router.patch('/data/:id/policy', (req, res) => {
  try {
    const { id } = req.params;
    const { updates, reason } = req.body;
    if (!updates) {
      return res.status(400).json({ success: false, error: 'Missing updates' });
    }
    const result = sdk.updatePolicy(id, updates);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /data/:id - Erase (collapse) protected data
router.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_token, reason, options } = req.body || {};
    // For now, skip verification
    const result = await sdk.erase(id, options || {});
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router; 