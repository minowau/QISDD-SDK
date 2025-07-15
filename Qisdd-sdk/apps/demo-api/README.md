# QISDD Demo API

This is an example API application demonstrating usage of the QISDD-SDK for protecting and accessing sensitive data.

## Audit Trail (Off-Chain, Non-Blockchain)

All major operations (protect, access, erase, etc.) are logged to an off-chain, tamper-evident audit log. API responses for audit include a list of audit events for the given dataId. Blockchain audit is not included in v1.

### Audit Event Structure
```json
{
  "id": "audit_...",
  "timestamp": "2024-01-01T00:00:00Z",
  "userId": "user_123",
  "action": "observe",
  "resource": "data",
  "resourceId": "data_xxx",
  "result": "success",
  "metadata": { ... },
  "ipAddress": "1.2.3.4",
  "userAgent": "Mozilla/5.0 ...",
  "prevHash": "...",
  "hash": "..."
}
```

### GET /api/audit/:id
Retrieve audit log for a protected dataId (off-chain).

**Response:**
```json
{
  "success": true,
  "audit_trail": [
    { "id": "audit_...", "timestamp": "...", ... },
    ...
  ]
}
```

### Exporting Audit Logs
Audit logs can be exported in JSON or CSV format for compliance and reporting.

---

## Blockchain Auditability

All major operations (protect, access, erase) are logged to the blockchain (Polygon) if configured. API responses include a `blockchain_ref` field with the transaction hash for audit/compliance.

## Endpoints

### POST /api/protect
Create quantum-protected data.

**Request:**
```json
{
  "data": { "account": "123456", "balance": 50000 },
  "policy": {
    "observationLimit": 5,
    "timeWindow": { "value": 24, "unit": "hours" },
    "superpositionCount": 3
  }
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "data_xxx",
    "type": "quantum-protected",
    "created_at": "2024-01-01T00:00:00Z",
    "state_count": 3,
    "policy_summary": { "observation_limit": 5, "time_window": { "value": 24, "unit": "hours" } },
    "blockchain_ref": { "txHash": "0xabc123..." }
  }
}
```

### GET /api/data/:id
Access protected data (with context-aware observer effect).

**Headers:**
- `X-API-Key`: (optional)
- `X-Signature`: (optional)
- `X-Purpose`: (optional)
- `X-Request-ID`: (optional)

**Response (authorized):**
```json
{
  "success": true,
  "data": { "account": "123456", "balance": 50000 },
  "metadata": { "state": "healthy" },
  "blockchain_ref": { "txHash": "0xabc123..." }
}
```
**Response (poisoned):**
```json
{
  "success": false,
  "data": { "poisoned": true, "level": "light" },
  "warning": "Poisoned",
  "metadata": { "response_modified": true, "modification_type": "light_poison" },
  "blockchain_ref": { "txHash": "0xabc123..." }
}
```
**Response (collapsed):**
```json
{
  "success": false,
  "error": "DATA_COLLAPSED",
  "message": "Data is no longer accessible due to security violations",
  "metadata": { "collapsed_at": "2024-01-01T00:00:00Z", "reason": "threshold_exceeded" },
  "blockchain_ref": { "txHash": "0xabc123..." }
}
```

### POST /api/verify
Zero-knowledge property verification.

**Request:**
```json
{
  "data_id": "data_xxx",
  "property": "balance_gte",
  "value": 1000
}
```
**Response:**
```json
{
  "success": true,
  "verification": { "valid": true, "proof": { ... } }
}
```

### GET /api/audit/:id
Retrieve audit log (mock).

**Response:**
```json
{
  "success": true,
  "audit_trail": {
    "data_id": "data_xxx",
    "total_events": 3,
    "events": [ ... ],
    "statistics": { "total_accesses": 2, "authorized": 1, "unauthorized": 1, "unique_actors": 2 }
  }
}
```

### POST /api/compute
Perform homomorphic computation on encrypted data.

**Request:**
```json
{
  "operation": "add",
  "data_ids": ["data_xxx", "data_yyy"],
  "parameters": { "field": "balance" }
}
```
**Response:**
```json
{
  "success": true,
  "result": {
    "type": "encrypted",
    "data_id": "data_result_xxx",
    "operation": "add",
    "input_count": 2
  },
  "computation": {
    "duration_ms": 10,
    "noise_budget_remaining": 45,
    "operations_performed": 1
  }
}
```

### PATCH /api/data/:id/policy
Update access policy for protected data.

**Request:**
```json
{
  "updates": {
    "observationLimit": 10,
    "alertThreshold": 5
  },
  "reason": "Increase access limits"
}
```
**Response:**
```json
{
  "success": true,
  "data_id": "data_xxx",
  "updates": { "observationLimit": 10, "alertThreshold": 5 },
  "message": "Policy updated (mock)"
}
```

### DELETE /api/data/:id
Erase (collapse) protected data for compliance.

**Request:**
```json
{
  "verification_token": "token_from_email",
  "reason": "gdpr_request",
  "options": { "preserve_audit_log": true }
}
```
**Response:**
```json
{
  "success": true,
  "erasure": {
    "data_id": "data_xxx",
    "status": "collapsed",
    "method": "quantum_noise",
    "timestamp": "2024-01-01T00:00:00Z",
    "certificate": {
      "id": "cert_xxx",
      "hash": "sha256:xxx",
      "blockchain_ref": { "txHash": "0xabc123..." }
    }
  },
  "affected": {
    "primary_records": 1,
    "entangled_records": 0,
    "notifications_sent": 0
  },
  "blockchainRef": { "txHash": "0xabc123..." }
}
``` 